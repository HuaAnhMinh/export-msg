const { createExportDataDir, createRootExportPath, showProgress } = require("./utils/utils");
// const { ROOT_EXPORT_PATH } = require("./utils/constants");
const { MainHandler } = require("./controller");

global.fullExportPath = "";
global.rootExportPath = "";

global.resourcesInfo = {};
global.downloadProgress = {
  downloadedItems: [],
  percentage: 0,
  downloadingItems: [],
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
