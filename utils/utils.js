const path = require("path");
const fs = require("fs");
const { Transform } = require("stream");
const crypto = require("crypto");
const sem = require('semaphore')(1);
const { v4: uuidv4 } = require('uuid');

const {
  loadResources,
  loadPhotosResource,
  loadFilesResource,
  loadStickersResource,
  loadGifsResource,
  loadLinksResource,
  loadMP3sResource,
} = require("../public/script");

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
  STYLES_DIR,
  JS_DIR,
  RESOURCES,
  STICKER_DOWNLOAD_URL,
  LOCATION_ICON,
  STATUS
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
  fs.mkdirSync(path.join(fullExportPath, STYLES_DIR));
  fs.mkdirSync(path.join(fullExportPath, PHOTO_DIR));
  fs.mkdirSync(path.join(fullExportPath, MP3_DIR));
  fs.mkdirSync(path.join(fullExportPath, STICKER_DIR));
  fs.mkdirSync(path.join(fullExportPath, GIF_DIR));
  fs.mkdirSync(path.join(fullExportPath, MP4_DIR));
  fs.mkdirSync(path.join(fullExportPath, FILE_DIR));
  fs.mkdirSync(path.join(fullExportPath, RESOURCES));
};

exports.writeToFile = (content, subDir, file, isSync=false) => {
  const url = subDir ? path.join(fullExportPath, subDir, file) : path.join(fullExportPath, file);

  if (isSync) {
    fs.appendFileSync(url, content);
  }
  else {
    fs.appendFile(url, content, (err) => {
      if (err) {
        throw err;
      }
    });
  }
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

exports.isJoinedUserBefore = (prevObj, currentObj) => {
  if (prevObj && prevObj.hasOwnProperty('msgType') && prevObj.msgType === 25) {
    return false;
  }
  
  if (prevObj && currentObj.fromUid === prevObj.fromUid) {
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
            msgType: 2,
            hasDownloaded: false,
            fileName: this.detectFileName(message.message.normalUrl),
          };
        }
        break;
      case 3:
        if (!resourcesInfo.hasOwnProperty(message.message.href)) {
          resourcesInfo[message.message.href] = {
            msgType: 3,
            hasDownloaded: false,
            fileName: `${uuidv4()}.amr`,
          };
        }
      case 4:
        const stickerUrl = STICKER_DOWNLOAD_URL.replace("IdValue", message.message.id);
        if (!resourcesInfo.hasOwnProperty(stickerUrl)) {
          resourcesInfo[stickerUrl] = {
            msgType: 4,
            hasDownloaded: false,
            fileName: `${uuidv4()}.png`,
          };
        }
        break;
      case 6:
        if (!resourcesInfo.hasOwnProperty(message.message.thumb)) {
          resourcesInfo[message.message.thumb] = {
            msgType: 6,
            hasDownloaded: false,
            fileName: `${uuidv4()}.jpg`,
            url: message.message.href,
          };
        }
        break;
      case 7:
        if (!resourcesInfo.hasOwnProperty(message.message.normalUrl)) {
          resourcesInfo[message.message.normalUrl] = {
            msgType: 7,
            hasDownloaded: false,
            fileName: `${uuidv4()}.gif`,
          };
        }
        break;
      case 17:
        if (!resourcesInfo.hasOwnProperty(LOCATION_ICON)) {
          resourcesInfo[LOCATION_ICON] = {
            msgType: 6,
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
            msgType: 19,
            hasDownloaded: false,
            size,
            fileName: message.message.title,
          };

          if (message.message.thumb) {
            if (!resourcesInfo.hasOwnProperty(message.message.thumb)) {
              resourcesInfo[message.message.thumb] = {
                msgType: 6,
                hasDownloaded: false,
                fileName: this.detectFileName(message.message.thumb),
              };
            }
            resourcesInfo[message.message.href].thumb = message.message.thumb;
          }
          else {
            const { extension, url } = this.determinateThumb(message.message.title);
            if (!resourcesInfo.hasOwnProperty(url)) {
              resourcesInfo[url] = {
                msgType: 6,
                hasDownloaded: false,
                fileName: `${extension}.svg`,
              };
            }
            resourcesInfo[message.message.href].thumb = url;
          }
        }
        break;
      default:
        break;
    }
  }
};

// msgType === 2
const photos = {};
const savePhoto = async (msgType, url, fileName) => {
  if (photos.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName, size } = await this.downloadExternalResource({ msgType, url, fileName });

    const urlLocal = path.join(PHOTO_DIR, updatedFileName);

    photos[url] = {
      status: STATUS.succeed,
      urlLocal,
      fileName: updatedFileName,
      size,
    };
  }
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`MsgType: ${msgType}`);
    console.log(`Error: ${url}`);
  }
};

