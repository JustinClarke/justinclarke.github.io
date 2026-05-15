import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/utils';

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; message: string }) => Promise<void>;
  status: 'idle' | 'loading' | 'success' | 'error';
  resetStatus: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, status, resetStatus }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

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
    if (isFormValid) {
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
          <p className="text-gray-400 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        {/* Name Field */}
        <div className="relative group">
          <div className="flex justify-between items-center mb-1.5 px-1">
            <label htmlFor="name" className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 group-focus-within:text-brand-primary transition-colors">
              [NAME]
            </label>
            {touched.name && errors.name && <span className="text-[9px] text-red-400/80 font-mono uppercase">ERR_VAL</span>}
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
                "flex h-14 w-full rounded-xl border bg-white/[0.03] px-5 py-2 font-mono text-[14px] tracking-wide placeholder:text-white/20 transition-all duration-300 outline-none",
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
            <label htmlFor="email" className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 group-focus-within:text-brand-primary transition-colors">
              [EMAIL]
            </label>
            {touched.email && errors.email && <span className="text-[9px] text-red-400/80 font-mono uppercase">ERR_FMT</span>}
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
                "flex h-14 w-full rounded-xl border bg-white/[0.03] px-5 py-2 font-mono text-[14px] tracking-wide placeholder:text-white/20 transition-all duration-300 outline-none",
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
            <label htmlFor="message" className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 group-focus-within:text-brand-primary transition-colors">
              [MESSAGE]
            </label>
            <span className="text-[9px] text-white/20 font-mono">{formData.message.length} / 500 CHARS</span>
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
                "flex w-full rounded-xl border bg-white/[0.03] px-5 py-4 font-mono text-[14px] tracking-wide placeholder:text-white/20 resize-none transition-all duration-300 outline-none",
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
        {status === 'error' ? (
          <div className="space-y-4">
            <div role="alert" className="flex items-center justify-center gap-3 text-red-400 py-4 bg-red-950/20 border border-red-500/30 rounded-xl font-mono text-xs uppercase tracking-widest font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>Submission_Failed // Retry_Required</span>
            </div>
            <button 
              type="button" 
              onClick={resetStatus}
              className="w-full text-[10px] text-white/30 hover:text-white transition-colors font-mono uppercase tracking-[0.3em]"
            >
              [ TRY AGAIN ]
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === 'loading' || !isFormValid}
            className={cn(
              "group relative flex w-full items-center justify-center gap-4 rounded-xl px-8 py-5 text-[11px] font-bold uppercase tracking-[0.3em] font-mono transition-all duration-500 overflow-hidden",
              isFormValid && status !== 'loading'
                ? "bg-brand-primary text-black shadow-[0_0_40px_rgba(0,200,180,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
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
      </div>
    </form>
  );
};
