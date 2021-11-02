const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const General = sequelize.define('general', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    user_id: {type: DataTypes.STRING},
    chat_id: {type: DataTypes.STRING},
    amount: {type: DataTypes.INTEGER},
    play_today: {type: DataTypes.BOOLEAN},
    username: {type: DataTypes.STRING},
    slaves: {type: DataTypes.INTEGER},
    got_slaves_today:{type: DataTypes.BOOLEAN},
    stole_slaves:{type: DataTypes.BOOLEAN},
    }
)
module.exports = {
    General,
}