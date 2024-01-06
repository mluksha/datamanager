exports.host = 'https://nkt-core-datamanager.onrender.com';

exports.mongoDBURL = `mongodb+srv://${process.env.USER}:${encodeURIComponent(process.env.PASSWORD)}@cluster0.rnxp1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
exports.mongoDbName = process.env.DB_NAME;

exports.slackChanelId = process.env.SLACK_CHANEL_ID;
exports.slackToken = process.env.SLACK_BOT_TOKEN;

exports.messagesToKeepNumber = 50;