const path = require("path");
const fs = require("fs");
const { Transform } = require("stream");
const crypto = require("crypto");
const sem = require('semaphore')(1);
const { v4: uuidv4 } = require('uuid');

const {
  ROOT_FOLDER_NAME,
  SIZE_UNIT_LIST,
  SIZE_UNIT_CONVERT,
  ICON_DOWNLOAD,
  EXTENSION_POPULAR,
  DEFAULT_NAME,
  SHORTEN_NAME,
  MAX_TEXT_LENGTH,
  PHOTO_DIR,
  IMAGE_DIR,
  MP3_DIR,
  STICKER_DIR,
  GIF_DIR,
  MP4_DIR,
  FILE_DIR,
  CSS_DIR,
  JS_DIR,
  RESOURCES,
  STICKER_DOWNLOAD_URL,
  LOCATION_ICON
} = require("./constants");


createRootExportPath = (path) => {
  rootExportPath = path;
  return fs.mkdirSync(path, { recursive: true });
};
exports.createRootExportPath = createRootExportPath;

exports.createExportDataDir = () => {
  const currentTime = new Date();
  const day = currentTime.getDate();
  const month = currentTime.getMonth() + 1;
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const second = currentTime.getSeconds();
  const timeDir = "_" + month + "_" + day + "_" + hour + "_" + minute + "_" + second;
  fullExportPath = path.join(rootExportPath, ROOT_FOLDER_NAME + timeDir);

  fs.mkdirSync(fullExportPath);
  fs.mkdirSync(path.join(fullExportPath, JS_DIR));
  fs.mkdirSync(path.join(fullExportPath, IMAGE_DIR));
  fs.mkdirSync(path.join(fullExportPath, CSS_DIR));
  fs.mkdirSync(path.join(fullExportPath, PHOTO_DIR));
  fs.mkdirSync(path.join(fullExportPath, MP3_DIR));
  fs.mkdirSync(path.join(fullExportPath, STICKER_DIR));
  fs.mkdirSync(path.join(fullExportPath, GIF_DIR));
  fs.mkdirSync(path.join(fullExportPath, MP4_DIR));
  fs.mkdirSync(path.join(fullExportPath, FILE_DIR));
  fs.mkdirSync(path.join(fullExportPath, RESOURCES));
};

exports.writeToFile = (content, subDir, file) => {
  const url = subDir ? path.join(fullExportPath, subDir, file) : path.join(fullExportPath, file)
  let writeStream = fs.createWriteStream(url, {
    flags: "a",
  });

  writeStream.write(content);
  writeStream.end();
}

exports.detectFileName = (url) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1).toLowerCase();
  const hasExtension = fileName.includes(".");

  if (hasExtension) {
    return fileName;
  }
  return `${fileName}.png`;
};

const convertSizeOfFile = (size, i) => {
  const devidedResult = size / SIZE_UNIT_CONVERT;

  if (devidedResult < 1) {
    const roundedSize = Math.round(size * 100) / 100;
    return `${roundedSize} ${SIZE_UNIT_LIST[i]}`;
  }
  return convertSizeOfFile(devidedResult, i + 1);
};

exports.isJoinedUserBefore = (peviousObj, currentObj) => {
  if (peviousObj && currentObj.fromUid === peviousObj.fromUid) {
    return true;
  }
  return false;
};

exports.convertTimeFormat = (timeNumber) => {
  return new Date(timeNumber).toLocaleTimeString();
};

exports.determinateThumb = (fileName) => {
  let extension = fileName
    .substring(fileName.lastIndexOf(".") + 1)
    .toLowerCase();
  const isPopularExtension = EXTENSION_POPULAR.includes(extension);
  let url = "";

  if (isPopularExtension) {
    extension = (extension === "mp3" && "music") || extension;
    extension = (extension === "mp4" && "video") || extension;
    url = ICON_DOWNLOAD.replace("typeValue", extension);
  } else {
    url = ICON_DOWNLOAD.replace("typeValue", "default");
  }

  return { extension, url };
};

