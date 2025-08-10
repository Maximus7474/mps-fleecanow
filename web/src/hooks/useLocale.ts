import type { RawLocales } from '@common/types';
import { createContext, useContext } from 'react';

type LocaleContextType = {
  T: (key: RawLocales, args?: { [key: string]: string|number }) => string;
  UpdateLocale: (locale: string) => void;
};

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within an LocaleProvider');
  }
  return context;
}
