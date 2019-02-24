const create = require('./dbConnectionFactory'),
  db = create();

process.on('message', msg => {
  if (msg.type === 'parser:parsed') {
    db.bulk({ docs: msg.data }, err => {
      if (err) console.log(err);
    });
  }
});
