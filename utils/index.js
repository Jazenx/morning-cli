const fs = require("fs-extra");
const { log } = require("./log");
const { runCmd } = require("./cmd");

exports.parseCmdParams = (cmd) => {
  if (!cmd) return {};
  const resOps = {};
  cmd.options.forEach((option) => {
    const key = option.long.replace(/^--/, "");
    if (cmd[key] && !isFunction(cmd[key])) {
      resOps[key] = cmd[key];
    }
  });
  return resOps;
};

exports.copyFiles = async (tempPath, targetPath, excludes = []) => {
  await fs.copySync(tempPath, targetPath);
  if (excludes && excludes.length) {
    await Promise.all(
      excludes.map((file) => async () =>
        await fs.removeSync(path.resolve(targetPath, file))
      )
    );
  }
};

exports.getGitUser = () => {
  return new Promise(async (resolve) => {
    const user = {};
    try {
      const name = await runCmd("git config user.name");
      const email = await runCmd("git config user.email");
      if (name) user.name = name.replace(/\n/g, "");
      if (email) user.email = `<${email || ""}>`.replace(/\n/g, "");
    } catch (error) {
      log.error("获取用户Git信息失败");
      reject(error);
    } finally {
      resolve(user);
    }
  });
};
