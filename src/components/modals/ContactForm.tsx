import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Check } from 'lucide-react';

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
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Name Field */}
        <div className="relative">
          <label htmlFor="name" className="sr-only">Your Name (Required)</label>
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              required
              disabled={status === 'loading'}
              value={formData.name}
              onBlur={() => handleBlur('name')}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`flex h-12 w-full rounded-md border bg-white/5 px-4 py-2 text-[16px] placeholder:text-gray-500 focus-ring transition-all ${
                touched.name ? (errors.name ? 'border-red-500/50' : 'border-green-500/50') : 'border-white/10'
              }`}
            />
            {touched.name && !errors.name && formData.name && <Check className="absolute right-3 top-3.5 h-4 w-4 text-green-500" />}
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="relative">
          <label htmlFor="email" className="sr-only">Email Address (Required)</label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              required
              disabled={status === 'loading'}
              value={formData.email}
              onBlur={() => handleBlur('email')}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`flex h-12 w-full rounded-md border bg-white/5 px-4 py-2 text-[16px] placeholder:text-gray-500 focus-ring transition-all ${
                touched.email ? (errors.email ? 'border-red-500/50' : 'border-green-500/50') : 'border-white/10'
              }`}
            />
            {touched.email && !errors.email && formData.email && <Check className="absolute right-3 top-3.5 h-4 w-4 text-green-500" />}
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.email}</p>}
        </div>

        {/* Message Field */}
        <div className="relative">
          <label htmlFor="message" className="sr-only">Your Message (Required)</label>
          <div className="relative">
            <textarea
              id="message"
              placeholder="Tell me about your project..."
              required
              rows={4}
              disabled={status === 'loading'}
              value={formData.message}
              onBlur={() => handleBlur('message')}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`flex w-full rounded-md border bg-white/5 px-4 py-3 text-[16px] placeholder:text-gray-500 focus-ring resize-none transition-all ${
                touched.message ? (errors.message ? 'border-red-500/50' : 'border-green-500/50') : 'border-white/10'
              }`}
            />
          </div>
          <div className="flex justify-between mt-1">
            {errors.message ? (
              <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.message}</p>
            ) : <div />}
            <span className="text-[10px] text-gray-500 font-mono">{formData.message.length} chars</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {status === 'error' ? (
          <div className="space-y-3">
            <div role="alert" className="flex items-center justify-center gap-2 text-red-400 py-3 bg-red-950/20 border border-red-500/30 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-semibold">Submission failed. Please try again.</span>
            </div>
            <button 
              type="button" 
              onClick={resetStatus}
              className="w-full text-xs text-gray-400 underline hover:text-white transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === 'loading' || !isFormValid}
            className="group relative flex w-full items-center justify-center gap-2 rounded-md bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-brand-primary disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span className="smooth-underline after:bg-black group-hover:after:bg-white tracking-widest font-bold uppercase transition-all duration-300">Submit</span>
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};
