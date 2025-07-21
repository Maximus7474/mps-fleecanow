export const devMode = !window?.['invokeNative'];

export const formatBalanceValue = (value: number) => {
  if (value > 1000000) {
    return `${parseFloat((value / 1000000).toFixed(1))}M `;
  } else if (value > 1000) {
    return `${parseFloat((value / 1000).toFixed(1))}k `;
  }
  return `${value} `;
};
