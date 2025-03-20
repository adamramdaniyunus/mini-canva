"use client"

import { createContext, useContext, useState } from "react";

interface ModalState {
  isOpen: boolean;
  setModal: (e: boolean) => void;
}

const ModalStateContext = createContext<ModalState | undefined>(undefined);

export const ModalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setModal] = useState<boolean>(false);
  return (
    <ModalStateContext.Provider value={{ isOpen, setModal }}>
      {children}
    </ModalStateContext.Provider>
  );
};

// hooks
export const useModalState = () => {
  const context = useContext(ModalStateContext);
  if (!context) {
    throw new Error("useModalState must be used within a ModalStateProvider");
  }
  return context;
};
