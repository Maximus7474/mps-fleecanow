import { resourceExport } from '@common/export';

export type CallbackHandler<T extends any[] = any[], R = void> = (source: number, ...args: T) => R;
export type LegacyCallbackHandler<T extends any[] = any[], R = void> = (
  source: number,
  cb: (...res: R[]) => void,
  ...args: T
) => void;

/**
 * Wrapper for server-side callback registration.
 *
 * @param event The event name.
 * @param handler Function to run when callback is triggered.
 */
export function RegisterCallback<T extends any[] = any[], R = void>(
  event: string,
  handler: CallbackHandler<T, R>,
): void {
  resourceExport('lb-phone', 'RegisterCallback')(event, handler);
}

/**
 * Wrapper for server-side legacy callback registration.
 *
 * @param event The event name.
 * @param handler Function to run, with an explicit response callback.
 */
export function RegisterLegacyCallback<T extends any[] = any[], R = void>(
  event: string,
  handler: LegacyCallbackHandler<T, R>,
): void {
  resourceExport('lb-phone', 'RegisterLegacyCallback')(event, handler);
}

/**
 * Base callback that checks for a phone number before calling your handler.
 *
 * @param event The event name.
 * @param callback The callback to invoke with phone number.
 * @param defaultReturn The value to return if no phone is found.
 */
export function BaseCallback<T extends any[] = any[], R = void>(
  event: string,
  callback: (source: number, phoneNumber: string, ...args: T) => R,
  defaultReturn: R,
): void {
  resourceExport('lb-phone', 'BaseCallback')(event, callback, defaultReturn);
}
