const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const { downloadResource } = require('./download');
const { determinateThumb, detectFileName } = require('./utils');

const { STICKER_DOWNLOAD_URL, PHOTO_DIR, STICKER_DIR, IMAGE_DIR, GIF_DIR, FILE_DIR } = require('./constants');

const collectResourcesInfo = (messages=[]) => {
  for (let i = 0; i < messages.length; ++i) {
    const message = messages[i];
    switch (message.msgType) {
      case 2:
        if (!resourcesInfo.hasOwnProperty(message.message.normalUrl)) {
          resourcesInfo[message.message.normalUrl] = {
            msgType: 2,
            fileName: detectFileName(message.message.normalUrl),
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
                fileName: detectFileName(message.message.thumb),
              };
            }
            resourcesInfo[message.message.href].thumb = message.message.thumb;
          }
          else {
            const { extension, url } = determinateThumb(message.message.title);
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

const savePhoto = async (url, resource) => {
  try {
    const result = await downloadResource(url);
    fs.writeFileSync(path.join(fullExportPath, PHOTO_DIR, resource.fileName), result.data.read());
  }
  catch ({ error }) {
    console.log(error);
    logs += error.message + '\n';
  }
};

const saveMP3 = async (url, resource) => {
  try {
    const result = await downloadResource(url);
    fs.writeFileSync(path.join(fullExportPath, MP3_DIR, resource.fileName), result.data.read());
  }
  catch ({ error }) {
    console.log(error);
    logs += error.message + '\n';
  }
};

const saveSticker = async (url, resource) => {
  try {
    const result = await downloadResource(url);
    fs.writeFileSync(path.join(fullExportPath, STICKER_DIR, resource.fileName), result.data.read());
  }
  catch ({ error }) {
    console.log(error);
    logs += error.message + '\n';
  }
};

const saveLink = async (url, resource) => {
  try {
    const result = await downloadResource(url);
    fs.writeFileSync(path.join(fullExportPath, IMAGE_DIR, resource.fileName), result.data.read());
  }
  catch ({ error }) {
    console.log(error);
    logs += error.message + '\n';
  }
};

const saveGif = async (url, resource) => {
  try {
    const result = await downloadResource(url);
    fs.writeFileSync(path.join(fullExportPath, GIF_DIR, resource.fileName), result.data.read());
  }
  catch ({ error }) {
    console.log(error);
    logs += error.message + '\n';
  }
};

const saveFile = async (url, resource) => {
  try {
    const result = await downloadResource(url);
    fs.writeFileSync(path.join(fullExportPath, FILE_DIR, resource.fileName), result.data.read());
  }
  catch ({ error }) {
    console.log(error);
    logs += error.message + '\n';
  }
};

const getAllResources = () => {
  for (let prop in resourcesInfo) {
    const resource = resourcesInfo[prop];

    switch (resource.msgType) {
      case 2:
        savePhoto(prop, resource);
        break;
      case 3:
        saveMP3(prop, resource);
        break;
      case 4:
        saveSticker(prop, resource);
        break;
      case 6:
        saveLink(prop, resource);
        break;
      case 7:
        saveGif(prop, resource);
        break;
      case 17:
        saveLink(prop, resource);
        break;
      case 19:
        saveFile(prop, resource);
        break;
    }
  }
};

module.exports = {
  collectResourcesInfo,
  getAllResources,
};