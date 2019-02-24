const pm = require('pm2');

function _lazy(type, send) {
  let pid = null;

  pm.list((error, list) => {
    pid = list
      .filter(x => x.name === type)
      .sort((x, y) => {
        return x.monit.cpu < y.monit.cpu;
      })[0].pm_id;

    send(pid);
  });
}

module.exports = {
  sendDataToTheLeastBusy: (procType, msgType, data, topic) => {
    _lazy(procType, pid => {
      pm.sendDataToProcessId(
        pid,
        {
          type: msgType,
          data: data,
          topic: topic
        },
        err => {
          if (err) {
            console.error(err);
            process.exit(2);
          }
        }
      );
    });
  }
};
