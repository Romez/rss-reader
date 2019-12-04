import { isURL } from 'validator';
import { watch } from 'melanke-watchjs';
import { get } from 'axios';

export const parseRss = (data) => {
  const domparser = new DOMParser();

  const doc = domparser.parseFromString(data, 'text/xml');

  const feedTitleEl = doc.querySelector('title');
  const feedDescriptionEl = doc.querySelector('description');

  return {
    title: feedTitleEl.textContent,
    description: feedDescriptionEl.textContent,
    news: Array.from(doc.querySelectorAll('item')).map((item) => {
      const titleEl = item.querySelector('title');
      const linkEl = item.querySelector('link');

      return { title: titleEl.textContent, link: linkEl.textContent };
    }),
  };
};

const rules = [
  {
    check: (rss) => rss === '',
    getMessage: () => '',
    status: 'empty',
  },
  {
    check: (rss) => !isURL(rss),
    getMessage: () => 'Address in not valid',
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

export const validateRss = (rss, state) => {
  const { getMessage, status } = rules.find(({ check }) => check(rss, state));
  return { message: getMessage(rss), status };
};

export const initialState = {
  validation: {
    status: 'empty',
    message: '',
  },
  loadStatus: 'ready',
  feeds: {},
  news: [],
};

const app = () => {
  const state = { ...initialState };
  const form = document.querySelector('#rss-form');
  const input = document.querySelector('[name=rss]');
  const errorEl = document.querySelector('.rss-error');
  const button = document.querySelector('.rss-submit');
  const feedsEl = document.querySelector('.feeds');
  const newsEl = document.querySelector('.news');

  input.addEventListener('input', ({ target }) => {
    const { value } = target;

    state.validation = validateRss(value, state);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { target } = event;

    if (state.submitStatus !== 'loading') {
      const url = ['https://cors-anywhere.herokuapp.com', target.rss.value].join('/');
      state.loadStatus = 'loading';

      get(url).then(({ data }) => {
        const { title, description, news } = parseRss(data);

        state.feeds = { ...state.feeds, [target.rss.value]: { title, description } };
        state.news = state.news.concat(news);

        state.loadStatus = 'ready';
        state.validation.status = 'empty';
      }).catch(() => {
        state.loadStatus = 'error';
      });
    }
  });

  watch(state, 'validate', () => {
    input.classList = ['form-control', `is-${state.validation.status}`].join(' ');

    errorEl.innerText = state.validation.message;

    button.disabled = state.validation.status !== 'valid';
  });

  watch(state, 'loadStatus', () => {
    if (state.loadStatus === 'ready') {
      button.textContent = 'ADD';
      input.value = '';
    }

    if (state.loadStatus === ' loading') {
      button.textContent = '...loading';
      button.disabled = true;
    }
  });

  watch(state, 'feeds', () => {
    feedsEl.innerHTML = Object.values(state.feeds).map(({ title, description }) => {
      const card = [
        '<div class="card">',
        '<div class="card-body">',
        `<h5 class="card-title">${title}</h5>`,
        `<p class="card-text">${description}</p>`,
        '</div>',
        '</div>',
      ];
      return card.join('');
    });
  });

  watch(state, 'news', () => {
    newsEl.innerHTML = state.news.map(({ title, link }) => `<a href="${link}" class="list-group-item list-group-item-action">${title}</a>`).join('');
  });
};

export default app;
