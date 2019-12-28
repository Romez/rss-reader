import i18next from 'i18next';

export default () => i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        validationMessage: {
          empty: '',
          valid: '',
          invalid: 'Address is not valid',
          exists: '{{ rss }} already exists',
        },
        submitButton: {
          add: 'ADD',
          loading: '...LOADING',
        },
        submitError: 'Something went wrong, try again later',
        info: 'Info',
      },
    },
  },
});
