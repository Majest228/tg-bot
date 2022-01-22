const telegramApi = require('node-telegram-bot-api')

const token = "5194647849:AAFiuY0u_jzzZsCdJFqj0CJxGJhsYHCAjK4"

const bot = new telegramApi(token,{polling: true})

const chats = {}

const {gameOptions, againOptions} = require("./options")

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал число от 1 до 9, пожалуйста угадай данное число.`)
    const randomNumber = Math.floor(Math.random() * 10)
    console.log(randomNumber)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,`Пожалуйста, отгадай данное число`, gameOptions)
}

const start = () => {
   
    bot.setMyCommands([
        {command: "/start", description : "Start the bot"},
        {command: "/info", description : "Info the bot"},
        {command: "/game", description : "It's game mode"},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === "/start") {
            await bot.sendSticker(chatId,`https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/7.webp`)
            return bot.sendMessage(chatId, `Добро пожаловать в Telegram channel.`)
        }
        if (text === "/info") {
            await bot.sendSticker(chatId,`https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp`)
            return bot.sendMessage(chatId,`Ваше имя и фамилия - ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === "/game") {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, `Я вас не понимаю, пожалуйста повторите еще раз!`)
    })

    bot.on('callback_query',async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;
        if (data === "/again") {
            return startGame(chatId)

        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId,`Поздравляю, ты угадал цифру - ${chats[chatId]}`,againOptions)
        }
        else {
            return bot.sendMessage(chatId,`К сожелению ты не угадал. Бот загада цифру - ${chats[chatId]}`,againOptions)
        }
    })
}

start()