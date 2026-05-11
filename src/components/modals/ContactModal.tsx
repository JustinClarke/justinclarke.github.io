import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';
import { ContactForm } from './ContactForm';

/**
 * ContactModal Component
 * 
 * Secure entry point for project inquiries and networking.
 * Uses Radix UI Dialog for accessible modal behavior.
 * Migration Status: Colors moved to theme-aware tokens (brand-modal, brand-primary).
 */

export const ContactModal = () => {
  const { isContactModalOpen, setIsContactModalOpen } = useModal();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first input on open
  useEffect(() => {
    if (isContactModalOpen) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isContactModalOpen]);

  const handleSubmit = async (formData: { name: string; email: string; message: string }) => {
    setStatus('loading');

    const payload = {
      data: [
        {
          ...formData,
          date: new Date().toLocaleString()
        }
      ]
    };

    try {
      const response = await fetch('https://sheetdb.io/api/v1/alyn3e2mqkktu', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok && result.created >= 1) {
        setStatus('success');

        setTimeout(() => {
          setIsContactModalOpen(false);
          setTimeout(() => setStatus('idle'), 500);
        }, 2500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <Dialog.Root open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
      <AnimatePresence>
        {isContactModalOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
                animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, scale: 0.95, y: 10, x: '-50%' }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="fixed left-[50%] top-[50%] z-[10001] grid w-full max-w-lg translate-y-[-50%] gap-4 border border-white/[0.08] bg-brand-modal/95 backdrop-blur-2xl p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] sm:rounded-3xl text-white outline-none overflow-hidden"
              >
                {/* HUD Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-primary/40 rounded-tl-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-primary/40 rounded-br-3xl pointer-events-none" />

                {/* Background Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>

                {/* Technical Header */}
                <div className="relative z-10 flex flex-col space-y-2 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(0,200,180,0.6)]" />
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-brand-primary/60 font-bold">Channel_Open // Discussion</span>
                  </div>
                  <Dialog.Title className="text-3xl font-black tracking-tighter font-playfair italic">Let's work together</Dialog.Title>
                  <Dialog.Description className="text-sm text-white/50 leading-relaxed font-mono mt-1">
                    Establishing direct communication uplink.
                    <span className="block text-[10px] text-white/30 mt-3 font-bold uppercase tracking-widest italic">// All fields required for handshake</span>
                  </Dialog.Description>
                </div>

                <div className="relative z-10">
                  <ContactForm
                    onSubmit={handleSubmit}
                    status={status}
                    resetStatus={() => setStatus('idle')}
                  />
                </div>

                {/* HUD Meta Footer */}
                <div className="relative z-10 mt-6 flex justify-between items-center opacity-20 font-mono text-[8px] tracking-[0.2em] uppercase">
                  <span>MOD_v4.2 //</span>
                  <span>Latency: 2ms</span>
                </div>

                <Dialog.Close className="absolute right-4 top-4 p-2 rounded-full opacity-40 transition-all hover:bg-white/10 active:bg-white/20 hover:opacity-100 active:scale-95 text-white outline-none focus-ring z-20">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close discussion modal</span>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
