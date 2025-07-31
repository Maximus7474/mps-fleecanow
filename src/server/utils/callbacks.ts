const registeredCallbacks = new Map<string, (...args: any[]) => Promise<any>>();

export const RegisterServerCallback = <T = any>(name: string, handler: (src: number, data: any) => Promise<T>) => {
  registeredCallbacks.set(name, handler);
};

onNet('fleecanow:server:triggerCallback', async (name: string, requestId: string, data: any) => {
  const src = global.source;
  const callback = registeredCallbacks.get(name);

  if (!callback) {
    emitNet('fleecanow:client:callbackResponse', src, requestId, {
      success: false,
      error: `Callback '${name}' not found.`,
    });
    return;
  }

  try {
    const result = await callback(src, data);
    emitNet('fleecanow:client:callbackResponse', src, requestId, {
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('Error in server callback:', name, data, err);
    emitNet('fleecanow:client:callbackResponse', src, requestId, {
      success: false,
      error: 'An error occured on the server.',
    });
  }
});
