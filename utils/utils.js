const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

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
  RESOURCES
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
};

exports.checkDownloadableContentExisted = (messages=[]) => {
  for (let i = 0; i < messages.length; ++i) {
    const msgType = messages[i].msgType;

    if (msgType === 2 || msgType === 4 || msgType === 6 ||
        msgType === 7 || msgType === 17 || msgType === 19) {
      hasDownloadableContent = true;
      break;
    }
  }
};