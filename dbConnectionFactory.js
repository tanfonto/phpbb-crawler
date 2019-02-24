const config = require('config'),
  storeCfg = config.get('Store'),
  proxyCfg = config.get('Proxy'),
  args = { url: storeCfg.url };
if (proxyCfg)
  args.requestDefaults = {
    proxy: `http://${proxyCfg.hostName}:${proxyCfg.port}`
  };
const nano = require('nano')(args);

function _create() {
  let db = nano.use(storeCfg.database);
  return db;
}

module.exports = _create;
