const {General} = require('../models/general')
const CUM_MOD = 10;
const MAX_COUNT_OF_GET_SLAVES = 3;
const SLAVES_LOSS_RATE = 0.6;
const Chance = require('chance');
let chance = new Chance();
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
                slaves: 0,
                got_slaves_today: false,
                stole_slaves:false,
            }
            await General.create(general_row)
            return 'Welcome to the club buddy'
        } else {
            return 'Вы уже зарегестрированны'
        }
    }
    async get_slaves(user_id,chat_id){
        const general = await General.findOne({
            where:{
                user_id: user_id,
                chat_id: chat_id,
            }})
        if(general===null){

            return 'Вы еще не зарегестрированны'
        } else if(general.got_slaves_today) {
            return 'Вы уже получали slaves сегодня'
        }else {
            const value = Math.round((Math.random()+Math.random()*(-SLAVES_LOSS_RATE))*MAX_COUNT_OF_GET_SLAVES)
            general.slaves+= value
            await General.update(
                {
                    slaves:general.slaves,
                    got_slaves_today:true
                },
                {where: {id:general.id}
                })
            return `Вы успешно захватили: ${value} fucking slaves \nВсего у вас :${general.slaves} slaves`
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
            return 'Вы уже пили cum, подождите пить можно каждые 2 часа'
        }else {
            let amount=0;
            for (let i=0;i<=general.slaves;i++){
                amount+= Math.round(Math.random()*CUM_MOD)
            }
            general.amount+= amount
            await General.update(
                 {
                     amount:general.amount,
                     play_today:true
                 },
                {where: {id:general.id}
                })
            return `Вы успешно выпили: ${amount}ml of cum.\nВсего выпито:${general.amount}ml of cum`
        }
    }
    async get_top10_cum(chat_id){
        const general = await General.findAll({where:{
            chat_id:chat_id,
            },order:
                [['amount','DESC']]
            })
        let i = 0;
        let out = 'Топ игроков чата\n';
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
    async get_top10_world_cum(){
        const general = await General.findAll({
            order:
                [['amount','DESC']]
        })
        let i = 0;
        let out = 'Топ игроков мира\n';
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
    async get_top10_slaves(chat_id){
        const general = await General.findAll({where:{
                chat_id:chat_id,
            },order:
                [['slaves','DESC']]
        })
        let i = 0;
        let out = 'Топ игроков чата\n';
        for(let value of general){
            if(i<10){
                out+=`${i}. ${value.username}: ${value.slaves} slaves\n`;
                i++
            } else {
                break
            }
        }
        return out
    }
    async get_top10_world_slaves(){
        const general = await General.findAll({
            order:
                [['slaves','DESC']]
        })
        let i = 0;
        let out = 'Топ игроков мира\n';
        for(let value of general){
            if(i<10){
                out+=`${i}. ${value.username}: ${value.slaves} slaves\n`;
                i++
            } else {
                break
            }
        }
        return out
    }
    async refresh_slaves(){
        await General.update({got_slaves_today:false},{
            where:{
                got_slaves_today:true,
            }
        })
    }
    async refresh_cum(){
        await General.update({play_today:false},{
            where:{
                play_today:true,
            }
        })
    }
    async refresh_steal_slaves(){
        await General.update({stole_slaves:false},{
            where:{
                stole_slaves:true,
            }
        })
    }
    async steal_slaves(user_id,chat_id,target_nickname){
        try {
            const burglar = await General.findOne({
                where: {
                    user_id: user_id,
                    chat_id: chat_id,
                }
            })
            const target = await General.findOne({
                where: {
                    username: target_nickname,
                    chat_id: chat_id,
                }
            })
            if (typeof (target) == "undefined" || target == null) {
                return `Неверный ник цели`;
            } else if (typeof (burglar) == "undefined" || burglar == null) {
                return 'Вы не зарегестрированны';
            } else if (target.slaves < 0) {
                return 'Нечего забирать';
            } else if(burglar.stole_slaves){
                return 'Вы уже крали slaves сегодня';
            } else {
                const stolen_slaves = chance.weighted([0,1,2],[60,30,10])
                target.slaves-=stolen_slaves
                burglar.slaves+=stolen_slaves
                await General.update(
                    {
                        amount:target.slaves,
                    },
                    {
                        where: {
                            id:chat_id,
                            user_id:target.id,
                        }
                    })
                await General.update(
                    {
                        amount:burglar.slaves,
                        stole_slaves:true,
                    },
                    {
                        where: {
                            id:chat_id,
                            user_id:burglar.id,
                        }
                    })
                return `Вы украли: ${stolen_slaves} slaves. У ${target.username}\nТеперь у вас:${burglar.slaves} slaves`
            }
        } catch (e){
            console.log(e)
        }
    }
}
module.exports = new General_activities()