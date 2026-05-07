import { LoadJsonFile } from '@common/utils';
import BaseLocaleJson from '../../../locales/en.json';

type LocaleJson = typeof BaseLocaleJson;
type UILocale = typeof BaseLocaleJson.UI;

RegisterNuiCallback('fleecanow:getlocale', (data: { locale?: string }, cb: (data: UILocale) => void) => {
  const defaultPhoneLocale = exports['lb-phone'].GetConfig()?.DefaultLocale as string;

  let localeData;

  try {
    localeData = LoadJsonFile<LocaleJson>(`locales/${data.locale ?? defaultPhoneLocale}.json`);
  } catch (err) {
    console.error(`Requested locale (${data.locale ?? defaultPhoneLocale}) does not exist, falling back to english.`);
    localeData = BaseLocaleJson;
  }

  cb(localeData.UI);
});
