import React, { useState } from 'react';
import { Mail, Copy, Mail as MailOpen } from 'lucide-react';
import { useModal } from '@/providers/ModalProvider';
import { track } from '@/utils';

const EMAIL = 'justinsavioclarke@outlook.com';

export const EmailModal = () => {
  const { isEmailModalOpen, closeEmailModal } = useModal();
  const [copied, setCopied] = useState(false);

  if (!isEmailModalOpen) return null;

  const handleCopy = () => {
    const doFallback = () => {
      const el = document.createElement('textarea');
      el.value = EMAIL;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(EMAIL).catch(doFallback);
    } else {
      doFallback();
    }
    track('email-copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={closeEmailModal}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in scale-in duration-300">
        <div className="bg-[#0c1110] border border-white/10 rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] w-full max-w-sm p-6 md:p-8">
          <h2 className="font-mono text-[11px] text-brand-primary tracking-[0.2em] mb-6 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            EMAIL ACTION
          </h2>

          <p className="font-mono text-sm md:text-base text-[#e8e6e0] mb-2 break-all select-all">
            {EMAIL}
          </p>
          <p className="font-mono text-xs text-white/40 mb-8">
            choose how you'd like to proceed
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopy}
              className="w-full px-4 py-3 md:px-5 md:py-3.5 bg-brand-primary hover:bg-[#00b4a0] text-black border border-brand-primary rounded-lg font-mono text-[10px] md:text-[11px] font-black tracking-[0.25em] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[0_10px_25px_-5px_rgba(0,200,180,0.22)] active:scale-95 duration-200"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'COPIED' : 'COPY TO CLIPBOARD'}</span>
            </button>

            <a
              href={`mailto:${EMAIL}`}
              onClick={closeEmailModal}
              className="w-full px-4 py-3 md:px-5 md:py-3.5 bg-transparent hover:bg-white/[0.03] text-[#e8e6e0] border border-white/15 rounded-lg font-mono text-[10px] md:text-[11px] font-black tracking-[0.25em] flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 duration-200"
            >
              <MailOpen className="w-4 h-4" />
              <span>OPEN EMAIL APP</span>
            </a>

            <button
              onClick={closeEmailModal}
              className="w-full px-4 py-2 md:px-5 md:py-2.5 text-white/40 font-mono text-[10px] md:text-[11px] font-semibold tracking-[0.1em] hover:text-white/60 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
