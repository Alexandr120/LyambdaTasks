require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios').default;
const bot = new TelegramBot(process.env.TG_TOKEN, {polling: true});
const chatId = '474773157'; // my chat id
const commands = require('../TelegramBot/menuList.json');
global.weather = require('../TelegramBot/Wheather/weather');
global.currencies = require('../TelegramBot/ExchangeRates/currencies');

bot.onText(/\/start/, (msg) => {
    sendMenuList(msg.chat.id);
});

const sendMenuList = (chatId) => {
    let menuList = 'Choose what you would like to know?\n';
    for (let key in commands){
        menuList = `${menuList} ${key} - ${commands[key].title} \n`;
    }
    bot.sendMessage(chatId, `${menuList}`);
}

bot.on('message', (msg) => {
    if(commands.hasOwnProperty(`${msg.text}`)){
        let command = `${msg.text}`;
        let keyboards = getKeyboards(commands[command].script, commands[command].target);
        bot.sendMessage(msg.chat.id, `${commands[command].menuDesc}`, {
            "reply_markup" : {
                "inline_keyboard" : keyboards
            }
        })
    }
});

bot.on('callback_query', onCallbackQuery = (query) => {
    getMessageByCallbackQuery(query.data).then((msg) => {
        bot.sendMessage(query.message.chat.id, msg);
    });
});

const getMessageByCallbackQuery = async (query) => {
    let res = '';
    if(query.indexOf('weather') !== -1){
        let hourOption = query.replace('weather-', '');
        res = await weather.getWeather(hourOption);

    } else if(query.indexOf('bank') !== -1){
        let bankId = query.replace('bank-', '');
        res = await currencies.getExchangeRates(bankId);
    }
    return res;
}

const getKeyboards = (variable, target) => {
  let v = global[variable];
    let keyboards = [];
    let arr = []
    for (let k in v[target]){
        let obj = {};
        obj.text = `${v[target][k]}`;
        obj.callback_data = `${k}`;
        arr.push(obj);
    }
    keyboards.push(arr);
    return keyboards;
}

module.exports = { bot, axios, commands, chatId };
