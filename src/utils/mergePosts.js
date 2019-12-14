import { maxBy, uniqueId, keyBy } from 'lodash';

const mergePosts = (newPosts, oldPosts) => {
  const latestPost = maxBy(oldPosts, ({ date }) => date);

  const posts = newPosts
    .filter(({ date }) => date > latestPost.date)
    .map((post) => ({ ...post, id: uniqueId() }));
  return { ...oldPosts, ...keyBy(posts, 'id') };
};

export default mergePosts;
