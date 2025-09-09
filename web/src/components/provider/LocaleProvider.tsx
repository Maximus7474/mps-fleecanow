import { useState, type ReactNode, useEffect } from 'react';
import { LocaleContext } from '../../hooks/useLocale';
import { fetchNui } from '../../utils/fetchNui';
import type { RawLocales } from '@common/types';

import { UI } from '../../../../locales/en.json';

type UILocale = typeof UI;

type IndexableLocale = {
  [key: string]: string | IndexableLocale;
};

const defaultLocaleData: UILocale = {
  GLOBAL: {
    LOADING: 'Loading...',
    OPTIONAL: 'Optional',
    AMOUNT: 'Amount',
    CURRENCY: '$',
  },
  BALANCE: {
    BALANCE: 'Balance',
    ADD_FUNDS: 'Add funds',
    REMOVE_FUNDS: 'Withdraw funds',

    CONFIRMATION_POPUP: {
      TITLE: {
        ADD: 'Add funds',
        REMOVE: 'Remove funds',
      },

      DESCRIPTION: {
        ADD: 'How much do you want to add to your account ?',
        REMOVE: 'How much do you want to withdraw from your account ?',
      },

      CONFIRM: 'Confirm',
      CANCEL: 'Cancel',
    },
  },

  HISTORY: {
    TITLE: 'Account history',
    DELETED_USER: 'Deleted user',
    ACTIONS: {
      WITHDRAW: 'Withdrawal',
      DEPOSIT: 'Deposit',
      RECEIVED: 'From {user}',
      SENT: 'To {user}',
    },
  },

  HOME: {
    WELCOME_BACK: 'Welcome back, {username}!',
    NOT_CONNECTED: "You aren't currently connected.",
    LOGIN_OR_REGISTER: 'You need an account to use FleecaNow.',
    LOGOUT: 'Logout',
    LOGIN: 'Login',
    REGISTER: 'Register',
    OR: 'OR',

    ABOUT: {
      HEADING: 'About us',
      DESCRIPTION:
        'Welcome to FleecaNow, an App created by Fleeca Banks©. With us, you can now send money to your familly or friends through your phone!',
    },
  },

  LOGIN: {
    USERNAME: {
      LABEL: 'Username:',
      PLACEHOLDER: 'username',
    },
    PASSWORD: {
      LABEL: 'Password:',
      PLACEHOLDER: 'password',
    },
    LOGIN: 'Login',
    NO_ACCOUNT: "Don't have an account ?",
    REGISTER: 'Register',
  },

  REGISTER: {
    USERNAME: {
      LABEL: 'Username:',
      PLACEHOLDER: 'username',
    },
    PASSWORD: {
      LABEL: 'Password:',
      PLACEHOLDER: 'password',
      CONFIRM: 'Confirm Password:',
    },
    ERRORS: {
      USERNAME_TOO_SHORT: 'Username is too short',
      PASSWORD_TOO_SHORT: 'Password is too short',
      PASSWORD_NOT_MATCH: "Password doesn't match",
    },
    REGISTER: 'Register',
    HAVE_AN_ACCOUNT: 'Already have an account ?',
    LOGIN: 'Login',
  },

  PROFILE: {
    TITLE: 'Your profile',

    AVATAR: {
      LABEL: 'Avatar',
      PLACEHOLDER: 'www.imagehost.com/image.png',
      INVALID: 'Avatar image URL is invalid',
    },
    USERNAME: {
      LABEL: 'Username',
      PLACEHOLDER: 'username',
    },
    DISPLAY_NAME: {
      LABEL: 'Display Name',
      PLACEHOLDER: 'display name',
      INVALID: 'Avatar image URL is invalid',
    },
    EMAIL: {
      LABEL: 'Email',
      PLACEHOLDER: 'email (optional)',
      INVALID: 'Email address is invalid',
    },
    PROXIMITY: {
      LABEL: 'Accept proximity transfers',
      ACTIVE: 'Sharing username via proximity',
      INACTIVE: 'Not sharing username via proximity',
    },

    DELETE_POPUP: {
      TITLE: 'Account Deletion',
      DESCRIPTION:
        'This action is irreversible, all information, money and contacts linked to this account will be lost!',
      CANCEL: 'Cancel',
      CONFIRM: 'Confirm',

      FAILED: {
        TITLE: 'Unable to delete account',
        CLOSE: 'Close',
      },
    },

    SAVE: 'Save',
    LOGOUT: 'Log Out',
    EDIT: 'Edit Profile',
    DELETE: 'Delete Profile',
  },

  TRANSFER: {
    TITLE: 'Transfer Money',
    DESCRIPTION: 'How do you want to send money ?',
    BY_USERNAME: 'By username',
    BY_PROXIMITY: 'By proximity',

    PROXIMITY: {
      LOADING: 'Loading users',
      NO_USERS: 'No users found',
      HELP_TEXT: 'Select a user to send money to',
      DISTANCE_UNIT: 'm',
    },

    USERNAME: {
      NOT_FOUND: 'User not found',
      HEADING: 'User Search',
      HELP_TEXT: 'Please enter the username for the user you wish to send money to.',
      USERNAME: 'Username',
      SEARCH: 'Search',
    },

    CONFIRM: {
      NO_USER_FOUND: 'No user found !',
      BACK: 'Back to selection',

      TITLE: 'Sending money to',
      MESSAGE: 'Message',
      SEND: 'Send money',

      POPUP: {
        TITLE: 'Send Money',
        DESCRIPTION: 'Are you sure you want to send {amount}$ to @{user} ?',
        YES: 'Yes',
      },

      NOTIFICATION: {
        TITLE: 'Money Transfer',
        CONTENT: '{amount}$ was sent to @{user}',
      },

      ERROR: {
        TITLE: 'Unable to send',
        FALLBACK: 'We were unable to send the money',
        OK: 'Ok',
      },
    },
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [localeData, setLocaleData] = useState<UILocale>(defaultLocaleData);

  useEffect(() => {
    fetchNui<UILocale>('fleecanow:getlocale', {}, defaultLocaleData).then((locale) => {
      if (!locale) return;

      setLocaleData(locale);
    });
  }, []);

  const T = (key: RawLocales, args?: { [key: string]: ReactNode }): string => {
    const keyParts = key.split('.');
    let currentLocale: IndexableLocale = localeData as IndexableLocale;
    let found = true;

    for (const part of keyParts) {
      if (currentLocale && typeof currentLocale === 'object' && currentLocale.hasOwnProperty(part)) {
        currentLocale = currentLocale[part] as IndexableLocale;
      } else {
        found = false;
        break;
      }
    }

    if (!found || typeof currentLocale !== 'string') {
      return key;
    }

    let localizedString: string = currentLocale;

    for (const argKey in args) {
      if (args.hasOwnProperty(argKey)) {
        const regex = new RegExp(`\\{${argKey}\\}`, 'g');
        localizedString = localizedString.replace(regex, String(args[argKey]));
      }
    }

    return localizedString;
  };

  const UpdateLocale = (locale: string): void => {
    fetchNui<UILocale>('fleecanow:getLocale', { locale })
      .then((locale) => {
        if (!locale) return;
        setLocaleData(locale);
      })
      .catch((err) => console.error(`Unable to fetch new locale (${locale}) data:`, err.message));
  };

  return <LocaleContext.Provider value={{ T, UpdateLocale }}>{children}</LocaleContext.Provider>;
}
