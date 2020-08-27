const ejs = require("ejs");
const {
  writeToFile,
  isJoinedUserBefore,
  convertTimeFormat,
  determinateAvatar,
} = require("./utils/utils");
const { INITIAL_CSS, TITLE_GROUP_CHAT, CSS_DIR, JS_DIR } = require("./utils/constants");
const { onMouseOver, loadResources, loadPhotosResource, loadFilesResource, loadStickersResource, loadGifsResource, loadLinksResource, loadMP3sResource } = require("./public/script");
const { htmlTemplate } = require("./template");
const messages = require("./messages.json");

// Initial html,css file
const initialContent = async () => {
  const isChatGroup =
    messages.filter((msg) => msg.fromUid !== "0").length === messages.length;
  const header = isChatGroup ? TITLE_GROUP_CHAT : messages[0].dName;
  const htmlString = (await ejs.renderFile("./templates/common/initial.ejs")).replace("WHO", header);

  writeToFile(htmlString, "", "index.html");
  writeToFile(INITIAL_CSS, CSS_DIR, "style.css");
  const loadResourcesTemplateStr = '\n\n' +
    loadPhotosResource.toString() + '\n' +
    loadFilesResource.toString() + '\n' +
    loadStickersResource.toString() + '\n' +
    loadGifsResource.toString() + '\n' +
    loadLinksResource.toString() + '\n' +
    loadMP3sResource.toString() + '\n' +
    '(' + loadResources.toString() + ')();';
  writeToFile("var displayList = {};" + onMouseOver.toString() + loadResourcesTemplateStr, JS_DIR, "script.js");
};

// Append html, css file
const AppendContent = async () => {
  let appendHtml = "", htmlString = "";

  for (let i = 0; i < messages.length; i++) {
    const { dName, localDttm, fromUid } = messages[i];
    htmlString = await htmlTemplate(messages[i]);

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

  appendHtml += await ejs.renderFile("./templates/common/end.ejs");
  writeToFile(appendHtml, "", "/index.html");
};

exports.MainHandler = async () => {
  await initialContent();
  await AppendContent();
};
