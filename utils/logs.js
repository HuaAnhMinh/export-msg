const fs = require('fs');
const path = require('path');

function _logProgressToScreen() {
  console.clear();
  console.log(`Downloaded items: ${downloadProgress.downloadedItems.length}/${Array.from(Object.keys(resourcesInfo)).length}`);
  console.log(`Percentage: ${downloadProgress.percentage.toFixed(2)}%`);
}

let progressInterval; 

const showProgress = () => {
  _logProgressToScreen();

  progressInterval = setInterval(() => {
    _logProgressToScreen();

    if (downloadProgress.downloadedItems.length >= Array.from(Object.keys(resourcesInfo)).length) {
      _logProgressToScreen();
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }, 1000);
};

const writeLogsToFile = (fileName='logs.txt') => {
  fs.writeFileSync(path.join(fullExportPath, fileName), logs);
};

// process.on('exit', () => {
//   writeLogsToFile();
// });

module.exports = {
  showProgress,
  writeLogsToFile,
};