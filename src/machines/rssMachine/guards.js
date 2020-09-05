import _ from 'lodash';
import validator from 'validator';

const guards = {
  isRssEmpty: (ctx) => _.isEmpty(ctx.form.rss),
  isNotUrl: (ctx) => !validator.isURL(ctx.form.rss),
  isExists: (ctx) => _.has(ctx.feeds.byId, ctx.form.rss),
};

export default guards;
