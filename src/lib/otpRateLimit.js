const STORAGE_KEY = 'np_otp_send_log';
const COOLDOWN_MS = 60_000;
const MAX_SENDS_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

function readLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function writeLog(log) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

function phoneKey(phone) {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return digits || phone;
}

function pruneOldEntries(log, now = Date.now()) {
  const next = {};
  for (const [key, timestamps] of Object.entries(log)) {
    const recent = (timestamps || []).filter((ts) => now - ts < HOUR_MS);
    if (recent.length) next[key] = recent;
  }
  return next;
}

export function canSendOtp(phone) {
  const key = phoneKey(phone);
  const now = Date.now();
  const log = pruneOldEntries(readLog(), now);
  writeLog(log);

  const timestamps = log[key] || [];
  if (timestamps.length >= MAX_SENDS_PER_HOUR) {
    const oldest = Math.min(...timestamps);
    const waitMs = HOUR_MS - (now - oldest);
    return {
      allowed: false,
      waitSeconds: Math.ceil(waitMs / 1000),
      reason: 'hourly',
    };
  }

  const lastSent = timestamps[timestamps.length - 1];
  if (lastSent && now - lastSent < COOLDOWN_MS) {
    return {
      allowed: false,
      waitSeconds: Math.ceil((COOLDOWN_MS - (now - lastSent)) / 1000),
      reason: 'cooldown',
    };
  }

  return { allowed: true, waitSeconds: 0, reason: null };
}

export function recordOtpSend(phone) {
  const key = phoneKey(phone);
  const now = Date.now();
  const log = pruneOldEntries(readLog(), now);
  log[key] = [...(log[key] || []), now];
  writeLog(log);
}

export function getOtpCooldownSeconds(phone) {
  return canSendOtp(phone).waitSeconds;
}

export function formatOtpRateLimitMessage(result) {
  if (result.reason === 'hourly') {
    const minutes = Math.max(1, Math.ceil(result.waitSeconds / 60));
    return `Too many OTP requests. Try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`;
  }
  if (result.reason === 'cooldown') {
    return `Please wait ${result.waitSeconds}s before requesting another OTP.`;
  }
  return 'Too many OTP requests. Please try again later.';
}

export function parseOtpSendError(error) {
  const message = (error?.message || '').toLowerCase();
  const status = error?.status || error?.code;

  if (
    status === 429 ||
    message.includes('rate limit') ||
    message.includes('too many') ||
    message.includes('over_email_send_rate_limit') ||
    message.includes('over_sms_send_rate_limit')
  ) {
    return 'Too many OTP requests from this device or number. Please wait a few minutes and try again.';
  }

  return error?.message || 'Could not send OTP. Please try again.';
}

export const OTP_COOLDOWN_SECONDS = COOLDOWN_MS / 1000;
