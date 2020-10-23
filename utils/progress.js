const sem = require('semaphore')(1);

let _percentage = 0;
let _downloadedItems = [];
let timeLastShowProgress = 0;

const clearProgress = () => {
  sem.take(() => {
    _percentage = 0;
    _downloadedItems = [];
    showProgress();

    sem.leave();
  });
};

const updateProgress = (updatedProgress={ percentage: 0, url: '' }) => {
  sem.take(() => {
    if (typeof updatedProgress.percentage === 'number') {
      _percentage += updatedProgress.percentage;
    }

    if (typeof updatedProgress.url === 'string') {
      _downloadedItems.push(updatedProgress.url);
    }

    const current = (new Date()).valueOf();
    if (current - timeLastShowProgress >= 1000 ||
        _downloadedItems.length === Array.from(Object.keys(resourcesInfo)).length) {
      showProgress();
      timeLastShowProgress = current;
    }
    sem.leave();
  });
};

const showProgress = () => {
  console.clear();
  console.log(`Downloaded items: ${_downloadedItems.length}/${Array.from(Object.keys(resourcesInfo)).length}`);
  console.log(`Percentage: ${_percentage.toFixed(2)}`);
};

module.exports = {
  clearProgress,
  updateProgress,
};