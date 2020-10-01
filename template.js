const ejs = require("ejs");
const path = require('path');
const {
  detectFileName,
  downloadExternalResource,
  determinateThumb,
  convertTimeFormat,
} = require("./utils/utils");
const {
  STICKER_DOWNLOAD_URL,
  LOCATION_ICON,
  GOOGLE_MAP,
  PHOTO_DIR,
  IMAGE_DIR,
  MP3_DIR,
  STICKER_DIR,
  GIF_DIR,
  MP4_DIR,
  FILE_DIR,
  STATUS,
} = require("./utils/constants");

// msgType === 2
const photos = {};
const savePhoto = async (msgType, url, fileName) => {
  if (photos.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName, size } = await downloadExternalResource({ msgType, url, fileName });

    const urlLocal = path.join(PHOTO_DIR, updatedFileName);

    photos[url] = {
      status: STATUS.succeed,
      urlLocal,
      fileName: updatedFileName,
      size,
    };
  }
  catch (error) {}
};

const files = {};
const saveFile = async (msgType, url, fileName, thumb, title) => {
  if (files.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName, size } = await downloadExternalResource({ msgType, url, fileName });

    let fileNameImg;
    
    if (thumb) {
      const { updatedFileName } = await downloadExternalResource({
        msgType: 6,
        url: thumb,
        fileName: resourcesInfo[thumb].fileName,
      });
      fileNameImg = updatedFileName;
    }
    else {
      const { extension, url } = determinateThumb(title);
      const { updatedFileName } = await downloadExternalResource({
        msgType: 6,
        url,
        fileName: resourcesInfo[url].fileName,
      });
      fileNameImg = updatedFileName;
    }

    files[url] = {
      status: STATUS.succeed,
      fileNameFile: updatedFileName,
      size,
      urlLocal: path.join(FILE_DIR, updatedFileName),
      dir: IMAGE_DIR,
      fileNameImg,
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
    const { updatedFileName } = await downloadExternalResource({ msgType, url, fileName });
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
  catch (error) {}
};

const gifs = {};
const saveGif = async (msgType, url, fileName) => {
  if (gifs.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName } = await downloadExternalResource({ msgType, url, fileName });

    gifs[url] = {
      status: STATUS.succeed,
      urlLocal: path.join(GIF_DIR, updatedFileName),
      dir: GIF_DIR,
      fileName: updatedFileName,
    };
  }
  catch (error) {}
};

const links = {};
const saveLink = async (msgType, url, thumb, fileName) => {
  if (links.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName } = await downloadExternalResource({ msgType, url: thumb, fileName });

    links[url] = {
      status: STATUS.succeed,
      dir: IMAGE_DIR,
      fileName: updatedFileName,
    };
  }
  catch (error) {}
};

const mp3s = {};
const saveMP3 = async (msgType, url, fileName) => {
  if (mp3s.hasOwnProperty(url)) {
    return;
  }

  try {
    const { updatedFileName } = await downloadExternalResource({ msgType, url, fileName });

    mp3s[url] = {
      status: STATUS.succeed,
      fileName: updatedFileName,
      dir: MP3_DIR,
      urlLocal: path.join(MP3_DIR, updatedFileName),
    };
  }
  catch (error) {}
};

const exportResourcesToFile = () => {
  const fs = require('fs');

  fs.writeFileSync(path.join(fullExportPath, '/resources/photos.js'), 'const photosResource = ' + JSON.stringify(photos));
  fs.writeFileSync(path.join(fullExportPath, '/resources/files.js'), 'const filesResource = ' + JSON.stringify(files));
  fs.writeFileSync(path.join(fullExportPath, '/resources/stickers.js'), 'const stickersResource = ' + JSON.stringify(stickers));
  fs.writeFileSync(path.join(fullExportPath, '/resources/gifs.js'), 'const gifsResource = ' + JSON.stringify(gifs));
  fs.writeFileSync(path.join(fullExportPath, '/resources/links.js'), 'const linksResource = ' + JSON.stringify(links));
  fs.writeFileSync(path.join(fullExportPath, '/resources/mp3s.js'), 'const mp3sResource = ' + JSON.stringify(mp3s));

  const end = (new Date()).valueOf();
  console.log(end);
  
  fs.writeFileSync(path.join(fullExportPath, '/resources/logs.txt'), logs);
};

