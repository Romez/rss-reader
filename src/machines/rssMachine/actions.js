import { assign, spawn, send } from 'xstate';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { parseRss } from '../../utils';
import getPostMachine from '../postMachine';
import getFeedMachine from '../feedMachine';

const makeFeed = (rss, { title, description }) => ({ rss, title, description });

const makePost = (rss, item) => ({
  id: uuidv4(),
  ...item,
  feedId: rss,
});

const changeRss = assign({ form: (ctx, event) => ({ ...ctx.form, rss: event.value }) });
const skipForm = assign({ form: { rss: '', error: '' } });
const setInvalidUrlError = (t) => assign({ form: (ctx) => ({ ...ctx.form, error: t('errors.invalidUrl') }) });
const setExistsUrlError = (t) => assign({
  form: (ctx) => ({
    ...ctx.form,
    error: t('errors.existsUrl', { rss: ctx.form.rss }),
  }),
});
const updateFeed = assign({
  posts: (ctx, { data, feed }) => {
    const { items } = parseRss(data);

    const newItems = _.differenceWith(
      items,
      _.values(ctx.posts.byId),
      (p1, p2) => p1.title === p2.title,
    );

    return newItems.reduce(
      (acc, item) => {
        const post = makePost(feed.rss, item);
        const ref = spawn(getPostMachine().withContext(post));

        return {
          byId: { ...acc.byId, [post.id]: { ...post, ref } },
          allIds: [post.id, ...acc.allIds],
        };
      },
      { byId: ctx.posts.byId, allIds: ctx.posts.allIds },
    );
  },
});
const initContext = assign((ctx) => {
  const posts = JSON.parse(localStorage.getItem('rss-posts-xstate')) || ctx.posts;
  const feeds = JSON.parse(localStorage.getItem('rss-feeds-xstate')) || ctx.feeds;

  return {
    feeds: {
      allIds: feeds.allIds,
      byId: feeds.allIds.reduce((acc, id) => {
        const feed = { ...feeds.byId[id] };
        const ref = spawn(getFeedMachine().withContext(feed));

        return { ...acc, [id]: { ...feed, ref } };
      }, {}),
    },
    posts: {
      allIds: posts.allIds,
      byId: posts.allIds.reduce((acc, id) => {
        const post = posts.byId[id];
        const ref = spawn(getPostMachine().withContext(post));

        return { ...acc, [id]: { ...post, ref } };
      }, {}),
    },
  };
});

const handleFulfilled = assign((ctx, event) => {
  const data = parseRss(_.get(event, 'data.data'));

  const newFeed = makeFeed(ctx.form.rss, data);

  const newPosts = data.items.reduce(
    (acc, item) => {
      const post = makePost(newFeed.rss, { ...item, isVisited: false });
      const ref = spawn(getPostMachine().withContext(post));

      return {
        byId: { ...acc.byId, [post.id]: { ...post, ref } },
        allIds: [...acc.allIds, post.id],
      };
    },
    { byId: {}, allIds: [] },
  );

  return {
    feeds: {
      byId: {
        ...ctx.feeds.byId,
        [newFeed.rss]: {
          ...newFeed,
          ref: spawn(getFeedMachine().withContext(newFeed)),
        },
      },
      allIds: [...ctx.feeds.allIds, newFeed.rss],
    },
    posts: {
      byId: { ...ctx.posts.byId, ...newPosts.byId },
      allIds: [...ctx.posts.allIds, ...newPosts.allIds],
    },
  };
});

const removePost = assign({
  posts: (ctx, { payload }) => {
    const { id } = payload;

    return {
      allIds: ctx.posts.allIds.filter((postId) => postId !== id),
      byId: _.omit(ctx.posts.byId, id),
    };
  },
});

const removeFeed = assign({
  feeds: (ctx, { feed }) => ({
    allIds: ctx.feeds.allIds.filter((rss) => feed.rss !== rss),
    byId: _.omit(ctx.feeds.byId, feed.rss),
  }),
  posts: (ctx, { feed }) => ({
    allIds: ctx.posts.allIds.filter((id) => ctx.posts.byId[id].feedId !== feed.rss),
    byId: _.omitBy(ctx.posts.byId, ({ feedId }) => feedId === feed.rss),
  }),
});

const setPostAsVisited = assign({
  posts: (ctx, { post: { id } }) => {
    const post = ctx.posts.byId[id];

    return {
      allIds: ctx.posts.allIds,
      byId: { ...ctx.posts.byId, [id]: { ...post, isVisited: true } },
    };
  },
});

export default (t) => {
  const actions = {
    changeRss,
    skipForm,
    setInvalidUrlError: setInvalidUrlError(t),
    setExistsUrlError: setExistsUrlError(t),
    updateFeed,
    handleFulfilled,
    persist: (ctx) => {
      localStorage.setItem('rss-feeds-xstate', JSON.stringify(ctx.feeds));
      localStorage.setItem('rss-posts-xstate', JSON.stringify(ctx.posts));
    },
    initContext,
    removeFeed,
    removePost,
    showDescription: send(
      (ctx, { post }) => ({ type: 'SHOW_DESCRIPTION', post }),
      { to: (ctx) => ctx.infoRef },
    ),
    setPostAsVisited,
  };

  return actions;
};
