import { createContext, useContext } from 'react';

const ComplianceContext = createContext(null);

export const ComplianceProvider = ({ children }: { children: React.ReactNode }) => {
  return <ComplianceContext.Provider value={{}}>{children}</ComplianceContext.Provider>;
};

export const useCompliance = () => useContext(ComplianceContext);
