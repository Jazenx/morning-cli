const chalk = require("chalk");
const figlet = require("figlet");

exports.log = {
  warning(msg = "") {
    console.log(chalk.yellow(`${msg}`));
  },
  error(msg = "") {
    console.log(chalk.red(`${msg}`));
  },
  success(msg = "") {
    console.log(chalk.green(`${msg}`));
  },
};

exports.showLogo = () => {
  console.log(
    chalk.cyan.bold(
      figlet.textSync("Morning-Cli", { horiziontalLayout: "full" })
    )
  );
  console.log(chalk.cyan.bold("偷得浮生半日闲，心情半佛半神仙。"));
};
