const pm = require('pm2'),
  pmUtil = require('./pm-util'),
  parser = require('./parser');

pm.connect(() => {
  process.on('message', msg => {
    if (msg.type === 'crawler:dump') {
      parser.parsePages(msg.data, 'iso-8859-2', posts => {
        pmUtil.sendDataToTheLeastBusy(
          'persistence',
          'parser:parsed',
          posts,
          'parser'
        );
      });
    }
  });
});
