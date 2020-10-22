const { createExportDataDir, createRootExportPath } = require("./utils/utils");
const { MainHandler } = require("./controller");
const { showProgress } = require("./utils/logs");

global.fullExportPath = "";
global.rootExportPath = "";

global.resourcesInfo = {};

global.downloadProgress = {
  downloadedItems: [],
  percentage: 0,
  hasDownloadableContent: false,
};

global.logs = '';

const outputPath = './output';

const main = () => {
  createRootExportPath(outputPath);
  createExportDataDir();

  showProgress();

  MainHandler();
};

main();