const mp3s = {};
const saveMP3 = async (msgType, url, fileName) => {
  if (mp3s.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName } = await this.downloadExternalResource({ msgType, url, fileName });

    mp3s[url] = {
      status: STATUS.succeed,
      fileName: updatedFileName,
      dir: MP3_DIR,
      urlLocal: path.join(MP3_DIR, updatedFileName),
    };
  }
  catch (error) {}
};

const stickers = {};
const saveSticker = async (msgType, url, fileName) => {
  if (stickers.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName } = await this.downloadExternalResource({ msgType, url, fileName });
    const sizeOf = require('image-size');
    const dimensions = sizeOf(path.join(fullExportPath, STICKER_DIR, updatedFileName));

    stickers[url] = {
      status: STATUS.succeed,
      urlLocal: path.join(STICKER_DIR, updatedFileName),
      width: dimensions.width,
      height: dimensions.height,
      dirValue: STICKER_DIR,
      fileName: updatedFileName,
    };
  }
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`MsgType: ${msgType}`);
    console.log(`Error: ${url}`);
  }
};

const links = {};
const saveLink = async (msgType, url, thumb, fileName) => {
  if (links.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName } = await this.downloadExternalResource({ msgType, url: thumb, fileName });

    links[url] = {
      status: STATUS.succeed,
      dir: IMAGE_DIR,
      fileName: updatedFileName,
    };
  }
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`MsgType: ${msgType}`);
    console.log(`Error: ${url}`);
  }
};

const gifs = {};
const saveGif = async (msgType, url, fileName) => {
  if (gifs.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName } = await this.downloadExternalResource({ msgType, url, fileName });

    gifs[url] = {
      status: STATUS.succeed,
      urlLocal: path.join(GIF_DIR, updatedFileName),
      dir: GIF_DIR,
      fileName: updatedFileName,
    };
  }
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`MsgType: ${msgType}`);
    console.log(`Error: ${url}`);
  }
};

const files = {};
const saveFile = async (msgType, url, fileName, thumb, fileNameThumb) => {
  if (files.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName, size } = await this.downloadExternalResource({
      msgType,
      url,
      fileName,
    });

    files[url] = {
      status: STATUS.succeed,
      fileNameFile: updatedFileName,
      size,
      urlLocal: path.join(FILE_DIR, updatedFileName),
      dir: IMAGE_DIR,
    };

    if (!links.hasOwnProperty(thumb)) {
      const { updatedFileName } = await this.downloadExternalResource({
        msgType: 6,
        url: thumb,
        fileName: fileNameThumb,
      });

      links[thumb] = {
        status: STATUS.succeed,
        dir: IMAGE_DIR,
        fileName: updatedFileName,
      };
    }

    files[url].fileNameImg = links[thumb].fileName;
  }
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`MsgType: ${msgType}`);
    console.log(`Error: ${url}`);
  }
};

exports.downloadAllResources = () => {
  for (let prop in resourcesInfo) {
    const resource = resourcesInfo[prop];

    switch (resource.msgType) {
      case 2:
        savePhoto(resource.msgType, prop, resource.fileName);
        break;
      case 3:
        saveMP3(resource.msgType, prop, resource.fileName);
        break;
      case 4:
        saveSticker(resource.msgType, prop, resource.fileName);
        break;
      case 6:
        saveLink(resource.msgType, resource.url, prop, resource.fileName);
        break;
      case 7:
        saveGif(resource.msgType, prop, resource.fileName);
        break;
      case 17:
        this.downloadExternalResource({
          msgType: 6,
          url: prop,
          fileName: resource.fileName
        });
        break;
      case 19:
        saveFile(resource.msgType, prop, resource.fileName, resource.thumb, resourcesInfo[resource.thumb].fileName);
        break;
      default:
        throw new Error('Invalid message type for resource');
    }
  }
};

const exportResourcesToFile = () => {
  console.log('Writing resources info to files...');

  fs.writeFileSync(path.join(fullExportPath, '/resources/photos.js'), 'const photosResource = ' + JSON.stringify(photos));
  fs.writeFileSync(path.join(fullExportPath, '/resources/files.js'), 'const filesResource = ' + JSON.stringify(files));
  fs.writeFileSync(path.join(fullExportPath, '/resources/stickers.js'), 'const stickersResource = ' + JSON.stringify(stickers));
  fs.writeFileSync(path.join(fullExportPath, '/resources/gifs.js'), 'const gifsResource = ' + JSON.stringify(gifs));
  fs.writeFileSync(path.join(fullExportPath, '/resources/links.js'), 'const linksResource = ' + JSON.stringify(links));
  fs.writeFileSync(path.join(fullExportPath, '/resources/mp3s.js'), 'const mp3sResource = ' + JSON.stringify(mp3s));
  
  //fs.writeFileSync(path.join(fullExportPath, '/resources/logs.txt'), logs);
};

