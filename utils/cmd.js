const childProcess = require("child_process");

exports.runCmd = (cmd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (err, ...arg) => {
      if (err) return reject(err);
      return resolve(...arg);
    });
  });
};