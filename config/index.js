exports.RepoPath = "github:Jazenx/personalCli";

exports.InquirerConfig = {
  folderExist: [
    {
      type: "list",
      name: "recover",
      message: "当前文件夹已存在，请选择操作：",
      choices: [
        { name: "创建一个新的文件夹", value: "newFolder" },
        { name: "覆盖", value: "cover" },
        { name: "退出", value: "exit" },
      ],
    },
  ],
  rename: [
    {
      name: "inputNewName",
      type: "input",
      message: "请输入新的项目名称: ",
    },
  ],
  projectChoice: [
    {
      type: "list",
      name: 'project',
      message: "请选择需要初始化的项目",
      choices: [
        { name: "React H5", value: "REACTH5" },
        { name: "Vue H5", value: "VUEH5" },
        { name: "Weex", value: "WEEX" },
        { name: "Template", value: "TEMPLATE" },
      ]
    }
  ],
  basicChoice: [
    {
      type: "checkbox",
      name: "basic",
      message: "请选择需要安装的内容：",
      choices: [
        { name: "TypeScript", value: "TYPESCRIPT" },
        { name: "Rem 适配", value: "REM" },
        { name: "微信环境", value: "WX" },
        { name: "支付宝环境", value: "ALI" },
        { name: "埋点 SDK", value: "SDK" },
      ],
    }
  ],
  initChoice: [
    {
      type: "list",
      name: "type",
      message: "请选择项目的包管理工具",
      choices: [
        { name: "npm", value: "NPM" },
        { name: "yarn", value: "YARM" },
      ],
    },
  ],
};
