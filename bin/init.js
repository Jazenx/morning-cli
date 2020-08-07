#!/usr/bin/env node
const package = require("../package");
const { Command } = require("commander");
const program = new Command();
const CreateCommand = require("../command/CreateCommand");

program
  .version(package.version, "-v, --version", "display version for morning-cli")
  .usage("<command> [options]");

program
  .command("create <name>")
  .description("create a morning template project")
  .option("-f, --force", "忽略文件夹检查，如果已存在则直接覆盖")
  .action((source, destination) => {
    new CreateCommand(source, destination);
  });

program
  .command("make page <name>")
  .description("init a page")
  .option("-f, --force", "忽略文件夹检查，如果已存在则直接覆盖")
  .action((source, destination) => {
    console.log("敬请期待");
  });

program
  .command("make component <name>")
  .description("init a component")
  .option("-f, --force", "忽略文件夹检查，如果已存在则直接覆盖")
  .action((source, destination) => {
    console.log("敬请期待");
  });

try {
  program.parse(process.argv);
} catch (error) {
  console.log("err: ", error);
}
