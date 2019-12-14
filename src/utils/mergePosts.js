import { max } from 'lodash';

const mergePosts = (oldPosts, newPosts) => {
  const postLatestDate = max(oldPosts.map(({ date }) => date));

  const result = newPosts.filter(({ date }) => date > postLatestDate);

  return [...result, ...oldPosts];
};

export default mergePosts;
