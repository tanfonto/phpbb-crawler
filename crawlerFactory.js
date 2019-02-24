const Crawler = require('simplecrawler'),
  config = require('config');

function _create() {
  let cfg = config.get('Crawler'),
    proxyCfg = config.get('Proxy'),
    crawler = Crawler(cfg.url);
  crawler.maxConcurrency = cfg.maxConcurrency;
  crawler.maxDepth = cfg.maxDepth;
  crawler.interval = cfg.interval;
  if (proxyCfg) {
    crawler.useProxy = true;
    crawler.proxyHostname = proxyCfg.hostName;
    crawler.proxyPort = proxyCfg.port;
  }

  return {
    crawler: crawler,
    bufferSize: cfg.bufferSize
  };
}

module.exports = _create;