process.on('exit', exportResourcesToFile);

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

    _download(url, resolve, reject);
  });
};

function _download(url, resolve, reject) {
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
            if (downloadProgress.percentage > 100) {
              downloadProgress.percentage = 100;
            }
            sem.leave();
          });
        }
      });
  
      response.on('end', function() {
        resolve(data, size);
        
        if (resourcesInfo.hasOwnProperty(url) && !resourcesInfo[url].hasOwnProperty('size')) {
          sem.take(() => {
            downloadProgress.percentage += (1 / Array.from(Object.keys(resourcesInfo)).length) * 100;
            if (downloadProgress.percentage > 100) {
              downloadProgress.percentage = 100;
            }
            sem.leave();
          });
        }

        sem.take(() => {
          if (!downloadProgress.downloadedItems.includes(url)) {
            downloadProgress.downloadedItems.push(url);
          }
          sem.leave();
        });

        if (!resourcesInfo[url].hasDownloaded) {
          resourcesInfo[url].hasDownloaded = true;
        }

        if (!resourcesInfo[url].hasOwnProperty('size')) {
          resourcesInfo[url].size = size;
        }
      });  
    }
    else if (response.statusCode === 404) {
      setupForFailedDownloadResource(url);
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
      setupForFailedDownloadResource(url);
      reject();
    }
  })
  .end();
}

function setupForFailedDownloadResource(url) {
  sem.take(() => {
    downloadProgress.percentage += (1 / Array.from(Object.keys(resourcesInfo)).length) * 100;
    if (!resourcesInfo[url].hasDownloaded) {
      resourcesInfo[url].hasDownloaded = true;
    }
    if (!downloadProgress.downloadedItems.includes(url)) {
      downloadProgress.downloadedItems.push(url);
    }
    sem.leave();
  });
};

function _logProgressToScreen() {
  console.clear();
  console.log(`Downloaded items: ${downloadProgress.downloadedItems.length}/${Array.from(Object.keys(resourcesInfo)).length}`);
  console.log(`Percentage: ${downloadProgress.percentage.toFixed(2)}%`);
}

exports.showProgress = () => {
  _logProgressToScreen();

  let progressInterval = setInterval(() => {
    _logProgressToScreen();

    if (downloadProgress.downloadedItems.length >= Array.from(Object.keys(resourcesInfo)).length) {
      _logProgressToScreen();
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }, 1000);
};

exports.copyRequiredResourceToDest = () => {
  fs.createReadStream('./templates/common/error-placeholder.png')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'resources/error-placeholder.png')));

  fs.createReadStream('./templates/styles/message.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message.css')));

  fs.createReadStream('./templates/styles/message-1.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message-1.css')));

  fs.createReadStream('./templates/styles/message-2.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message-2.css')));

  fs.createReadStream('./templates/styles/message-4.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message-4.css')));

  fs.createReadStream('./templates/styles/message-6.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message-6.css')));

  fs.createReadStream('./templates/styles/message-7.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message-7.css')));

  fs.createReadStream('./templates/styles/message-17.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message-17.css')));

  fs.createReadStream('./templates/styles/message-19.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message-19.css')));

  fs.createReadStream('./templates/styles/message--4.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message--4.css')));

  const loadResourcesTemplateStr = 'const downloadedStatus = { succeed: 0, failed: 1, };' + '\n' +
    loadPhotosResource.toString() + '\n' +
    loadFilesResource.toString() + '\n' +
    loadStickersResource.toString() + '\n' +
    loadGifsResource.toString() + '\n' +
    loadLinksResource.toString() + '\n' +
    loadMP3sResource.toString() + '\n' +
    '(' + loadResources.toString() + ')();';

  this.writeToFile(loadResourcesTemplateStr, JS_DIR, "script.js");
};

exports.checkDownloadableContentExisted = (messages=[]) => {
  for (let i = 0; i < messages.length; ++i) {
    const msgType = messages[i].msgType;

    if (msgType === 2 || msgType === 4 || msgType === 6 ||
        msgType === 7 || msgType === 17 || msgType === 19) {
      downloadProgress.hasDownloadableContent = true;
      break;
    }
  }
};