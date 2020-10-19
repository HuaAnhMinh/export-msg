const ejs = require("ejs");

const {
  writeToFile,
  isJoinedUserBefore,
  convertTimeFormat,
  determinateAvatar,
  collectRawResourcesInfo,
  copyRequiredResourceToDest,
  checkDownloadableContentExisted,
  downloadAllResources,
} = require("./utils/utils");
const { TITLE_GROUP_CHAT } = require("./utils/constants");
const { htmlTemplate } = require("./template");
const messages = require("./messages5.json");

// Initial html,css file
const initialContent = async (num=0) => {
  const isChatGroup =
    messages.filter((msg) => msg.fromUid !== "0").length === messages.length;
  const header = isChatGroup ? TITLE_GROUP_CHAT : messages[0].dName;
  const htmlString = (await ejs.renderFile("./templates/common/initial.ejs")).replace("WHO", header);

  writeToFile(htmlString, "", `index${num === 0 ? '' : num}.html`, true);
};

// Append html, css file
const AppendContent = async () => {
  checkDownloadableContentExisted(messages);

  let appendHtml = "", htmlString = "";
  let count = 0;
  let isFirstMessageInPage = true;

  for (let i = 0; i < messages.length; i++) {
    if (i % 10 === 0) {
      await initialContent(count);

      if (count > 0) {
        appendHtml += await ejs.renderFile('./templates/common/prev-messages.ejs', {
          prevMessages: `./index${count - 1 === 0 ? "" : count - 1}.html`,
        });
      }

      isFirstMessageInPage = true;
    }

    const { dName, sendDttm, fromUid, msgType } = messages[i];
    htmlString = await htmlTemplate(messages[i]);

    if (
      msgType !== -4 &&
      msgType !== -1909 &&
      msgType !== 25
    ) {
      if (isJoinedUserBefore(messages[i - 1], messages[i]) && !isFirstMessageInPage) {
        appendHtml += await ejs.renderFile('./templates/common/wrapper-joined.ejs', {
          time: convertTimeFormat(parseInt(sendDttm)),
          msgBody: htmlString,
        });
      }
      else {
        const { shortenName, name, color } = determinateAvatar(fromUid, dName);
        appendHtml += await ejs.renderFile('./templates/common/wrapper-not-joined.ejs', {
          shortenName,
          name,
          time: convertTimeFormat(parseInt(sendDttm)),
          color,
          msgBody: htmlString,
        });
      }
    }
    else {
      appendHtml += htmlString;
    }

    if (isFirstMessageInPage) {
      isFirstMessageInPage = false;
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

  if (!downloadProgress.hasDownloadableContent) {
    downloadProgress.percentage = 100;
  };
};

exports.MainHandler = async () => {
  copyRequiredResourceToDest();
  collectRawResourcesInfo(messages);
  await AppendContent();
  downloadAllResources();
};
