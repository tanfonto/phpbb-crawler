const FixedArray = require('./FixedArray'),
  HTMLParser = require('fast-html-parser'),
  iconv = require('iconv-lite'),
  threadUrlPattern = new RegExp(/[,/.]/);

function _getFirstPost(doc) {
  return doc.firstChild.childNodes
    .find(x => x.tagName === 'body')
    .childNodes.find(x => x.tagName === 'table')
    .childNodes.find(x => x.tagName === 'tr')
    .childNodes.find(x => x.tagName === 'td')
    .childNodes.filter(
      x => x.tagName === 'table' && x.classNames.length > 0
    )[0];
}

function _extractUser(el) {
  let i = el.childNodes.findIndex(x => x.tagName === 'script') + 2,
    cells = el.childNodes[i].childNodes.filter(x => x.tagName === 'td');

  if (cells.length === 0) return;

  let userDetails = cells[0].childNodes.find(
      x => x.tagName === 'span' && x.classNames[0] === 'name'
    ),
    user = {
      id: userDetails.childNodes[0].attributes.name,
      name:
        userDetails.childNodes[1].rawText ||
        userDetails.childNodes[1].childNodes[0].rawText
    };

  return user;
}

function _extractContent(el) {
  return el.childNodes
    .filter(x => x.tagName === 'tr' && x.structuredText)
    .reduce(
      (a, b) =>
        `${a.structuredText || a}
             ${b.structuredText || b}`
    );
}

//sorry generators, this is much faster because of fixed array size
function _traverse(el, refOutput) {
  let user = _extractUser(el);
  if (user) {
    refOutput.push({
      user: user,
      content: _extractContent(el)
    });
  }
  if (
    el.lastChild &&
    el.lastChild.attributes &&
    el.lastChild.attributes.class &&
    el.lastChild.attributes.class === el.attributes.class
  ) {
    _traverse(el.lastChild, refOutput);
  }
}

function _parsePages(pages, encoding, cb) {
  for (let page of pages) {
    _parsePage(page, encoding, cb);
  }
}

function _parsePage(page, encoding, callback) {
  if (page.url) {
    let [, category, categoryId, thread, threadIdAndPage] = page.url.split(
        threadUrlPattern
      ),
      meta = {
        category: {
          id: categoryId,
          name: category
        },
        thread: {
          id: threadIdAndPage.split('-')[0],
          name: thread
        }
      },
      html = iconv.decode(Buffer.from(page.buffer), encoding),
      pageDoc = HTMLParser.parse(html),
      refPosts = new FixedArray(25);

    _traverse(_getFirstPost(pageDoc), refPosts);

    let posts = refPosts.getAll().map(x => {
      return {
        meta: meta,
        data: x
      };
    });

    callback(posts);
  }
}

module.exports = {
  parsePage: _parsePage,
  parsePages: _parsePages
};
