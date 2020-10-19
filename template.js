const ejs = require("ejs");
const {
  convertTimeFormat,
} = require("./utils/utils");
const {
  STICKER_DOWNLOAD_URL,
  LOCATION_ICON,
  GOOGLE_MAP,
  IMAGE_DIR,
} = require("./utils/constants");

exports.htmlTemplate = async ({ msgType, message, sendDttm }) => {
  // Text type
  if (msgType === 1 || msgType === 20) {
    if (typeof message === 'string') {
      return ejs.renderFile("./templates/messages/message-1.ejs", {
        message,
      });
    }
    else {
      return ejs.renderFile('./templates/messages/message-1.ejs', {
        message: message.title,
      });
    }
  }
  // Photo type
  else if (msgType === 2) {
    const { normalUrl: url = "", title = "" } = message;

    return ejs.renderFile("./templates/messages/message-2.ejs", {
      url,
    });
  }
  // Sticker type
  else if (msgType === 4) {
    const { id } = message;
    const url = STICKER_DOWNLOAD_URL.replace("IdValue", id);

    return stringHtml = await ejs.renderFile("./templates/messages/message-4.ejs", {
      url,
    });
  }
  // Link type
  else if (msgType === 6) {
    const { title = "", description = "", href = "", thumb = "", params } = message;
    const mediaTitle = (JSON.parse(params)).mediaTitle;

    return ejs.renderFile("./templates/messages/message-6.ejs", {
      url: href,
      fullUrl: href.includes('http') ? href : `http://${href}`,
      title: mediaTitle,
      description: description,
    });
  }
  // Gif
  else if (msgType === 7) {
    const { normalUrl: url } = message;

    return ejs.renderFile("./templates/messages/message-7.ejs", {
      url,
    });
  }
  // Location type
  else if (msgType === 17) {
    const { desc, lat, lo } = message;
    const urlGgMap = GOOGLE_MAP.replace("latValue", lat).replace("loValue", lo);

    return ejs.renderFile("./templates/messages/message-17.ejs", {
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

    return ejs.renderFile("./templates/messages/message-19.ejs", {
      url: href,
      title,
      imgClass: thumb ? 'thumb' : 'img'
    });
  }
  // Add new member
  else if (msgType === -4) {
    return ejs.renderFile('./templates/messages/message--4.ejs', {
      title: JSON.stringify(message),
      time: convertTimeFormat(parseInt(sendDttm)),
    });
  }
  // Create a new note
  else if (msgType === -1909) {
    return ejs.renderFile('./templates/messages/message--4.ejs', {
      title: message['title'],
      time: convertTimeFormat(parseInt(sendDttm)),
    });
  }
  else if (msgType === 25) {
    return ejs.renderFile('./templates/messages/message--4.ejs', {
      title: message['description'],
      time: convertTimeFormat(parseInt(sendDttm)),
    });
  }
  // Default
  else {
    return ejs.renderFile("./templates/messages/message-1.ejs", {
      message: JSON.stringify(message),
    });
  }
};