const MongoClient = require('mongodb').MongoClient;

const config = require('../../../config')

exports.cleanOutdated = async function (req, res) {
  let dbClient = null;
  try {
    const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    dbClient = client;
    const documents = dbClient.db(config.mongoDbName).collection('Documents');

    const documentUrls = await getDocumentUrls(documents);

    for (let i = 0; i < documentUrls.length; i++) {
      const url = documentUrls[i];
      const count = await getDocumentsCountByUrl(documents, url);

      if (count > config.messagesToKeepNumber) {
        const lastValidDate = await getLastValidDateByUrl(documents, url);
        await removeExpiredDocuments(documents, url, lastValidDate);
      }
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

async function getDocumentUrls(documents) {
  const urls = await documents.distinct("url");

  return urls;
}

async function getDocumentsCountByUrl(documents, url) {
  const count = await documents.countDocuments({ url });

  return count;
}
async function getLastValidDateByUrl(documents, url) {
  const latestDocuments = await documents
    .find({ url }, { projection: { date: 1 }})
    .sort({ date:-1 })
    .limit(config.messagesToKeepNumber)
    .toArray();

  const lastFromLatestDocument = latestDocuments[latestDocuments.length - 1];
  const lastValidDate = lastFromLatestDocument.date;

  return lastValidDate;
}

async function removeExpiredDocuments(documents, url, lastValidDate) {
  await documents.deleteMany({ url, date: { $lte:lastValidDate }});
}