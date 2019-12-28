import isURL from 'validator/lib/isURL';

const rules = [
  {
    check: (rss) => rss === '',
    status: 'empty',
  },
  {
    check: (rss) => !isURL(rss),
    status: 'invalid',
  },
  {
    check: (rss, state) => !!state.feeds[rss],
    status: 'exists',
  },
  {
    check: () => true,
    status: 'valid',
  },
];

const getValidationStatus = (rss, state) => {
  const { status } = rules.find(({ check }) => check(rss, state));
  return status;
};

export default getValidationStatus;
