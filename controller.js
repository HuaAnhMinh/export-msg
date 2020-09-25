const ejs = require("ejs");
const fs = require('fs');
const path = require('path');

const {
  writeToFile,
  isJoinedUserBefore,
  convertTimeFormat,
  determinateAvatar,
} = require("./utils/utils");
const { TITLE_GROUP_CHAT, CSS_DIR, JS_DIR } = require("./utils/constants");
const { onMouseOver, loadResources, loadPhotosResource, loadFilesResource, loadStickersResource, loadGifsResource, loadLinksResource, loadMP3sResource, downloadedStatus } = require("./public/script");
const { htmlTemplate } = require("./template");
const messages = require("./messages.json");

// Initial html,css file
const initialContent = async () => {
  const isChatGroup =
    messages.filter((msg) => msg.fromUid !== "0").length === messages.length;
  const header = isChatGroup ? TITLE_GROUP_CHAT : messages[0].dName;
  const htmlString = (await ejs.renderFile("./templates/common/initial.ejs")).replace("WHO", header);

  writeToFile(htmlString, "", "index.html");
  const loadResourcesTemplateStr = '\n\n' +
    'const downloadedStatus = { succeed: 0, failed: 1, };' + '\n' +
    loadPhotosResource.toString() + '\n' +
    loadFilesResource.toString() + '\n' +
    loadStickersResource.toString() + '\n' +
    loadGifsResource.toString() + '\n' +
    loadLinksResource.toString() + '\n' +
    loadMP3sResource.toString() + '\n' +
    '(' + loadResources.toString() + ')();';
  writeToFile("var displayList = {};\n" + onMouseOver.toString() + loadResourcesTemplateStr, JS_DIR, "script.js");

  fs.createReadStream('./templates/common/error-placeholder.png')
  .pipe(fs.createWriteStream(path.join(fullExportPath, 'resources/error-placeholder.png')));
};

// Append html, css file
const AppendContent = async () => {
  let appendHtml = "", htmlString = "";

  for (let i = 0; i < messages.length; i++) {
    const { dName, localDttm, fromUid } = messages[i];
    htmlString = await htmlTemplate(messages[i]);

    if (messages[i].msgType !== -4) {
      if (isJoinedUserBefore(messages[i - 1], messages[i])) {
        appendHtml += await ejs.renderFile('./templates/common/msg-wrapper-joined.ejs', {
          time: convertTimeFormat(localDttm),
          msgBody: htmlString
        });
      }
      else {
        const { shortenName, name, color } = determinateAvatar(fromUid, dName);
        appendHtml += await ejs.renderFile('./templates/common/msg-wrapper.ejs', {
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
  await AppendContent();
};
