
const user = 'serveradmin';
const password = 'Data#1nikita';
const dbName = 'dm-staging';

exports.dbName = dbName;
exports.dbUri = `mongodb+srv://${user}:${encodeURIComponent(password)}@cluster0.rnxp1.mongodb.net/${dbName}?retryWrites=true&w=majority`;

exports.botToken = '1456202139:AAEdi5-su-wSa4TqIgy11UbMWT3ZWsEYuSo';
exports.botChatId = '187722293'; //'-406557804';