process.on('exit', exportResourcesToFile);

exports.htmlTemplate = async ({ msgType, msgId, message, sendDttm }) => {
  // Text type
  if (msgType === 1) {
    if (typeof message === 'string') {
      return ejs.renderFile("./templates/msg-1.ejs", {
        message,
      });
    }
    else {
      return ejs.renderFile('./templates/msg-1.ejs', {
        message: message.title,
      });
    }
  }
  // Photo type
  else if (msgType === 2) {
    const { normalUrl: url = "", title = "" } = message;

    if (!downloadProgress.downloadingItems.includes(url)) {
      downloadProgress.downloadingItems.push(url);
      savePhoto(msgType, url, resourcesInfo[url].fileName);
    }

    return ejs.renderFile("./templates/msg-2.ejs", {
      url,
    });
  }
  // Mp3 type
  else if (msgType === 3) {
    const { href: url } = message;

    if (!downloadProgress.downloadingItems.includes(url)) {
      downloadProgress.downloadingItems.push(url);
      saveMP3(msgType, url, resourcesInfo[url].fileName);
    }

    return ejs.renderFile("./templates/msg-3.ejs", {
      url,
    });
  }
  // Sticker type
  else if (msgType === 4) {
    const { id } = message;
    const url = STICKER_DOWNLOAD_URL.replace("IdValue", id);

    if (!downloadProgress.downloadingItems.includes(url)) {
      downloadProgress.downloadingItems.push(url);
      saveSticker(msgType, url, resourcesInfo[url].fileName);
    }

    return stringHtml = await ejs.renderFile("./templates/msg-4.ejs", {
      url,
    });
  }
  // Link type
  else if (msgType === 6) {
    const { title = "", description = "", href = "", thumb = "", } = message;

    if (!downloadProgress.downloadingItems.includes(thumb)) {
      downloadProgress.downloadingItems.push(thumb);
      saveLink(msgType, href, thumb, resourcesInfo[thumb].fileName);
    }

    return ejs.renderFile("./templates/msg-6.ejs", {
      url: href,
      title: title,
      description: description,
    });
  }
  // Gif
  else if (msgType === 7) {
    const { normalUrl: url } = message;

    if (!downloadProgress.downloadingItems.includes(url)) {
      downloadProgress.downloadingItems.push(url);
      saveGif(msgType, url, resourcesInfo[url].fileName);
    }

    return ejs.renderFile("./templates/msg-7.ejs", {
      url,
    });
  }
  // Location type
  else if (msgType === 17) {
    const { desc, lat, lo } = message;
    const urlGgMap = GOOGLE_MAP.replace("latValue", lat).replace("loValue", lo);

    if (!downloadProgress.downloadingItems.includes(LOCATION_ICON)) {
      downloadProgress.downloadingItems.push(LOCATION_ICON);
      downloadExternalResource({
        msgType: 6,
        url: LOCATION_ICON,
        fileName: resourcesInfo[LOCATION_ICON].fileName,
      });
    }

    return ejs.renderFile("./templates/msg-17.ejs", {
      fileName: resourcesInfo[LOCATION_ICON].fileName,
      url: urlGgMap,
      desc,
      lat,
      lo,
      dir: IMAGE_DIR,
    });
  }
  // File type
  else if (msgType === 19) {
    const { title = "", href = "", thumb = "" } = message;

    if (!downloadProgress.downloadingItems.includes(href)) {
      downloadProgress.downloadingItems.push(href);
      saveFile(msgType, href, resourcesInfo[href].fileName, thumb, title);
    }

    return ejs.renderFile("./templates/msg-19.ejs", {
      url: href,
      title,
      wrapImgClass: thumb ? '' : 'wrap_icon_file',
      imgClass: thumb ? 'thumb' : 'icon_file'
    });
  }
  // Add new member
  else if (msgType === -4) {
    return ejs.renderFile('./templates/msg--4.ejs', {
      title: JSON.stringify(message),
      time: convertTimeFormat(parseInt(sendDttm)),
    });
  }
  // Default
  else {
    return ejs.renderFile("./templates/default.ejs", {
      title: JSON.stringify(message),
    });
  }
};