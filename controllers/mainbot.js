const {General} = require('../models/general')
const CUM_MOD = 20;
class General_activities{
    async user_create(user_id,chat_id,username){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){
            const general_row  = {
                user_id: user_id,
                chat_id: chat_id,
                amount: 0,
                play_today: false,
                username: username,
            }
            await General.create(general_row)
            return 'Welcome to the club buddy'
        } else {
            return 'Вы уже зарегестрированны'
        }
    }
    async get_user_info(user_id,chat_id){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){

            return 'Вы еще не зарегестрированны'
        } else {
           return `Вы всего выпили: ${general.amount}ml of cum`
        }
    }
    async play_in_game(user_id,chat_id){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){

            return 'Вы еще не зарегестрированны'
        } else if(general.play_today) {
            return 'Вы уже пили сегодня cum'
        }else {
            const amount = Math.round(Math.random()*CUM_MOD)
            general.amount+= amount
            await General.update(
                 {
                     amount:general.amount,
                     play_today:true
                 },
                {where: {id:general.id}
                })
            return `Вы успешно выпили: ${amount}ml of cum.\nВсего выпито:${general.amount}`
        }
    }
    async get_top10(chat_id){
        const general = await General.findAll({where:{
            chat_id:chat_id,
            },order:
                [['amount','DESC']]
            })
        let i = 0;
        let out = 'Топ игроков\n';
        for(let value of general){
            if(i<10){
                out+=`${i}. ${value.username}: ${value.amount}ml of cum\n`;
                i++
            } else {
                break
            }
        }
        return out
    }
    async refresh_game(){
        await General.update({play_today:false},{
            where:{
                play_today:true
            }
        })
    }
}
module.exports = new General_activities()