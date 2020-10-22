const { Transform } = require('stream');
const sem = require('semaphore')(1);

const downloadResource = (url='') => {
  return new Promise((resolve, reject) => {
    download(url, resolve, reject);
  });
};

const download = (url, resolve, reject) => {
  const protocol = url.includes('https') ? require('https') : require('http');

  protocol.request(url, (response) => {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      const data = new Transform();

      response.on('data', (chunk) => {
        data.push(chunk);

        if (resourcesInfo[url].hasOwnProperty('size')) {
          sem.take(() => {
            const innerPercentage = (chunk.length / resourcesInfo[url].size) * 100;
            const totalPercentage = (1 / Array.from(Object.keys(resourcesInfo)).length) * 100;
  
            downloadProgress.percentage += (innerPercentage * totalPercentage) / 100;
            sem.leave();
          });
        }
      });

      response.on('end', () => {
        sem.take(() => {
          if (!resourcesInfo[url].hasOwnProperty('size')) {
            downloadProgress.percentage += (1 / Array.from(Object.keys(resourcesInfo)).length) * 100;
          }
          downloadProgress.downloadedItems.push(url);
          sem.leave();
        });

        resolve({ url, data });
      });

      response.on('error', (error) => handleErrorWhileDownloading(reject, url, error));
    }
    else if (response.statusCode === 404) {
      handleErrorWhileDownloading(reject, url, { message: '404 Not Found' });
    }
    else if (response.headers.location) {
      resourcesInfo[response.headers.location] = { ...resourcesInfo[url] };
      delete resourcesInfo[url];
      download(response.headers.location, resolve, reject);
    }
    else {
      handleErrorWhileDownloading(reject, url, { message: 'Unexpected Error' });
    }
  })
  .on('error', (error) => handleErrorWhileDownloading(reject, url, error))
  .end();
};

const handleErrorWhileDownloading = (reject, url, error) => {
  sem.take(() => {
    downloadProgress.percentage += (1 / Array.from(Object.keys(resourcesInfo)).length) * 100;
    downloadProgress.downloadedItems.push(url);
    sem.leave();
  });

  reject({ url, error });
};

module.exports = {
  downloadResource,
};