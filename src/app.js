import { watch } from 'melanke-watchjs';
import { get } from 'axios';
import { find, uniqueId, differenceBy } from 'lodash';
import $ from 'jquery';

import { parseRss, validateRss } from './utils';
import setupLocalization from './setupLocalization';

export const getInitialState = () => ({
  validationStatus: 'empty',
  submitStatus: 'idle',
  feeds: {},
  posts: [],
  submitMessage: '',
  description: '',
});

const app = async () => {
  const state = getInitialState();
  const t = await setupLocalization();

  const checkFeedUpdates = (target) => {
    setTimeout(() => {
      get(target).then(({ data }) => {
        const { posts } = parseRss(data);

        const diffPosts = differenceBy(posts, state.posts, 'date')
          .map((post) => ({ ...post, id: uniqueId() }));

        state.posts = diffPosts.concat(state.posts);
        checkFeedUpdates(target);
      });
    }, 3000);
  };

  const formNode = document.querySelector('.rss-form');
  const inputNode = formNode.rss;
  const submitButtonNode = document.querySelector('.rss-submit');
  const feedbackNode = formNode.querySelector('.feedback');
  const postsNode = document.querySelector('.posts');
  const feedsNode = document.querySelector('.feeds');
  const descriptionNode = document.querySelector('.info-modal');
  const alertsNode = document.querySelector('.alerts');

  inputNode.addEventListener('input', ({ target }) => {
    state.validationStatus = validateRss(target.value, state);
  });

  formNode.addEventListener('submit', (event) => {
    event.preventDefault();
    state.submitStatus = 'loading';

    const url = event.target.rss.value;
    const target = ['https://cors-anywhere.herokuapp.com', url].join('/');

    get(target).then(({ data }) => {
      const { title, description, posts } = parseRss(data);

      state.feeds = { ...state.feeds, [url]: { title, description } };
      state.posts = state.posts.concat(posts.map((post) => ({ ...post, id: uniqueId() })));

      state.submitStatus = 'idle';
      state.validationStatus = 'empty';

      checkFeedUpdates(target);
    }).catch((err) => {
      state.submitStatus = 'failure';
      state.submitMessage = err;
    });
  });

  $('.info-modal').on('show.bs.modal', ({ relatedTarget }) => {
    const { description } = find(state.posts, ['id', relatedTarget.dataset.id]);
    state.description = description;
  });

  watch(state, 'validationStatus', () => {
    switch (state.validationStatus) {
      case 'invalid': {
        inputNode.classList.add('is-invalid');
        feedbackNode.innerText = t(`validationMessage.${state.validationStatus}`);
        submitButtonNode.disabled = true;
        break;
      }
      case 'valid': {
        inputNode.classList.add('is-valid');
        inputNode.classList.remove('is-invalid');
        submitButtonNode.disabled = false;
        break;
      }
      case 'exists': {
        inputNode.classList.add('is-invalid');
        feedbackNode.innerText = t(`validationMessage.${state.validationStatus}`);
        submitButtonNode.disabled = true;
        break;
      }
      default: {
        inputNode.classList.remove('in-valid', 'is-invalid');
        submitButtonNode.disabled = true;
      }
    }
  });

  watch(state, 'submitStatus', () => {
    switch (state.submitStatus) {
      case 'loading': {
        submitButtonNode.disabled = true;
        inputNode.disabled = true;
        submitButtonNode.innerHTML = `<span class="spinner-grow spinner-grow-sm"></span>${t('submitButton.loading')}`;
        break;
      }
      case 'idle': {
        submitButtonNode.disabled = false;
        submitButtonNode.innerText = t('submitButton.add');
        inputNode.disabled = false;
        inputNode.value = '';
        break;
      }
      case 'failure': {
        submitButtonNode.disabled = false;
        submitButtonNode.innerText = t('submitButton.add');
        inputNode.disabled = false;
        inputNode.focus();

        const close = '<button class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span></button>';
        alertsNode.innerHTML = `<div class="alert alert-danger alert-dismissible fixed-top" role="alert">${state.submitMessage}${close}</div>`;
        break;
      }
      default:
    }
  });

  watch(state, 'feeds', () => {
    const elements = Object.values(state.feeds).map(({ title, description }) => {
      const body = `<h6>${title}</h6>${description}`;
      return `<div class='list-group-item'>${body}</div>`;
    });
    feedsNode.innerHTML = elements.join('');
  });

  watch(state, 'posts', () => {
    const elements = state.posts.map(({ title, link, id }) => {
      const titleElement = `<a href=${link}>${title}</a>`;
      const infoElement = `<button data-id=${id} data-toggle="modal" data-target=".info-modal" class="btn btn-info">${t('info')}</button>`;

      return `<div class='rss-info list-group-item d-flex align-items-center justify-content-between'>${titleElement}${infoElement}</div>`;
    });
    postsNode.innerHTML = elements.join('');
  });

  watch(state, 'description', () => {
    descriptionNode.querySelector('.modal-body').innerText = state.description;
  });
};

export default app;
