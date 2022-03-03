require('dotenv').config()
const winston = require('winston');
const TelegramBot = require('node-telegram-bot-api')
const sequelize = require('./db')
const models = require('./models/general')
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN,{polling:true})
const General_activities = require('./controllers/mainbot')
const fs = require("fs")
const buffer = fs.readFileSync('./files/welcome.mp4')
const schedule = require("node-schedule");

const dateForLogs = new Date();
const datetime = "_" + dateForLogs.getDate() + "_"
    + (dateForLogs.getMonth()+1)  + "_"
    + dateForLogs.getFullYear() + " _ "
    + dateForLogs.getHours() + "_"
    + dateForLogs.getMinutes() + "_"
    + dateForLogs.getSeconds();
const combinedLogName = `main${datetime}.log`
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ dirname:'log',filename: combinedLogName,handleExceptions: true }),
    ],
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
}
start()
bot.on('new_chat_members',async (msg) =>{
    try {
        const {chat: {id}} = msg
        await bot.sendAnimation(id,buffer)
    }
    catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
});
bot.onText(new RegExp('/register'), async (msg)=>{
    try {
        const {chat: {id}} = msg
        const userid = msg.from.id
        const username = msg.from.username
        const text = await General_activities.user_create(userid.toString(),id.toString(),username)
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
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
        logger.log({
            level: 'error',
            message:e
        });
    }
})
bot.onText(new RegExp('/getslaves'),async (msg)=>{
    const {chat: {id}} = msg
    const userid = msg.from.id
    try{
        const text = await General_activities.get_slaves(userid.toString(),id.toString())
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
})
bot.onText(new RegExp('/top10_cum'),async (msg)=>{
    try{
        const {chat: {id}} = msg
        const text = await General_activities.get_top10_cum(id.toString())
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
})
bot.onText(new RegExp('/top10world_cum'),async (msg)=>{
    try{
        const {chat: {id}} = msg
        const text = await General_activities.get_top10_world_cum()
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
})
bot.onText(new RegExp('/top10_slaves'),async (msg)=>{
    try{
        const {chat: {id}} = msg
        const text = await General_activities.get_top10_slaves(id.toString())
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
})
bot.onText(new RegExp('/top10world_slaves'),async (msg)=>{
    try{
        const {chat: {id}} = msg
        const text = await General_activities.get_top10_world_slaves()
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
})
bot.onText(new RegExp('/steal_slaves@NureGachiBot (@.*)'),async (msg,[{},match])=>{
    try{
        const {chat: {id}} = msg
        match = match.substr(match.indexOf("@") + 1);
        const userid = msg.from.id
        const text = await General_activities.steal_slaves(userid.toString(),id.toString(),match.toString())
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
})
bot.onText(new RegExp('/users_count'),async (msg)=>{
    const {chat: {id}} = msg
    try{
        const text = await General_activities.get_users_count()
        await bot.sendMessage(id,text)
    }catch (e){
        logger.log({
            level: 'error',
            message:e
        });
    }
})
schedule.scheduleJob('0 */2 * * *',async () => {
    await General_activities.refresh_cum()
});
schedule.scheduleJob('0 */4 * * *',async () => {
    await General_activities.refresh_steal_slaves()
});
schedule.scheduleJob('0 */8 * * *', async () => {
    await General_activities.refresh_slaves()
});