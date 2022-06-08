require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios').default;
const bot = new TelegramBot(process.env.TG_TOKEN, {polling: true})
const weather = require('../TelegramBot/weather.js');
let chatId = '474773157'; // my chat id
let commands = require('../TelegramBot/menuList.json');

bot.onText(/\/start/, (msg) => {
    sendMenuList(msg.chat.id);
});

bot.on('message', (msg) => {console.log(msg.text);
    if(!commands.hasOwnProperty(`${msg.text}`)){
        bot.sendMessage(msg.chat.id, 'Unrecognized command. Say what?');
        sendMenuList(msg.chat.id);
    }
});

const sendMenuList = (chatId) => {
    let menuList = 'Choose what you would like to know?\n';
    for (let key in commands){
        menuList = `${menuList} ${key} - ${commands[key]} \n`;
    }
    bot.sendMessage(chatId, `${menuList}`);
}

bot.onText(/\/weather_dnipro/, (msg) => {
   bot.sendMessage(msg.chat.id, 'Выберите временной интервал отображения погоды:', {
       "reply_markup" : {
           "inline_keyboard" : [
               [
                 {
                    text : "C интервалом 3 часа",
                    callback_data : "weather-3"
                 },
                 {
                     text : "C интервалом 6 часов",
                     callback_data : "weather-6"
                 }
               ]
           ]
       }
   })
});

bot.on('callback_query', onCallbackQuery = (query) => {
    if(query.data.indexOf('weather') !== -1){
        let hourOption = query.data.replace('weather-', '');
        weather.getWeather(hourOption).then((msg) => {
            bot.sendMessage(query.message.chat.id, msg);
        });
    }
});

module.exports = { bot, axios };
