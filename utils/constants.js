const ROOT_EXPORT_PATH = "/Zalo_Desktop"; // Edit here
const ROOT_FOLDER_NAME = "MessageExport";
const JS_DIR = "js";
const IMAGE_DIR = "images";
const CSS_DIR = "css";
const PHOTO_DIR = "photos";
const MP3_DIR = "mp3s";
const STICKER_DIR = "stickers";
const GIF_DIR = "gifs";
const MP4_DIR = "mp4s";
const FILE_DIR = "files";


const INITIAL_CSS = `.container { 
    margin: 0; 
    font: 12px/18px; 
    display:flex;
    flex-direction:column;
    align-items:center;
  }
  body{
    margin:0px;
  }
  div{
    font-family: "Segoe UI", "SegoeuiPc", "San Francisco", "Helvetica Neue", "Helvetica", "Lucida Grande", "Roboto", "Ubuntu", "Tahoma", Microsoft Sans Serif, Tahoma, Arial, sans-serif;
  }
  a {
    text-decoration: none;
  } 
  .page_header {
    position:fixed;
    border-bottom:1px solid #e3e6e8;
    width:100%;
    z-index:10;
    background-color: #ffff;
    display: flex;
    padding-left: 200px;
  }
  .page_body{
    padding-top: 64px;
    width:600px;
    margin: 0 auto;
  }
  .history{
    padding: 16px 0;
  }
  .message {
    margin: 0 -10px;
    transition: background-color 2s ease;
  }
  .default {
    padding: 10px;
  }
  .default.joined {
    margin-top: -10px;
  }
  .pull_left {
    float: left;
  }
  .service .userpic_wrap {
    padding-top: 10px;
  }
  .initials {
    font-size: 20px;
  }
  .userpic4 {
    background-color: #4f9cd9;
    width:34px;
    height:34px;
  }
  .userpic {
    display: block;
    border-radius: 50%;
    overflow: hidden;
  }
  .userpic .initials {
    display: block;
    color: #fff;
    text-align: center;
    text-transform: uppercase;
    user-select: none;
  }
  .default .body {
    margin-left: 50px;
  }
  .pull_right {
    float: right;
  }
  .details {
    color: rgba(0, 0, 0, 0.5);
    font-size: 13px;
  }
  .default .from_name {
    color: rgba(0, 0, 0, 0.6);
    font-size: 13px;
    padding-bottom: 5px;
    cursor: pointer;
  }
  .clearfix:after {
    content: " ";
    visibility: hidden;
    display: block;
    height: 0;
    clear: both;
  }
  .default .text{
    font-size:15px;
  }
  .default .media_wrap {
    padding-bottom: 5px;
  }
  .wrap_icon_file{
    width: 90px;
    height: 90px;
    display: flex;
    justify-content: center;
  }
 
  .media_wrap .thumb {
    object-fit: none;
    object-position: center;
    height: 90px;
    width: 90px;
  }

  .media_wrap .icon_file{
    height: 90px;
  }
  .media_wrap .gif{
    max-width:150px;
    max-height:100px;
  }
  .media_wrap .icon_location{
    wwidth: 90px;
    height: 90px;
  }
  .arrangedFlex{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .arrangedFlex .infor{
    display: flex;
    flex-direction: column;
  }
  .arrangedFlex .infor > * {
    padding: 5px 10px 
  }
  .arrangedFlex .infor .title{
    font-size: 14px;
    font-weight:500;
    color: rgba(0, 0, 0, 0.6);
  }
  .description{
    font-size: 13px;
    color: rgba(0, 0, 0, 0.6);
    font-family: "Segoe UI", "SegoeuiPc", "San Francisco", "Helvetica Neue", "Helvetica", "Lucida Grande", "Roboto", "Ubuntu", "Tahoma", Microsoft Sans Serif, Tahoma, Arial, sans-serif;
  }
  .title{
    font-family: "Segoe UI", "SegoeuiPc", "San Francisco", "Helvetica Neue", "Helvetica", "Lucida Grande", "Roboto", "Ubuntu", "Tahoma", Microsoft Sans Serif, Tahoma, Arial, sans-serif;
  }
  `;
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

module.exports = {
  ROOT_EXPORT_PATH,
  ROOT_FOLDER_NAME,
  JS_DIR,
  IMAGE_DIR,
  CSS_DIR,
  INITIAL_CSS,
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
};
