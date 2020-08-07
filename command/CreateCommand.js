const inquirer = require("inquirer");
const path = require("path");
const ora = require("ora");
const fs = require("fs-extra");
const download = require("download-git-repo");
const { copyFiles, parseCmdParams, getGitUser } = require("../utils/index");
const { log, showLogo } = require("../utils/log");
const { runCmd } = require("../utils/cmd");
const { RepoPath, InquirerConfig } = require("../config/index");

class Creator {
  constructor(source, destination, ops = {}) {
    showLogo()
    this.source = source;
    this.cmdParams = parseCmdParams(destination);
    this.RepoMaps = Object.assign(
      {
        repo: RepoPath,
        temp: path.join(__dirname, "./__temp__"),
        target: this.genTargetPath(this.source),
      },
    );
    this.gitUser = {};
    this.spinner = ora();
    this.init();
  }

  async init() {
    try {
      await this.checkFolderExist();
      await this.chooseProject();
      await this.chooseBasic();
      await this.downloadRepo();
      await this.copyRepoFiles();
      await this.updatePkgFile();
      await this.initGit();
      await this.runApp();
    } catch (error) {
      log.error(error);
      process.exit(1);
    } finally {
      this.spinner.stop();
    }
  }

  genTargetPath(relPath = "vue-ts-template") {
    return path.resolve(process.cwd(), relPath);
  }

  async checkFolderExist() {
    return new Promise(async (resolve, reject) => {
      const { target } = this.RepoMaps;
      if (this.cmdParams.force) {
        await fs.removeSync(target);
        return resolve();
      }
      try {
        const isTarget = await fs.pathExistsSync(target);
        if (!isTarget) return resolve();
        const { recover } = await inquirer.prompt(InquirerConfig.folderExist);
        if (recover === "cover") {
          await fs.removeSync(target);
          return resolve();
        } else if (recover === "newFolder") {
          const { inputNewName } = await inquirer.prompt(InquirerConfig.rename);
          this.source = inputNewName;
          this.RepoMaps.target = this.genTargetPath(`./${inputNewName}`);
          return resolve();
        } else {
          process.exit(1);
        }
      } catch (error) {
        log.error(`[morning]Error:${error}`);
        process.exit(1);
      }
    });
  }

  async chooseProject() {
    try {
      const { project } = await inquirer.prompt(InquirerConfig.projectChoice);
      if (project === 'REACTH5')  {
        log.success("已选择 React 模板")
        // 处理替换 repopath 逻辑
      } else {
        log.warning("当前模板还未更新，敬请期待...")
        process.exit(1);
      }
    } catch (error) {
      log.error(`[morning]Error:${error}`);
      process.exit(1);
    }
  }

  async downloadRepo() {
    this.spinner.start("正在拉取项目模板...");
    const { repo, temp } = this.RepoMaps;
    return new Promise(async (resolve, reject) => {
      await fs.removeSync(temp);
      download(repo, temp, async (err) => {
        if (err) return reject(new Error(err));
        this.spinner.succeed("模版下载成功");
        return resolve();
      });
    }).catch((err) => {
      console.log(err);
    });
  }


  async chooseBasic() {
    try {
      const { basic } = await inquirer.prompt(InquirerConfig.basicChoice);
      // console.log(basic) [ 'TYPESCRIPT', 'REM', 'WX', 'ALI', 'SDK' ]
      //
    } catch (error) {
      log.error(`[morning]Error:${error}`);
      process.exit(1);
    }
  }

  async copyRepoFiles() {
    const { temp, target } = this.RepoMaps;
    try {
      await copyFiles(temp, target, ["./git", "./changelogs"]);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePkgFile() {
    this.spinner.start("正在更新package.json...");
    const pkgPath = path.resolve(this.RepoMaps.target, "package.json");
    const unnecessaryKey = ["keywords", "license", "files"];
    const { name = "", email = "" } = await getGitUser();
    const jsonData = fs.readJsonSync(pkgPath);
    unnecessaryKey.forEach((key) => delete jsonData[key]);
    Object.assign(jsonData, {
      name: this.source,
      author: name && email ? `${name} ${email}` : "",
      provide: true,
      version: "1.0.0",
    });
    await fs.writeJsonSync(pkgPath, jsonData, { spaces: "\t" });
    this.spinner.succeed("package.json更新完成！");
  }

  async initGit() {
    this.spinner.start("正在初始化Git管理项目...");
    await runCmd(`cd ${this.RepoMaps.target}`);
    process.chdir(this.RepoMaps.target);
    await runCmd(`git init`);
    this.spinner.succeed("Git初始化完成！");
  }

  async runApp() {
    const { type } = await inquirer.prompt(InquirerConfig.initChoice);
    console.log(type);
    if (type === "NPM") {
      await this.runAppByNpm();
    } else if (type === "YARM") {
      await this.runAppByYarn()
    }
  }

  async runAppByYarn() {
    try {
      this.spinner.start("正在安装项目依赖文件，请稍后...");
      await runCmd(`yarn`);
      this.spinner.succeed("依赖安装完成！");
      console.log("请运行如下命令启动项目吧：\n");
      log.success(`   cd ${this.source}`);
      log.success(`   yarn serve`);
    } catch (error) {
      console.log("项目安装失败，请运行如下命令手动安装：\n");
      log.success(`   cd ${this.source}`);
      log.success(`   npm run install`);
    }
  }

  async runAppByNpm() {
    try {
      this.spinner.start("正在安装项目依赖文件，请稍后...");
      await runCmd(`npm install`);
      this.spinner.succeed("依赖安装完成！");
      console.log("请运行如下命令启动项目吧：\n");
      log.success(`   cd ${this.source}`);
      log.success(`   npm run serve`);
    } catch (error) {
      console.log("项目安装失败，请运行如下命令手动安装：\n");
      log.success(`   cd ${this.source}`);
      log.success(`   npm run install`);
    }
  }
}

module.exports = Creator;
