import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';
import { ContactForm } from './ContactForm';

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
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] animate-in fade-in duration-300" />
        <Dialog.Content 
          onCloseAutoFocus={(e) => {
            // Restore context to the trigger or a reasonable default to prevent scroll jump
            if (document.activeElement === document.body) {
              e.preventDefault();
              window.scrollTo({ top: window.scrollY, behavior: 'instant' });
            }
          }}
          className="fixed left-[50%] top-[50%] z-[10001] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#111] p-8 shadow-2xl duration-200 animate-in zoom-in-95 sm:rounded-2xl text-white outline-none"
        >
          
          <div className="flex flex-col space-y-1.5 mb-6">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold tracking-tight">Let's work together</Dialog.Title>
            </div>
            <Dialog.Description className="text-[15px] text-gray-300 leading-relaxed">
              Fill out the form below and I'll get back to you as soon as I can.
              <span className="block text-[12px] text-gray-500 mt-2 font-medium italic">* All fields are required</span>
            </Dialog.Description>
          </div>

          <ContactForm 
            onSubmit={handleSubmit} 
            status={status} 
            resetStatus={() => setStatus('idle')} 
          />

          <Dialog.Close className="absolute right-2 top-2 p-3 rounded-full opacity-70 transition-all hover:bg-white/10 active:bg-white/20 hover:opacity-100 active:scale-95 text-white outline-none focus-ring">
            <X className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Close discussion modal</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
