import { waitForResourceStarted } from '@common/utils';
import { appConfig } from './data';

const lbPhone = 'lb-phone';

const loadApplication = () => {
  const [added, errorMessage] = exports[lbPhone].AddCustomApp(appConfig) as [boolean, string?];

  if (!added) {
    console.log(`[^1ERROR^7] Unable to add "^5${appConfig.name}^7" to lb-phone: ${errorMessage}`);
  }
};

waitForResourceStarted(lbPhone).then(loadApplication);

on('onResourceStart', (resource: string) => {
  if (resource !== lbPhone) return;

  loadApplication();
});
