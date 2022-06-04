require('dotenv').config();
const program = require('commander');
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(getTgToken(), {polling: true});
let chatId = '474773157'; // my chat id

program.version('0.0.1');

program
    .command('message')
    .description('Send message to Telegramm Bot.')
    .argument('<message>', 'message text')
    .alias('m')
    .action(function (message){
        console.log(message);
            bot.sendMessage(chatId, message);
            setTimeout(function (){
                process.exit();
            }, 200);

    });

program
    .command('photo')
    .description('Send photo to Telegramm Bot. Just drag and drop it console after p-flag')
    .argument('<path>', 'file path')
    .alias('p')
    .action(function (path){
        bot.sendPhoto(chatId, path);
        setTimeout(function (){
            process.exit();
        }, 200);
    })

program.parse(process.argv);

function getTgToken()
{
    return process.env.TG_TOKEN;
}