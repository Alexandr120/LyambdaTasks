const tg = require('../bot.js') ;
console.log('Telegram bot successfully started...');
console.log('\n');

tg.bot.on('message', (msg) => {
    if(!tg.commands.hasOwnProperty(`${msg.text}`)){
        if(msg.text === 'photo'){
            console.log(`Пользователь ${msg.chat.username} запросил картинку`);
            sendPhotoToTgBot(msg.chat.id)
        }else {
            console.log(`Пользователь ${msg.chat.username} написал: ${msg.text}`);
            tg.bot.sendMessage(msg.chat.id, `Вы написали '${msg.text}'.`);
        }
    }
});

const sendPhotoToTgBot = (chatId) => {
    tg.axios.get('https://picsum.photos/200/300', {
        responseType: 'arraybuffer'
    }).then((response) => {
        if(response.status === 200){
            tg.bot.sendPhoto(chatId, Buffer.from(response.data));
        }
    });
}