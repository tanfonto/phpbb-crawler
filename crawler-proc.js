const create = require('./crawlerFactory'),
  pm = require('pm2'),
  pmUtil = require('./pm-util');

pm.connect(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const crawlerStuff = create(),
    crawler = crawlerStuff.crawler,
    reqBuffer = new Array(crawlerStuff.bufferSize),
    technicalPattern = new RegExp(/\.php$/i),
    pageMapPattern = new RegExp(/\W*(------)\W/);

  crawler.addFetchCondition((queueItem, referrerQueueItem, callback) => {
    let technical = queueItem.uriPath.match(technicalPattern);
    let pageMap = queueItem.uriPath.match(pageMapPattern);
    callback(null, !(technical || pageMap));
  });

  crawler.addFetchCondition((queueItem, referrerQueueItem, callback) => {
    let chunks = queueItem.uriPath.split(',');
    let isThread = chunks.length === 3;
    callback(null, isThread);
  });

  process.on('SIGINT', () => {
    crawler.destroy();
  });

  let fetchCompleteCount = 0;

  crawler.on('fetchcomplete', (item, buffer) => {
    if (item.depth > 1) {
      if (fetchCompleteCount <= crawlerStuff.bufferSize - 1) {
        reqBuffer[fetchCompleteCount++] = {
          url: item.uriPath,
          buffer: buffer
        };
      } else {
        pmUtil.sendDataToTheLeastBusy(
          'parser',
          'crawler:dump',
          reqBuffer,
          'crawler'
        );

        fetchCompleteCount = 0;
      }
    }
  });

  crawler.start();
});
