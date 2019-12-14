import isURL from 'validator/lib/isURL';

const rules = [
  {
    check: (rss) => rss === '',
    getMessage: () => '',
    status: 'empty',
  },
  {
    check: (rss) => !isURL(rss),
    getMessage: () => 'Address is not valid',
    status: 'invalid',
  },
  {
    check: (rss, state) => !!state.feeds[rss],
    getMessage: (rss) => `${rss} already exists`,
    status: 'invalid',
  },
  {
    check: () => true,
    getMessage: () => '',
    status: 'valid',
  },
];

const validateRss = (rss, state) => {
  const { getMessage, status } = rules.find(({ check }) => check(rss, state));
  return { message: getMessage(rss), status };
};

export default validateRss;
