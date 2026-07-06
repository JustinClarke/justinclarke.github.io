/**
 * ModalProvider owns the open/closed state of the site-wide pop-up dialogs
 * (the Contact modal and the Email modal).
 *
 * Fits in: one of the providers in RootProviders, so it sits above every page.
 *          Any component can open/close a modal via the useModal() hook.
 * Note:    the modals themselves (<ContactModal/>, <EmailModal/>) are rendered
 *          once in App.tsx; they read this state to decide whether to show.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { track } from '@/utils';

interface ModalContextType {
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  openContactModal: () => void;
  closeContactModal: () => void;
  isEmailModalOpen: boolean;
  openEmailModal: () => void;
  closeEmailModal: () => void;
}

// Defaults to `undefined` so useModal() can throw a clear error when a consumer
// isn't wrapped in <ModalProvider>.
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Record open events so reach-out frequency shows up in analytics.
  const openContactModal = () => { track('contact-open'); setIsContactModalOpen(true); };
  const closeContactModal = () => setIsContactModalOpen(false);
  const openEmailModal = () => { track('email-open'); setIsEmailModalOpen(true); };
  const closeEmailModal = () => setIsEmailModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isContactModalOpen,
        setIsContactModalOpen,
        openContactModal,
        closeContactModal,
        isEmailModalOpen,
        openEmailModal,
        closeEmailModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * useModal the hook components call to read modal state or open/close a modal.
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
