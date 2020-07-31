const { createExportDataDir, createRootExportPath } = require("./utils/utils");
// const { ROOT_EXPORT_PATH } = require("./utils/constants");
const { MainHandler } = require("./controller");

global.fullExportPath = "";
global.rootExportPath = "";
global.downloadedResource = {};

const outputPath = './output';

const main = () => {
  require('dns').lookup('google.com', function (err) {
    if (err && err.code == "ENOTFOUND") {
      console.log("Không có kết nối mạng");
      return;
    } else {
      createRootExportPath(outputPath);
      createExportDataDir();
      MainHandler();
    }
  })
};

main();
