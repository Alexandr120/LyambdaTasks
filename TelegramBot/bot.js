require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios').default;
const bot = new TelegramBot(process.env.TG_TOKEN, {polling: true})
let chatId = '474773157'; // my chat id

console.log('Telegram bot successfully started...');
console.log('\n');

bot.on('message', (msg) => {
    if(msg.text === 'photo'){
        console.log(`Пользователь ${msg.chat.username} запросил картинку`);
        sendPhotoToTgBot(msg.chat.id)
    }else {
        console.log(`Пользователь ${msg.chat.username} написал: ${msg.text}`);
        bot.sendMessage(msg.chat.id, `Вы написали '${msg.text}'.`);
    }
});

const sendPhotoToTgBot = (chatId) => {
    axios.get('https://picsum.photos/200/300', {
        responseType: 'arraybuffer'
    }).then((response) => {
        if(response.status === 200){
            bot.sendPhoto(chatId, Buffer.from(response.data));
        }
    });
}

module.exports = { bot, axios };
