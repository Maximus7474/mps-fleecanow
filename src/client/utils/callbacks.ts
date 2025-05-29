import { resourceExport } from "./export";

type CallbackResponse<T = any> = (...args: any[]) => void;

export function triggerCallback<T = any>(event: string, cb: CallbackResponse<T>, ...args: any[]): void {
  resourceExport("lb-phone", 'TriggerCallback')(event, cb, ...args);
}

export async function awaitCallback<T = any>(event: string, ...args: any[]): Promise<T> {
  const result = await resourceExport("lb-phone", 'AwaitCallback')(event, ...args);
  return result as T;
}
