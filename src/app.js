import { watch } from 'melanke-watchjs';
import { get } from 'axios';

import parseRss from './parseRss';
import validateRss from './validateRss';

export const initialState = {
  validation: {
    status: 'empty',
    message: '',
  },
  submit: {
    status: 'idle',
    message: '',
  },
  description: '',
  feeds: {},
  posts: [],
};

const app = () => {
  const state = { ...initialState };

  const inputEl = document.querySelector('[name=rss]');
  const errorEl = document.querySelector('.rss-error');
  const submitEl = document.querySelector('.rss-submit');
  const formEl = document.querySelector('.rss-form');
  const feedsEl = document.querySelector('.feeds');
  const postsEl = document.querySelector('.posts');
  const modalEl = document.querySelector('.info-modal');
  const alertsEl = document.querySelector('.alerts');

  inputEl.addEventListener('input', ({ target }) => {
    state.validation = validateRss(target.value, state);
  });

  watch(state, 'validation', () => {
    inputEl.classList = ['form-control', `is-${state.validation.status}`].join(' ');

    errorEl.innerText = state.validation.message;

    submitEl.disabled = state.validation.status !== 'valid';
  });

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = event.target.rss.value;

    state.submit.status = 'loading';

    const target = ['https://cors-anywhere.herokuapp.com', url].join('/');
    get(target).then(({ data }) => {
      state.submit.status = 'success';
      state.validation.status = 'empty';

      const { title, description, posts } = parseRss(data);
      const feed = { title, description };

      state.feeds = { ...state.feeds, [url]: feed };

      state.posts = posts;
    }).catch((err) => {
      state.submit.status = 'failure';
      state.submit.message = err;
    });
  });

  watch(state.submit, 'status', () => {
    switch (state.submit.status) {
      case 'loading': {
        submitEl.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>...Loading';
        inputEl.disabled = true;
        break;
      }
      case 'success': {
        submitEl.innerText = 'ADD';
        inputEl.disabled = false;
        inputEl.value = '';
        inputEl.focus();
        break;
      }
      case 'failure': {
        inputEl.disabled = false;
        submitEl.innerText = 'ADD';
        inputEl.focus();

        const alert = [
          '<div class="alert alert-danger alert-dismissible fade show fixed-top" role="alert">',
          state.submit.message,
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span> </button>',
          '</div>',
        ].join('');

        alertsEl.innerHTML = alert;
        break;
      }
      default:
    }
  });

  watch(state, 'feeds', () => {
    const feeds = Object.values(state.feeds).map(({ title, description }) => {
      const body = `<h6>${title}</h6>${description}`;
      return `<div class='list-group-item'>${body}</div>`;
    });
    feedsEl.innerHTML = feeds.join('');
  });

  watch(state, 'posts', () => {
    const posts = state.posts.map(({ title, link, description }) => {
      const body = `<a href=${link}>${title}</a><button data-toggle="modal" data-target=".info-modal" type="button" class="btn btn-outline-info">Info</button>`;

      const button = document.createElement('div');
      button.classList = ['rss-info', 'list-group-item', 'd-flex justify-content-between'].join(' ');
      button.innerHTML = body;
      button.addEventListener('click', () => {
        state.description = description;
      });

      return button;
    });
    posts.forEach((post) => {
      postsEl.append(post);
    });
  });

  watch(state, 'description', () => {
    modalEl.querySelector('.modal-body').innerText = state.description;
  });
};

export default app;
