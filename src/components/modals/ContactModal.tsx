/**
 * ContactModal the popup dialog that holds the contact form and sends it.
 *
 * Fits in: mounted once in App.tsx; opens when the shared modal state flips on.
 * Note:    this component owns the NETWORK side (submit to web3forms + the
 *          idle/loading/success/error status); ContactForm owns the fields and
 *          validation. Splitting them keeps each piece small.
 */
import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';
import { SITE, type SiteConfig } from '@/content';
import { ContactForm } from './ContactForm';

// Widened to the config union so the null branch stays a checked code path
// even while this deployment has the integration switched on.
const CONTACT_FORM: SiteConfig['integrations']['contactForm'] = SITE.integrations.contactForm;

export const ContactModal = () => {
  const { isContactModalOpen, setIsContactModalOpen } = useModal();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const firstInputRef = useRef<HTMLInputElement>(null);

  // On open: lock body scroll and move focus into the first field (delayed until
  // it has mounted). Cleanup clears the timer; the `else` restores scroll on close.
  useEffect(() => {
    if (isContactModalOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
  }, [isContactModalOpen]);

  const handleSubmit = async (formData: { name: string; email: string; message: string }) => {
    if (!CONTACT_FORM) return; // integration off: the form never renders

    setStatus('loading');

    const payload = {
      access_key: CONTACT_FORM.web3formsKey,
      subject: `New message from ${formData.name}`,
      from_name: SITE.domain,
      ...formData,
      date: new Date().toLocaleString()
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok && result.success) {
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
                className="fixed left-[50%] top-[50%] z-[10001] grid w-full max-w-lg translate-y-[-50%] gap-4 bg-brand-modal/95 backdrop-blur-2xl p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] text-white outline-none overflow-hidden sm:border sm:border-white/8 sm:rounded-3xl"
              >

                {/* Background Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>

                {/* Technical Header */}
                <div className="relative z-10 flex flex-col space-y-2 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(0,200,180,0.6)]" />
                    <span className="font-mono text-micro tracking-[0.4em] uppercase text-brand-primary/60 font-bold">Contact // Collaboration</span>
                  </div>
                  <Dialog.Title className="text-3xl font-black tracking-tighter font-playfair italic">Let's work together</Dialog.Title>
                  <Dialog.Description className="text-sm text-text-tertiary leading-relaxed font-mono mt-1">
                    Send a message and I'll get back to you soon.
                    {CONTACT_FORM && (
                      <span className="block text-micro text-text-tertiary mt-3 font-bold uppercase tracking-widest italic">// Please fill in all fields</span>
                    )}
                  </Dialog.Description>
                </div>

                <div className="relative z-10">
                  {CONTACT_FORM ? (
                    <ContactForm
                      key={isContactModalOpen ? 'open' : 'closed'}
                      onSubmit={handleSubmit}
                      status={status}
                      resetStatus={() => setStatus('idle')}
                    />
                  ) : (
                    /* Degradation: no form backend on this deployment offer email directly. */
                    <div className="flex flex-col gap-4 py-4">
                      <p className="font-mono text-sm text-paper break-all select-all">{SITE.email}</p>
                      <a
                        href={`mailto:${SITE.email}`}
                        className="w-full px-4 py-3.5 bg-brand-primary hover:brightness-110 text-black rounded-lg font-mono text-fine font-black tracking-[0.25em] flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 duration-200"
                      >
                        <Mail className="w-4 h-4" />
                        <span>OPEN EMAIL APP</span>
                      </a>
                    </div>
                  )}
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
