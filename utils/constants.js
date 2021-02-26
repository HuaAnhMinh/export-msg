const ROOT_EXPORT_PATH = "/Zalo_Desktop"; // Edit here
const ROOT_FOLDER_NAME = "MessageExport";
const JS_DIR = "js";
const IMAGE_DIR = "images";
const STYLES_DIR = "styles";
const PHOTO_DIR = "photos";
const MP3_DIR = "mp3s";
const STICKER_DIR = "stickers";
const GIF_DIR = "gifs";
const MP4_DIR = "mp4s";
const FILE_DIR = "files";
const RESOURCES = "resources";

const STICKER_DOWNLOAD_URL =
  "https://zalo-api.zadn.vn/api/emoticon/sprite?eid=IdValue&size=130";
const EXTENSION_LIST = ["png", "jpeg", "pdf", "gif"];
const SIZE_UNIT_LIST = ["Bytes", "Kb", "Mb", "Gb"];
const SIZE_UNIT_CONVERT = 1024;
const LOCATION_ICON =
  "https://i0.wp.com/nmc-mic.ca/wp-content/uploads/2015/12/map-location-placeholder-pin-on-map-flat-icon.png?fit=256%2C256&ssl=1";
const GOOGLE_MAP = "https://maps.google.com/?q=latValue,loValue";
const ICON_DOWNLOAD = "https://zalo-chat-static.zadn.vn/v1/icon-typeValue.svg";
const EXTENSION_POPULAR = ["pdf", "word", "txt", "excel", "mp3", "mp4"];
const DEFAULT_NAME = "Tôi";
const SHORTEN_NAME = DEFAULT_NAME.charAt(DEFAULT_NAME);
const MAX_TEXT_LENGTH = 70;
const TITLE_GROUP_CHAT = "Chat nhóm";

const STATUS = {
  succeed: 0,
  failed: 1
};

module.exports = {
  ROOT_EXPORT_PATH,
  ROOT_FOLDER_NAME,
  JS_DIR,
  IMAGE_DIR,
  STYLES_DIR,
  STICKER_DOWNLOAD_URL,
  PHOTO_DIR,
  MP3_DIR,
  STICKER_DIR,
  GIF_DIR,
  MP4_DIR,
  FILE_DIR,
  EXTENSION_LIST,
  SIZE_UNIT_LIST,
  SIZE_UNIT_CONVERT,
  LOCATION_ICON,
  GOOGLE_MAP,
  ICON_DOWNLOAD,
  EXTENSION_POPULAR,
  DEFAULT_NAME,
  SHORTEN_NAME,
  MAX_TEXT_LENGTH,
  TITLE_GROUP_CHAT,
  RESOURCES,
  STATUS,
};
