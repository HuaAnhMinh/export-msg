const ejs = require("ejs");
const {
  detectFileName,
  downloadExternalResource,
  determinateThumb,
  limitText,
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

exports.htmlTemplate = async ({ msgType, msgId, message }) => {
  // Text type
  if (msgType === 1) {
    return ejs.renderFile("./templates/msg-1.ejs", {
      message: limitText(message),
    });
  }
  // Photo type
  else if (msgType === 2) {
    const { normalUrl: url = "", title = "" } = message;
    let fileName = detectFileName(url);
    const { updatedFileName, size } = await downloadExternalResource({ msgType, url, fileName });
    fileName = updatedFileName;
    const urlLocal = PHOTO_DIR + "/" + fileName;

    return ejs.renderFile("./templates/msg-2.ejs", {
      url: urlLocal,
      fileName,
      title: limitText(title),
      size,
      dir: PHOTO_DIR
    });
  }
  // Mp3 type
  else if (msgType === 3) {
    const { href: url } = message;
    let fileName = `${msgId}.amr`;

    const { updatedFileName } = await downloadExternalResource({ msgType, url, fileName });
    fileName = updatedFileName;
    const urlLocal = MP3_DIR + "/" + fileName;

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

    const { updatedFileName } = await downloadExternalResource({
      msgType,
      url,
      fileName,
    });
    fileName = updatedFileName;
    const urlLocal = STICKER_DIR + "/" + fileName;

    const stringHtml = await ejs.renderFile("./templates/msg-4.ejs", {
      url: urlLocal,
    });
    const dimensions = sizeOf(fullExportPath + "/" + STICKER_DIR + "/" + fileName);

    return stringHtml
      .replace("fileNameValue", fileName)
      .replace("pathValue", fullExportPath)
      .replace("widthValue", dimensions.width)
      .replace("heightValue", dimensions.height)
      .replace("dirValue", STICKER_DIR);

  }
  // Link type
  else if (msgType === 6) {
    const { title = "", description = "", href = "", thumb = "", } = message;
    let fileName = `${msgId}.png`;

    const { updatedFileName } = await downloadExternalResource({
      msgType,
      url: thumb,
      fileName,
    });
    fileName = updatedFileName;

    return ejs.renderFile("./templates/msg-6.ejs", {
      fileName,
      url: href,
      title: limitText(title),
      description: limitText(description),
      dir: IMAGE_DIR
    });
  }
  // Gif
  else if (msgType === 7) {
    const { normalUrl: url } = message;
    let fileName = `${msgId}.gif`;

    const { updatedFileName } = await downloadExternalResource({
      msgType,
      url,
      fileName,
    });
    fileName = updatedFileName;
    const urlLocal = GIF_DIR + "/" + fileName;


    return ejs.renderFile("./templates/msg-7.ejs", {
      fileName,
      url: urlLocal,
      dir: GIF_DIR
    });
  }
  // // Location type
  else if (msgType === 17) {
    const { desc, lat, lo } = message;
    const iconName = "location.png";
    const urlGgMap = GOOGLE_MAP.replace("latValue", lat).replace("loValue", lo);

    await downloadExternalResource({
      msgType: 6,
      url: LOCATION_ICON,
      fileName: iconName,
    });

    return ejs.renderFile("./templates/msg-17.ejs", {
      fileName: iconName,
      url: urlGgMap,
      desc: limitText(desc),
      lat,
      lo,
      dir: IMAGE_DIR
    });
  }
  // File type
  else if (msgType === 19) {
    const { title = "", href = "", thumb = "" } = message;
    let fileNameFile = title;
    let fileNameImg = "";


    const { updatedFileName, size } = await downloadExternalResource({
      msgType,
      url: href,
      fileName: fileNameFile,
    });
    fileNameFile = updatedFileName;

    if (thumb) {
      fileName = detectFileName(thumb);
      downloadExternalResource({
        msgType: 6,
        url: thumb,
        fileName,
      });
    } else {
      const { extension, url } = determinateThumb(title);
      fileNameImg = `${extension}.svg`;
      const { updatedFileName } = await downloadExternalResource({ msgType: 6, url, fileName: fileNameImg });
      fileNameImg = updatedFileName;
    }
    const urlLocal = FILE_DIR + "/" + fileNameFile;


    return ejs.renderFile("./templates/msg-19.ejs", {
      url: urlLocal,
      title: limitText(title),
      size,
      fileName: fileNameImg,
      dir: IMAGE_DIR
    });
  }
  // Default
  else {
    return ejs.renderFile("./templates/default.ejs", {
      title: JSON.stringify(message),
    });
  }
};