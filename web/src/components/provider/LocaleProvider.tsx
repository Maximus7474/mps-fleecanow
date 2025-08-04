import { useState, type ReactNode, useEffect } from 'react';
import { LocaleContext, type RawLocales } from '../../hooks/useLocale';
import { fetchNui } from '../../utils/fetchNui';
import type { LocaleData } from '@common/locale';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localeData, setLocaleData] = useState<LocaleData>({});

  useEffect(() => {
    fetchNui<LocaleData>('fleecanow:getlocale', {})
    .then((locale) => {
      if (!locale) return;

      setLocaleData(locale);
    });
  }, []);

  const T = (key: RawLocales, args?: { [key: string]: string|number }): string => {
    const keyParts = key.split('.');
    let currentLocale = localeData;
    let found = true;

    for (const part of keyParts) {
      if (currentLocale && typeof currentLocale === 'object' && currentLocale.hasOwnProperty(part)) {
        currentLocale = currentLocale[part];
      } else {
        found = false;
        break;
      }
    }

    if (!found || typeof currentLocale !== 'string') {
      return key;
    }

    let localizedString: string = currentLocale;

    for (const argKey in args) {
      if (args.hasOwnProperty(argKey)) {
        const regex = new RegExp(`\\{${argKey}\\}`, 'g');
        localizedString = localizedString.replace(regex, String(args[argKey]));
      }
    }

    return localizedString;
  };

  const UpdateLocale = (locale: string): void => {
    fetchNui<LocaleData>('fleecanow:getLocale', { locale })
    .then((locale) => {
      if (!locale) return;
      setLocaleData(locale);
    })
    .catch(err => console.error(`Unable to fetch new locale (${locale}) data:`, err.message));
  };

  return (
    <LocaleContext.Provider value={{ T, UpdateLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
