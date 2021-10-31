const schedule = require("node-schedule");
const General_activities = require("./controllers/mainbot");
let rule = new schedule.RecurrenceRule();
rule.hour = 3;
rule.minute = 0;
schedule.scheduleJob(rule,async () => {
    await General_activities.refresh_cum()
});
schedule.scheduleJob({hour: 4, minute: 0}, async () => {
    await General_activities.refresh_slaves()
});