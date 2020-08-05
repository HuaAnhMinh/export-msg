const ejs = require("ejs");
const {
  writeToFile,
  isJoinedUserBefore,
  convertTimeFormat,
  determinateAvatar,
} = require("./utils/utils");
const { INITIAL_CSS, TITLE_GROUP_CHAT, CSS_DIR, JS_DIR } = require("./utils/constants");
const { onMouseOver } = require("./public/script");
const { htmlTemplate } = require("./template");
const messages = require("./messages.json");

// Initial html,css file
const initialContent = async () => {
  const isChatGroup =
    messages.filter((msg) => msg.fromUid !== "0").length === messages.length;
  const header = isChatGroup ? TITLE_GROUP_CHAT : messages[0].dName;
  const htmlString = (
    await ejs.renderFile("./templates/common/initial.ejs")
  ).replace("WHO", header);

  writeToFile(htmlString, "", "index.html");
  writeToFile(INITIAL_CSS, CSS_DIR, "style.css");
  writeToFile("var displayList = {};" + onMouseOver.toString(), JS_DIR, "script.js");
};
// Append html, css file
const AppendContent = async () => {
  let appendHtml = "";

  for (let i = 0; i < messages.length; i++) {
    const { dName, localDttm, fromUid } = messages[i];
    const htmlString = await htmlTemplate(messages[i]);

    if (isJoinedUserBefore(messages[i - 1], messages[i])) {
      const wrapInitMsg = await ejs.renderFile(
        "./templates/common/initial-msg-joined.ejs",
        { time: convertTimeFormat(localDttm) }
      );
      const wrapEndMsg = await ejs.renderFile("./templates/common/end-msg.ejs");

      appendHtml += wrapInitMsg + htmlString + wrapEndMsg;
    } else {
      const { shortenName, name, color } = determinateAvatar(fromUid, dName);
      let wrapInitMsg = (
        await ejs.renderFile("./templates/common/initial-msg.ejs", {
          shortenName,
          name,
          time: convertTimeFormat(localDttm),
          color
        })
      )
      const wrapEndMsg = await ejs.renderFile("./templates/common/end-msg.ejs");

      appendHtml += wrapInitMsg + htmlString + wrapEndMsg;
    }
  }
  appendHtml += await ejs.renderFile("./templates/common/end.ejs");
  writeToFile(appendHtml, "", "/index.html");
};

exports.MainHandler = async () => {
  await initialContent();
  await AppendContent();
};
