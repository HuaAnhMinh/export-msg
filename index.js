const { createExportDataDir, createRootExportPath } = require("./utils/utils");
// const { ROOT_EXPORT_PATH } = require("./utils/constants");
const { MainHandler } = require("./controller");

global.fullExportPath = "";
global.rootExportPath = "";
global.downloadedResource = {};

const outputPath = './output';

const main = () => {
  createRootExportPath(outputPath);
  createExportDataDir();
  MainHandler();
};

main();
