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

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
