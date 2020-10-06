const ejs = require("ejs");
const fs = require('fs');
const path = require('path');

const {
  writeToFile,
  isJoinedUserBefore,
  convertTimeFormat,
  determinateAvatar,
  collectRawResourcesInfo,
  copyRequiredResourceToDest,
} = require("./utils/utils");
const { TITLE_GROUP_CHAT } = require("./utils/constants");
const { htmlTemplate } = require("./template");
const messages = require("./messages3.json");

// Initial html,css file
const initialContent = async (num=0) => {
  const isChatGroup =
    messages.filter((msg) => msg.fromUid !== "0").length === messages.length;
  const header = isChatGroup ? TITLE_GROUP_CHAT : messages[0].dName;
  const htmlString = (await ejs.renderFile("./templates/common/initial.ejs")).replace("WHO", header);

  writeToFile(htmlString, "", `index${num === 0 ? '' : num}.html`);
};

// Append html, css file
const AppendContent = async () => {
  let appendHtml = "", htmlString = "";
  let count = 0;

  for (let i = 0; i < messages.length; i++) {
    if (i % 10 === 0) {
      await initialContent(count);

      if (count > 0) {
        appendHtml += await ejs.renderFile('./templates/common/prev-messages.ejs', {
          prevMessages: `./index${count - 1 === 0 ? "" : count - 1}.html`,
        });
      }
    }

    const { dName, localDttm, fromUid, msgType } = messages[i];
    htmlString = await htmlTemplate(messages[i]);

    if (msgType !== -4 && msgType !== -1909) {
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

    if (i % 10 === 9 && i < messages.length - 1) {
      appendHtml += await ejs.renderFile("./templates/common/next-messages.ejs", {
        nextMessages: `./index${count + 1}.html`,
      });
      appendHtml += await ejs.renderFile("./templates/common/end.ejs");
      writeToFile(appendHtml, "", `/index${count === 0 ? '' : count}.html`);
      ++count;
      appendHtml = "";
    }
    else if (i === messages.length - 1) {
      appendHtml += await ejs.renderFile("./templates/common/end.ejs");
      writeToFile(appendHtml, "", `/index${count === 0 ? '' : count}.html`);
      appendHtml = "";
    }
  }
};

exports.MainHandler = async () => {
  copyRequiredResourceToDest();
  collectRawResourcesInfo(messages);
  await AppendContent();
};
