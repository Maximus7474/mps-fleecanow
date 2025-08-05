import { createContext, useContext } from 'react';

// https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types/
export type FlattenObjectKeys<T extends Record<string, any>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
  ? `${Key}.${FlattenObjectKeys<T[Key]>}`
  : `${Key}`
  : never;

export type RawLocales = FlattenObjectKeys<typeof import('../../../locales/en.json').UI>;

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
