
const user = 'serveradmin';
const password = 'Data#1nikita';
const dbName = 'dm-staging';

exports.dbName = dbName;
exports.uri = `mongodb+srv://${user}:${encodeURIComponent(password)}@cluster0.rnxp1.mongodb.net/${dbName}?retryWrites=true&w=majority`;

exports.email = 'nwork2@mail.ru';
exports.emailPassword = 'ma2nikita07010';