const ejs = require("ejs");
const fs = require('fs');
const path = require('path');

const {
  writeToFile,
  isJoinedUserBefore,
  convertTimeFormat,
  determinateAvatar,
  collectRawResourcesInfo,
} = require("./utils/utils");
const { TITLE_GROUP_CHAT, CSS_DIR, JS_DIR } = require("./utils/constants");
const { loadResources, loadPhotosResource, loadFilesResource, loadStickersResource, loadGifsResource, loadLinksResource, loadMP3sResource, downloadedStatus } = require("./public/script");
const { htmlTemplate } = require("./template");
const messages = require("./messages.json");

// Initial html,css file
const initialContent = async () => {
  const isChatGroup =
    messages.filter((msg) => msg.fromUid !== "0").length === messages.length;
  const header = isChatGroup ? TITLE_GROUP_CHAT : messages[0].dName;
  const htmlString = (await ejs.renderFile("./templates/common/initial.ejs")).replace("WHO", header);

  writeToFile(htmlString, "", "index.html");
  const loadResourcesTemplateStr = 'const downloadedStatus = { succeed: 0, failed: 1, };' + '\n' +
    loadPhotosResource.toString() + '\n' +
    loadFilesResource.toString() + '\n' +
    loadStickersResource.toString() + '\n' +
    loadGifsResource.toString() + '\n' +
    loadLinksResource.toString() + '\n' +
    loadMP3sResource.toString() + '\n' +
    '(' + loadResources.toString() + ')();';
  writeToFile(loadResourcesTemplateStr, JS_DIR, "script.js");

  fs.createReadStream('./templates/common/error-placeholder.png')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'resources/error-placeholder.png')));

  fs.createReadStream('./templates/styles/message.css')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'styles/message.css')));

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

// Append html, css file
const AppendContent = async () => {
  let appendHtml = "", htmlString = "";

  for (let i = 0; i < messages.length; i++) {
    const { dName, localDttm, fromUid, msgType } = messages[i];
    htmlString = await htmlTemplate(messages[i]);

    if (msgType !== -4) {
      if (isJoinedUserBefore(messages[i - 1], messages[i])) {
        appendHtml += await ejs.renderFile('./templates/common/wrapper-joined.ejs', {
          time: convertTimeFormat(localDttm),
          msgBody: htmlString
        });
      }
      else {
        const { shortenName, name, color } = determinateAvatar(fromUid, dName);
        appendHtml += await ejs.renderFile('./templates/common/wrapper-not-joined.ejs', {
          shortenName,
          name,
          time: convertTimeFormat(localDttm),
          color,
          msgBody: htmlString
        });
      }
    }
    else {
      appendHtml += htmlString;
    }
  }

  appendHtml += await ejs.renderFile("./templates/common/end.ejs");
  writeToFile(appendHtml, "", "/index.html");
};

exports.MainHandler = async () => {
  await initialContent();
  collectRawResourcesInfo(messages);
  await AppendContent();
};
