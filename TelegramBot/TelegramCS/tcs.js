const tg = require('../bot.js') ;
const program = require('commander');

program.version('0.0.1');

program
    .command('message')
    .description('Send message to Telegram Bot.')
    .argument('<message>', 'message text')
    .alias('m')
    .action(function (message){
        console.log(message);
            tg.bot.sendMessage(tg.chatId, message);
            setTimeout(function (){
                process.exit();
            }, 200);

    });

program
    .command('photo')
    .description('Send photo to Telegram Bot. Just drag and drop it console after p-flag')
    .argument('<path>', 'file path')
    .alias('p')
    .action(function (path){
        tg.bot.sendPhoto(tg.chatId, path);
        setTimeout(function (){
            process.exit();
        }, 200);
    })

program.parse(process.argv);