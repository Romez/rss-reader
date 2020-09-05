const parseRss = (data) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data, 'text/xml');

  const feedTitleEl = doc.querySelector('title');
  const feedDescriptionEl = doc.querySelector('description');

  return {
    title: feedTitleEl.textContent,
    description: feedDescriptionEl.textContent,
    items: Array.from(doc.querySelectorAll('item')).map((item) => {
      const titleEl = item.querySelector('title');
      const linkEl = item.querySelector('link');
      const descriptionEl = item.querySelector('description');
      const dateEl = item.querySelector('pubDate');

      return {
        title: titleEl.textContent,
        link: linkEl.textContent,
        description: descriptionEl.textContent,
        date: dateEl.textContent,
      };
    }),
  };
};

export default parseRss;
