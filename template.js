const ejs = require("ejs");
const path = require('path');
const {
  detectFileName,
  downloadExternalResource,
  determinateThumb,
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
} = require("./utils/constants");

// msgType === 2
const photos = {};
const savePhoto = async (msgType, url, fileName) => {
  if (photos.hasOwnProperty(url)) {
    return;
  }

  const { updatedFileName, size } = await downloadExternalResource({ msgType, url, fileName });

  const urlLocal = path.join(PHOTO_DIR, updatedFileName);

  photos[url] = {
    urlLocal,
    fileName: updatedFileName,
    size
  };
};

const files = {};
const saveFile = async (msgType, url, fileName, thumb, title) => {
  if (files.hasOwnProperty(url)) {
    return;
  }

  const { updatedFileName, size } = await downloadExternalResource({ msgType, url, fileName });

  let fileNameImg;
  
  if (thumb) {
    fileName = detectFileName(thumb);
    console.log(fileName);
    const { updatedFileName } = await downloadExternalResource({ msgType: 6, url: thumb, fileName });
    fileNameImg = updatedFileName;
  } else {
    const { extension, url } = determinateThumb(title);
    fileNameImg = `${extension}.svg`;
    const { updatedFileName } = await downloadExternalResource({ msgType: 6, url, fileName: fileNameImg });
    fileNameImg = updatedFileName;
  }

  files[url] = {
    fileNameFile: updatedFileName,
    size,
    urlLocal: path.join(FILE_DIR, updatedFileName),
    dir: IMAGE_DIR,
    fileNameImg
  };
};

const stickers = {};
const saveSticker = async (msgType, url, fileName) => {
  if (stickers.hasOwnProperty(url)) {
    return;
  }

  const { updatedFileName } = await downloadExternalResource({ msgType, url, fileName });
  const sizeOf = require('image-size');
  const dimensions = sizeOf(path.join(fullExportPath, STICKER_DIR, updatedFileName));

  stickers[url] = {
    urlLocal: path.join(STICKER_DIR, updatedFileName),
    width: dimensions.width,
    height: dimensions.height,
    dirValue: STICKER_DIR,
    fileName: updatedFileName
  };
};

const gifs = {};
const saveGif = async (msgType, url, fileName) => {
  if (gifs.hasOwnProperty(url)) {
    return;
  }

  const { updatedFileName } = await downloadExternalResource({ msgType, url, fileName });

  gifs[url] = {
    urlLocal: path.join(GIF_DIR, updatedFileName),
    dir: GIF_DIR,
    fileName: updatedFileName
  };
};

const links = {};
const saveLink = async (msgType, url, thumb, fileName) => {
  if (links.hasOwnProperty(url)) {
    return;
  }

  const { updatedFileName } = await downloadExternalResource({ msgType, url: thumb, fileName });

  links[url] = {
    dir: IMAGE_DIR,
    fileName: updatedFileName
  };
};

let hasDownloadedThumbForLocation = false;

const exportResourcesToFile = () => {
  const fs = require('fs');

  fs.writeFileSync(path.join(fullExportPath, '/resources/photos.js'), 'const photosResource = ' + JSON.stringify(photos));
  fs.writeFileSync(path.join(fullExportPath, '/resources/files.js'), 'const filesResource = ' + JSON.stringify(files));
  fs.writeFileSync(path.join(fullExportPath, '/resources/stickers.js'), 'const stickersResource = ' + JSON.stringify(stickers));
  fs.writeFileSync(path.join(fullExportPath, '/resources/gifs.js'), 'const gifsResource = ' + JSON.stringify(gifs));
  fs.writeFileSync(path.join(fullExportPath, '/resources/links.js'), 'const linksResource = ' + JSON.stringify(links));

  const end = (new Date()).valueOf();
  console.log(end);
};

process.on('exit', exportResourcesToFile);

exports.htmlTemplate = async ({ msgType, msgId, message }) => {
  // Text type
  if (msgType === 1) {
    return ejs.renderFile("./templates/msg-1.ejs", {
      message,
    });
  }
  // Photo type
  else if (msgType === 2) {
    const { normalUrl: url = "", title = "" } = message;
    let fileName = detectFileName(url);

    savePhoto(msgType, url, fileName);

    return ejs.renderFile("./templates/msg-2.ejs", {
      url
    });
  }
  // Mp3 type
  else if (msgType === 3) {
    const { href: url } = message;
    let fileName = `${msgId}.amr`;

    const { updatedFileName } = await downloadExternalResource({ msgType, url, fileName });
    fileName = updatedFileName;
    const urlLocal = path.join(MP3_DIR, fileName);

    return ejs.renderFile("./templates/msg-3.ejs", {
      url: urlLocal,
      fileName,
      dir: MP3_DIR
    });
  }
  // Sticker type
  else if (msgType === 4) {
    const sizeOf = require("image-size");
    const { id } = message;
    const url = STICKER_DOWNLOAD_URL.replace("IdValue", id);
    let fileName = `${msgId}.png`;

    saveSticker(msgType, url, fileName);

    return stringHtml = await ejs.renderFile("./templates/msg-4.ejs", {
      url,
      msgId,
    });
  }
  // Link type
  else if (msgType === 6) {
    const { title = "", description = "", href = "", thumb = "", } = message;
    let fileName = `${msgId}.png`;

    saveLink(msgType, href, thumb, fileName);

    return ejs.renderFile("./templates/msg-6.ejs", {
      url: href,
      title: title,
      description: description
    });
  }
  // Gif
  else if (msgType === 7) {
    const { normalUrl: url } = message;
    let fileName = `${msgId}.gif`;

    saveGif(msgType, url, fileName);

    return ejs.renderFile("./templates/msg-7.ejs", {
      url
    });
  }
  // // Location type
  else if (msgType === 17) {
    const { desc, lat, lo } = message;
    const iconName = "location.png";
    const urlGgMap = GOOGLE_MAP.replace("latValue", lat).replace("loValue", lo);

    if (!hasDownloadedThumbForLocation) {
      downloadExternalResource({ msgType: 6, url: LOCATION_ICON, fileName: iconName });
      hasDownloadedThumbForLocation = true;
    }

    return ejs.renderFile("./templates/msg-17.ejs", {
      fileName: iconName,
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
    let fileNameFile = title;

    saveFile(msgType, href, fileNameFile, thumb, title);

    return ejs.renderFile("./templates/msg-19.ejs", {
      url: href,
      title,
      wrapImgClass: thumb ? '' : 'wrap_icon_file',
      imgClass: thumb ? 'thumb' : 'icon_file'
    });
  }
  // Default
  else {
    return ejs.renderFile("./templates/default.ejs", {
      title: JSON.stringify(message),
    });
  }
};