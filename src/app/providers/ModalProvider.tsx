/**
 * ModalProvider owns the open/closed state of the site-wide pop-up dialogs
 * (the Contact modal and the Email modal).
 *
 * Fits in: one of the providers in RootProviders, so it sits above every page.
 *          Any component can open/close a modal via the useModal() hook.
 * Note:    the modals themselves (<ContactModal/>, <EmailModal/>) are rendered
 *          once in App.tsx; they read this state to decide whether to show.
 *
 * For beginners ----------------------------------------------------------------
 * "Context" solves prop-drilling. Without it, to let a deeply-nested button open
 * a modal, you'd have to pass an `openModal` function down through every layer
 * in between. Context is like a global bulletin board: the Provider pins the
 * state up here at the top, and any component below can read it directly with
 * useModal() no passing through the middle.
 * -----------------------------------------------------------------------------
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { track } from '@/utils';

// LEARN: This interface is the "shape" of what useModal() hands back: which modals
//    are open (booleans) and the functions to open/close them.
interface ModalContextType {
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  openContactModal: () => void;
  closeContactModal: () => void;
  isEmailModalOpen: boolean;
  openEmailModal: () => void;
  closeEmailModal: () => void;
}

// LEARN: createContext makes the bulletin board. It starts as `undefined` so we can
//    detect (in useModal below) when someone forgot to wrap their tree in this
//    Provider that's a common, confusing bug, and we turn it into a clear error.
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // LEARN: `track(...)` sends a privacy-friendly analytics event (see utils/track).
  //    We record an "open" event so we can see how often visitors reach out.
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
 *
 * LEARN: Custom hooks are just functions whose name starts with "use" and that call
 *    other hooks inside. This one reads the Context and guards against misuse:
 *    if `context` is undefined, the component wasn't wrapped in <ModalProvider>,
 *    so we throw a clear, named error instead of a cryptic "cannot read property
 *    of undefined" crash later on.
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
