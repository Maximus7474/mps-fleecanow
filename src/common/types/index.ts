export * from './user';
export * from './transfer';
export * from './callbacks';

export type BasicResponse = { success: true } | { success: false; message: string };

// https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types/
export type FlattenObjectKeys<T extends Record<string, any>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
  ? `${Key}.${FlattenObjectKeys<T[Key]>}`
  : `${Key}`
  : never;

export type RawLocales = FlattenObjectKeys<typeof import('../../../locales/en.json').UI>;
