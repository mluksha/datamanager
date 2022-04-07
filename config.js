exports.mongoDBURL = `mongodb+srv://${process.env.USER}:${encodeURIComponent(process.env.PASSWORD)}@cluster0.rnxp1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

exports.messagesToKeepNumber = 50;