const { createExportDataDir, createRootExportPath } = require("./utils/utils");
// const { ROOT_EXPORT_PATH } = require("./utils/constants");
const { MainHandler } = require("./controller");

global.fullExportPath = "";
global.rootExportPath = "";
global.downloadedResource = {};

const outputPath = './output';

const main = () => {
  const start = (new Date()).valueOf();
  console.log(start);
  
  createRootExportPath(outputPath);
  createExportDataDir();
  MainHandler();
};

main();