exports.determinateAvatar = (fromUid, name) => {
  const color =
    "#" + crypto.createHash("md5").update(fromUid).digest("hex").substr(0, 6);
  const lastSpaceIndex = name.lastIndexOf(" ");
  let shortenName = "";

  if (fromUid === "0") {
    return { shortenName: SHORTEN_NAME, name: DEFAULT_NAME, color };
  }

  if (lastSpaceIndex === -1) {
    shortenName = name.charAt(0);
  } else {
    const lastName = name.substring(name.lastIndexOf(" ") + 1);
    shortenName = name.charAt(0) + lastName.charAt(0);
  }
  return { shortenName, name, color };
};

const limitText = (text) => {
  const lastSpaceIndex = text.lastIndexOf(" ");

  if (text.length < MAX_TEXT_LENGTH || lastSpaceIndex === -1) {
    return text;
  }
  return limitText(`${text.substring(0, lastSpaceIndex)}...`);
};
exports.limitText = limitText;

const genUniqueKey = (url, path) => {
  const index = crypto.createHash("md5").update(url + path).digest("hex");
  return index;
}
exports.genUniqueKey = genUniqueKey;

exports.collectRawResourcesInfo = (messages=[]) => {
  for (let i = 0; i < messages.length; ++i) {
    const message = messages[i];
    switch (message.msgType) {
      case 2:
        if (!resourcesInfo.hasOwnProperty(message.message.normalUrl)) {
          resourcesInfo[message.message.normalUrl] = {
            hasDownloaded: false,
            fileName: this.detectFileName(message.message.normalUrl),
          };
        }
        break;
      case 3:
        if (!resourcesInfo.hasOwnProperty(message.message.href)) {
          resourcesInfo[message.message.href] = {
            hasDownloaded: false,
            fileName: `${uuidv4()}.amr`,
          };
        }
      case 4:
        const stickerUrl = STICKER_DOWNLOAD_URL.replace("IdValue", message.message.id);
        if (!resourcesInfo.hasOwnProperty(stickerUrl)) {
          resourcesInfo[stickerUrl] = {
            hasDownloaded: false,
            fileName: `${uuidv4()}.png`,
          };
        }
        break;
      case 6:
        if (!resourcesInfo.hasOwnProperty(message.message.thumb)) {
          resourcesInfo[message.message.thumb] = {
            hasDownloaded: false,
            fileName: `${uuidv4()}.jpg`,
          };
        }
        break;
      case 7:
        if (!resourcesInfo.hasOwnProperty(message.message.normalUrl)) {
          resourcesInfo[message.message.normalUrl] = {
            hasDownloaded: false,
            fileName: `${uuidv4()}.gif`,
          };
        }
        break;
      case 17:
        if (!resourcesInfo.hasOwnProperty(LOCATION_ICON)) {
          resourcesInfo[LOCATION_ICON] = {
            hasDownloaded: false,
            fileName: 'location.png',
          };
        }
        break;
      case 19:
        const params = JSON.parse(message.message.params);
        if (!resourcesInfo.hasOwnProperty(message.message.href)) {
          const size = parseInt(params.fileSize);
          resourcesInfo[message.message.href] = {
            hasDownloaded: false,
            size,
            fileName: message.message.title,
          };

          if (message.message.thumb) {
            if (!resourcesInfo.hasOwnProperty(message.message.thumb)) {
              resourcesInfo[message.message.thumb] = {
                hasDownloaded: false,
                fileName: this.detectFileName(message.message.thumb),
              };
            }
          }
          else {
            const { extension, url } = this.determinateThumb(message.message.title);
            if (!resourcesInfo.hasOwnProperty(url)) {
              resourcesInfo[url] = {
                hasDownloaded: false,
                fileName: `${extension}.svg`,
              };
            }
          }
        }
        break;
      default:
        break;
    }
  }

  logs = logs.concat(Array.from(Object.keys(resourcesInfo)).join('\n'));
  logs = logs.concat(`\nTotal resources items: ${Array.from(Object.keys(resourcesInfo)).length}\n`);
  logs = logs.concat('\n');
};

