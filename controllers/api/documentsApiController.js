const axios = require('axios');
const jsDiff = require('diff');
const MongoClient = require('mongodb').MongoClient;

const config = require('../../config');
const documentUrl = 'https://apistaging.collaborate.center/swagger/v1/swagger.json';


const oldDiffDoc = require('./dev-swagger.json');
const newDiffDoc = require('./st-swagger.json');

exports.checkUpdates = async function (req, res) {
    let dbClient = null;
  
    try {
      const response = await axios.get(documentUrl);
      const newApiDocument = response.data;

      const client = new MongoClient(config.dbUri, { useNewUrlParser: true });
      await client.connect();
  
      dbClient = client;
      const documents = dbClient.db(config.dbName).collection('Documents');

      const [latestDocument] = await documents.find().sort({date:-1}).limit(1).toArray();
      const oldApiDocument = latestDocument && latestDocument.document;

      const diff = findDifference(oldApiDocument, newApiDocument);

      if (diff || !oldApiDocument) {
        const documentData = {
          url: documentUrl,
          document: newApiDocument,
          version: newApiDocument.info.version,
          diff,
          date: new Date(),
        };

        // const {insertedId} = await documents.insertOne(documentData);
        const insertedId = '6060';

        if (diff) {
          //await sendTelegramMessage(`New api update v${documentData.version} ${documentData.date.toString()}:\nhttps://ntk-core-datamanager.herokuapp.com/documents/${insertedId}`);
        }

        res.json({
          success: true,
          documentId: insertedId,
          diff
        });

        return;
      }

      res.json({
        success: true
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

function findDifference(oldDoc, newDoc) {
  if (!oldDoc) {
    return null;
  }

  return jsDiff.diffJson(oldDoc, newDoc);
}

async function sendTelegramMessage(text) {
  await axios({
    method: 'post',
    url: `https://api.telegram.org/bot${config.botToken}/sendMessage`,
    data: {
      chat_id: config.botChatId,
      text
    }
  });
}