const config = require('config'),
  storeCfg = config.get('Store'),
  args = { url: storeCfg.url };
const nano = require('nano')(args);

let errorHandler = (err, b) => {
  if (err) console.log(err);
  else console.log(b);
};
let createDb = () =>
  nano.db.create(storeCfg.database, (err, body) => {
    errorHandler(err, body);
    process.exit();
  });

nano.db.get(storeCfg.database, (err, body) => {
  if (!err) {
    nano.db.destroy(storeCfg.database, (err, body) => {
      errorHandler(err, body);
      createDb();
    });
  } else {
    errorHandler(err, body);
    createDb();
  }
});