exports.downloadExternalResource = async ({ msgType, url, fileName }) => {
  let subDir = "";

  switch (msgType) {
    case 2:
      subDir += PHOTO_DIR;
      break;
    case 3:
      subDir += MP3_DIR;
      break;
    case 4:
      subDir += STICKER_DIR;
      break;
    case 6:
      subDir += IMAGE_DIR;
      break;
    case 7:
      subDir += GIF_DIR;
      break;
    case 18:
      subDir += MP4_DIR;
      break;
    case 19:
      subDir += FILE_DIR;
      break;

    default:
  }

  return new Promise((_resolve, _reject) => {
    if (resourcesInfo.hasOwnProperty(url) && resourcesInfo[url].hasDownloaded) {
      return _resolve({
        updatedFileName: resourcesInfo[url].fileName,
        size: convertSizeOfFile(resourcesInfo[url].size),
      });
    }

    function resolve(data, size) {
      fs.writeFileSync(
        path.join(fullExportPath, subDir, fileName),
        data.read()
      );

      _resolve({
        updatedFileName: fileName,
        size: convertSizeOfFile(size, 0)
      });
    }

    function reject() {
      _reject();
    }

    const status = _download(url, resolve, reject);
    if (status === 1) {
      reject();
    }
  });
};

function _download(
  url,
  resolve,
  reject,
  cb=(totalItems, totalDownloadedItems, percentage) => {
    logs = logs.concat('Total items: ' + totalItems);
    logs = logs.concat('\nTotal downloaded items: ' + totalDownloadedItems);
    logs = logs.concat('\nPercentage: ' + percentage);
    logs = logs.concat('\n\n==================================================\n\n');
  }
) {
  const protocol = url.includes("http") && !url.includes("https")
    ? require("http")
    : require("https");

  let size = 0;

  protocol.request(url, function(response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      let data = new Transform();

      response.on('data', function(chunk) {
        data.push(chunk);
        size += chunk.length;

        if (resourcesInfo.hasOwnProperty(url) && resourcesInfo[url].hasOwnProperty('size')) {
          const innerPercentage = (chunk.length / resourcesInfo[url].size) * 100;
          const totalPercentage = (1 / Array.from(Object.keys(resourcesInfo)).length) * 100;

          sem.take(() => {
            downloadProgress.percentage += (innerPercentage * totalPercentage) / 100;
            sem.leave();
          });

          cb(
            Array.from(Object.keys(resourcesInfo)).length,
            downloadProgress.downloadedItems.length,
            downloadProgress.percentage
          );
        }
      });
  
      response.on('end', function() {
        resolve(data, size);
        
        if (resourcesInfo.hasOwnProperty(url) && !resourcesInfo[url].hasOwnProperty('size')) {
          sem.take(() => {
            downloadProgress.percentage += (1 / Array.from(Object.keys(resourcesInfo)).length) * 100;
            sem.leave();
          });
        }

        sem.take(() => {
          if (!downloadProgress.downloadedItems.includes(url)) {
            downloadProgress.downloadedItems.push(url);
            console.clear();
            console.log(`Downloaded items: ${downloadProgress.downloadedItems.length}`);
            console.log(`Percentage: ${downloadProgress.percentage.toFixed(1)}%`);
          }
          sem.leave();
        });

        if (!resourcesInfo[url].hasDownloaded) {
          resourcesInfo[url].hasDownloaded = true;
        }

        if (!resourcesInfo[url].hasOwnProperty('size')) {
          resourcesInfo[url].size = size;
        }

        logs = logs.concat(`\n${url}\n`);

        cb(
          Array.from(Object.keys(resourcesInfo)).length,
          downloadProgress.downloadedItems.length,
          downloadProgress.percentage
        );
      });  
    }
    else if (response.statusCode === 404) {
      reject();
    }
    else if (response.headers.location) {
      if (resourcesInfo.hasOwnProperty(url)) {
        resourcesInfo[response.headers.location] = { ...resourcesInfo[url] };
        delete resourcesInfo[url];
      }
      _download(response.headers.location, resolve);
    }
    else {
      reject();
    }
  })
  .end();
}