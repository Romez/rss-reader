import { get } from 'axios';

const services = {
  getFeed: (ctx) => {
    const proxy = 'https://cors-anywhere.herokuapp.com';
    const target = [proxy, ctx.form.rss].join('/');

    return get(target);
  },
};

export default services;
