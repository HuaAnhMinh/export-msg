const { createExportDataDir, createRootExportPath } = require("./utils/utils");
const { MainHandler } = require("./controller");

global.fullExportPath = "";
global.rootExportPath = "";

global.resourcesInfo = {};
global.hasDownloadableContent = false
global.logs = '';

const outputPath = './output';

const main = () => {
  createRootExportPath(outputPath);
  createExportDataDir();

  MainHandler();
};

main();
