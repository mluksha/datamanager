const MongoClient = require('mongodb').MongoClient;

const config = require('../../../config')

exports.cleanOutdated = async function (req, res) {
  let dbClient = null;
  try {
    const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    dbClient = client;
    const documents = dbClient.db(process.env.DB_NAME).collection('Documents');
    documentsCount = await documents.countDocuments();

    if (documentsCount > config.messagesToKeepNumber) {
      const latestDocuments = await documents.find().sort({date:-1}).limit(config.messagesToKeepNumber).toArray();

      const lastFromLatestDocument = latestDocuments[latestDocuments.length - 1];

      await documents.deleteMany({date: {$lt:lastFromLatestDocument.date}});
    }

    res.json({
      success: true,
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  } finally {
    dbClient && await dbClient.close();
  }
};