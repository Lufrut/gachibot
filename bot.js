require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const sequelize = require('./db')
const models = require('./models/general')
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN,{polling:true})
const General_activities = require('./controllers/mainbot')
const fs = require("fs");
const schedule = require("node-schedule");
const buffer = fs.readFileSync('./files/welcome.mp4');

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e){
        console.log(e)
    }


}
start()
bot.on('new_chat_members',async (msg) =>{
    const {chat: {id}} = msg
    await bot.sendAnimation(id,buffer)
});
bot.onText(new RegExp('/register'), async (msg)=>{
    try {
        const {chat: {id}} = msg
        const userid = msg.from.id
        const username = msg.from.username
        const text = await General_activities.user_create(userid.toString(),id.toString(),username)
        await bot.sendMessage(id,text)
    }catch (e){
        console.log(e)
    }
})
bot.onText(new RegExp('/getstats'),async (msg)=>{
    const {chat: {id}} = msg
    const userid = msg.from.id
    try{
        const text = await General_activities.get_user_info(userid.toString(),id.toString())
        await bot.sendMessage(id,text)
    }catch (e){
        console.log(e)
    }

})
bot.onText(new RegExp('/play'),async (msg)=>{
    const {chat: {id}} = msg
    const userid = msg.from.id
    try{
        const text = await General_activities.play_in_game(userid.toString(),id.toString())
        await bot.sendMessage(id,text)
    }catch (e){
        console.log(e)
    }
})

bot.onText(new RegExp('/top10'),async (msg)=>{
    try{
        const {chat: {id}} = msg
        const text = await General_activities.get_top10(id.toString())
        await bot.sendMessage(id,text)
    }catch (e){
        console.log(e)
    }
})
schedule.scheduleJob({hour: 21, minute: 7}, () => {
    General_activities.refresh_game()
});