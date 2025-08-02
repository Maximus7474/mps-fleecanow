import { LoadFile } from './utils';

// https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types/
export type FlattenObjectKeys<T extends Record<string, any>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
  ? `${Key}.${FlattenObjectKeys<T[Key]>}`
  : `${Key}`
  : never;

type RawLocales = FlattenObjectKeys<typeof import('../../locales/en.json')>;

const localeData = LoadFile('locales/en.json');

const Locale = (
  key: RawLocales,
  args: {[key: string]: string | number} = {}
) => {
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

  let localizedString = currentLocale;

  for (const argKey in args) {
    if (args.hasOwnProperty(argKey)) {
      const regex = new RegExp(`\\{${argKey}\\}`, 'g');
      localizedString = localizedString.replace(regex, String(args[argKey]));
    }
  }

  return localizedString;
}

export default Locale;
