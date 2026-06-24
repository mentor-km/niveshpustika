import { useEffect, useRef } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function PwaUpdatePrompt() {
  const { toast } = useToast();
  const updateSWRef = useRef(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;

    updateSWRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        toast({
          title: 'Update available',
          description: 'A new version of Nivesh Pustika is ready.',
          duration: Infinity,
          action: (
            <Button
              size="sm"
              className="bg-[#2d8b8b] hover:bg-[#267a7a] text-white shrink-0"
              onClick={() => updateSWRef.current?.(true)}
            >
              Refresh
            </Button>
          ),
        });
      },
    });

    return undefined;
  }, [toast]);

  return null;
}
