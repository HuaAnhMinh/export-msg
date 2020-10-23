const fs = require('fs');
const path = require('path');

const writeLogsToFile = (fileName='logs.txt') => {
  fs.writeFileSync(path.join(fullExportPath, fileName), logs);
};

module.exports = {
  writeLogsToFile,
};