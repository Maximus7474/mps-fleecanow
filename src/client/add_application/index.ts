import { waitForResourceStarted } from '@common/utils';
import { appConfig } from './data';

const lbPhone = 'lb-phone';

const loadApplication = () => {

  const lbPhoneExports = global.exports[lbPhone];

  const response = lbPhoneExports.AddCustomApp(appConfig) as [boolean, string?];

  const added = Array.isArray(response) ? response[0] : response;

  if (!added) {
    console.log(`[^1ERROR^7] Unable to add "^5${appConfig.name}^7" to lb-phone: ${response[1]}`);
  }
};

waitForResourceStarted(lbPhone).then(loadApplication);

on('onResourceStart', (resource: string) => {
  if (resource !== lbPhone) return;

  loadApplication();
});
