export function Log(
  level: 'info' | 'error' | 'success',
  action: 'deposit_funds' | 'withdraw_funds' | 'transfer',
  title: string,
  fields: Record<string, any> | null,
  source: string | null,
  target: string | null,
): void {
  exports['mps-fleecanow'].Log(level, action, title, fields, source, target);
}
