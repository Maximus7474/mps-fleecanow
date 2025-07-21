export const devMode = !window?.['invokeNative'];

export const formatBalanceValue = (value: number) => {
  if (value > 1_000_000_000) {
    return `${parseFloat((value / 1_000_000_000).toFixed(1))}B `;
  } else if (value > 1_000_000) {
    return `${parseFloat((value / 1_000_000).toFixed(1))}M `;
  } else if (value > 1_000) {
    return `${parseFloat((value / 1_000).toFixed(1))}k `;
  }
  return `${value} `;
};
