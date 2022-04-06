
const user = 'serveradmin';
const password = 'Data#1nikita';
const dbName = 'dm-staging';

exports.dbName = dbName;
exports.dbUri = `mongodb+srv://${user}:${encodeURIComponent(password)}@cluster0.rnxp1.mongodb.net/${dbName}?retryWrites=true&w=majority`;

exports.botToken = '1456202139:AAEdi5-su-wSa4TqIgy11UbMWT3ZWsEYuSo';
exports.botChatId = '-406557804'; // '187722293'; //

exports.slackChanelId = 'C03AAHRV5CK'
exports.slackToken = 'xoxb-2918083386960-2893245709381-BiF54gYNRzUGrWfvKHW0seGF'