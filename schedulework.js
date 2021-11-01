const schedule = require("node-schedule");
const General_activities = require("./controllers/mainbot");
let rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 5;
let refresh_cum = schedule.scheduleJob(rule,async () => {
    await General_activities.refresh_cum()
});
let refresh_slave = schedule.scheduleJob({hour: 4, minute: 0}, async () => {
    await General_activities.refresh_slaves()
});
module.exports  ={
    refresh_cum,
    refresh_slave
}