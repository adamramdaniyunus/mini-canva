"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DesignState = {
  state: { width: number; height: number } | null;
  setState: (state: { width: number; height: number } | null) => void;
  isLoading: boolean;
  setLoading: (e:boolean) => void;
};

const DesignContext = createContext<DesignState | undefined>(undefined);

export const DesignProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <DesignContext.Provider value={{ state, setState, isLoading, setLoading }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesignState = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error(
      "useDesignState must be used within DesignProvider"
    );
  }
  return context;
};
