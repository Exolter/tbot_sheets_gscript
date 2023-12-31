var token = ""; // FILL IN YOUR OWN TOKEN
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = ""; // FILL IN YOUR GOOGLE WEB APP ADDRESS
var ssId = ""; // FILL IN THE ID OF YOUR SPREADSHEET

function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendText(id, text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hi there");
}

function doPost(e) {
  // this is where telegram works
  var data = JSON.parse(e.postData.contents);
  var text = data.message.text;
  var id = data.message.chat.id;
  var name = data.message.chat.first_name;
  var answer = "Дякую, " + name + ", за запис до найкрутішого веб серверу ";
  var command =
    "Привіт! " +
    name +
    ", Залиш будь ласка свої дані в такому форматі та одним повідомленням (Ім'я, електронна пошта, номер телефону)";

  if (text == "/start") {
    sendText(id, command);
  } else {
    sendText(id, answer);
    SpreadsheetApp.openById(ssId)
      .getSheets()[0]
      .appendRow([new Date(), id, name, text]);
  }

  if (/^@/.test(text)) {
    var sheetName = text.slice(1).split(" ")[0];
    var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName)
      ? SpreadsheetApp.openById(ssId).getSheetByName(sheetName)
      : SpreadsheetApp.openById(ssId).insertSheet(sheetName);
    var comment = text.split(" ").slice(1).join(" ");
    sheet.appendRow([new Date(), id, name, comment, answer]);
  }
}
