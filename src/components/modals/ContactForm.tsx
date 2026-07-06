/**
 * ContactForm the name/email/message fields, their validation, and the
 * submit button. Sending is delegated to the parent via `onSubmit`.
 *
 * Fits in: rendered inside ContactModal.
 * Note:    two anti-spam guards live here a hidden "honeypot" field (bots fill
 *          it, humans can't see it) and a 3-minute cooldown stored in
 *          localStorage so the same device can't spam submissions.
 */
import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; message: string }) => Promise<void>;
  status: 'idle' | 'loading' | 'success' | 'error';
  resetStatus: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, status, resetStatus }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [botField, setBotField] = useState('');
  const [cooldownError, setCooldownError] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const errors = {
    name: touched.name && formData.name.trim().length < 2 ? 'Name must be at least 2 characters' : '',
    email: touched.email && !validateEmail(formData.email) ? 'Please enter a valid email' : '',
    message: touched.message && formData.message.trim().length < 10 ? 'Message must be at least 10 characters' : ''
  };

  const isFormValid = 
    formData.name.trim().length >= 2 && 
    validateEmail(formData.email) && 
    formData.message.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot check (silently drop bot submissions)
    if (botField) {
      console.warn("Spam attempt neutralized.");
      return;
    }

    // 2. Cooldown check (3 minutes limit per submission from same device)
    const lastSubmit = localStorage.getItem('contact_last_submit');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit, 10) < 180000) {
      setCooldownError(true);
      return;
    }

    if (isFormValid) {
      localStorage.setItem('contact_last_submit', now.toString());
      setCooldownError(false);
      onSubmit(formData);
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  if (status === 'success') {
    return (
      <div role="status" className="flex flex-col items-center justify-center gap-4 py-12 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
          <CheckCircle2 className="h-8 w-8 text-brand-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-gray-400 text-sm">Thank you for reaching out.</p>
          <p className="font-mono text-micro text-brand-primary/70 uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-brand-primary/70 animate-pulse" />
            You'll hear back within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        {/* Honeypot field (hidden from users, screen readers) */}
        <div className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website_url">Website URL</label>
          <input
            id="website_url"
            type="text"
            tabIndex={-1}
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Name Field */}
        <div className="relative group">
          <div className="flex justify-between items-center mb-1.5 px-1">
            <label htmlFor="name" className="font-mono text-micro uppercase tracking-mega text-text-tertiary group-focus-within:text-brand-primary transition-colors">
              [NAME]
            </label>
            {touched.name && errors.name && <span className="text-micro text-red-400/80 font-mono uppercase">ERR_VAL</span>}
          </div>
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder="YOUR NAME"
              required
              disabled={status === 'loading'}
              value={formData.name}
              onBlur={() => handleBlur('name')}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={cn(
                "flex h-14 w-full rounded-xl border bg-white/[0.03] px-5 py-2 font-mono text-base md:text-sm tracking-wide placeholder:text-text-ghost transition-all duration-300 outline-none",
                touched.name 
                  ? errors.name 
                    ? 'border-red-500/30 focus:border-red-500/60' 
                    : 'border-brand-primary/30 focus:border-brand-primary shadow-[0_0_20px_rgba(0,200,180,0.05)]' 
                  : 'border-white/10 focus:border-white/30 focus:bg-white/[0.05]'
              )}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="relative group">
          <div className="flex justify-between items-center mb-1.5 px-1">
            <label htmlFor="email" className="font-mono text-micro uppercase tracking-mega text-text-tertiary group-focus-within:text-brand-primary transition-colors">
              [EMAIL]
            </label>
            {touched.email && errors.email && <span className="text-micro text-red-400/80 font-mono uppercase">ERR_FMT</span>}
          </div>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="EMAIL@PROTOCOL.HOST"
              required
              disabled={status === 'loading'}
              value={formData.email}
              onBlur={() => handleBlur('email')}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={cn(
                "flex h-14 w-full rounded-xl border bg-white/[0.03] px-5 py-2 font-mono text-base md:text-sm tracking-wide placeholder:text-text-ghost transition-all duration-300 outline-none",
                touched.email 
                  ? errors.email 
                    ? 'border-red-500/30 focus:border-red-500/60' 
                    : 'border-brand-primary/30 focus:border-brand-primary shadow-[0_0_20px_rgba(0,200,180,0.05)]' 
                  : 'border-white/10 focus:border-white/30 focus:bg-white/[0.05]'
              )}
            />
          </div>
        </div>

        {/* Message Field */}
        <div className="relative group">
          <div className="flex justify-between items-center mb-1.5 px-1">
            <label htmlFor="message" className="font-mono text-micro uppercase tracking-mega text-text-tertiary group-focus-within:text-brand-primary transition-colors">
              [MESSAGE]
            </label>
            <span className="text-micro text-text-tertiary font-mono">{formData.message.length} / 500 CHARS</span>
          </div>
          <div className="relative">
            <textarea
              id="message"
              placeholder="TELL ME ABOUT YOUR PROJECT..."
              required
              rows={4}
              disabled={status === 'loading'}
              value={formData.message}
              onBlur={() => handleBlur('message')}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={cn(
                "flex w-full rounded-xl border bg-white/[0.03] px-5 py-4 font-mono text-base md:text-sm tracking-wide placeholder:text-text-ghost resize-none transition-all duration-300 outline-none",
                touched.message 
                  ? errors.message 
                    ? 'border-red-500/30 focus:border-red-500/60' 
                    : 'border-brand-primary/30 focus:border-brand-primary shadow-[0_0_20px_rgba(0,200,180,0.05)]' 
                  : 'border-white/10 focus:border-white/30 focus:bg-white/[0.05]'
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        {cooldownError && (
          <div role="alert" className="flex items-center justify-center gap-3 text-amber-400 py-4 mb-4 bg-amber-950/20 border border-amber-500/30 rounded-xl font-mono text-xs uppercase tracking-widest font-bold animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4" />
            <span>Rate_Limit_Exceeded // Cooldown_Active</span>
          </div>
        )}

        {status === 'error' ? (
          <div className="space-y-4">
            <div role="alert" className="flex items-center justify-center gap-3 text-red-400 py-4 bg-red-950/20 border border-red-500/30 rounded-xl font-mono text-xs uppercase tracking-widest font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>Submission_Failed // Retry_Required</span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setCooldownError(false);
                resetStatus();
              }}
              className="w-full text-micro text-text-tertiary hover:text-white transition-colors font-mono uppercase tracking-ultra"
            >
              [ TRY AGAIN ]
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === 'loading' || !isFormValid || cooldownError}
            className={cn(
              "group relative flex w-full items-center justify-center gap-4 rounded-xl px-8 py-5 text-fine font-bold uppercase tracking-ultra font-mono transition-all duration-500 overflow-hidden",
              isFormValid && status !== 'loading' && !cooldownError
                ? "bg-brand-primary text-black shadow-[0_0_40px_rgba(0,200,180,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/5 text-text-ghost border border-white/10 cursor-not-allowed"
            )}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>SENDING...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">SEND MESSAGE</span>
                <span className="relative z-10 transition-transform group-hover:translate-x-2" aria-hidden="true">→</span>
                
                {/* Submit Glow Effect */}
                {isFormValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}
              </>
            )}
          </button>
        )}

        {/* GDPR & UAE PDPL Privacy Consent Micro-Copy */}
        <p className="font-mono text-micro md:text-micro text-text-tertiary text-center leading-normal mt-4 max-w-xs mx-auto uppercase tracking-wide">
          By submitting this form, you consent to the secure collection of your details strictly for responding to your inquiry (UAE PDPL & GDPR).
        </p>
      </div>
    </form>
  );
};
