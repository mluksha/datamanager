const axios = require('axios');
const jsDiff = require('diff');
const MongoClient = require('mongodb').MongoClient;

const config = require('../../../config')

const documentUrl = 'https://apistaging.collaborate.center/swagger/v1/swagger.json';

exports.checkUpdates = async function (req, res) {
    let dbClient = null;
    try {
      const response = await axios.get(documentUrl);
      const newApiDocument = response.data;

      const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();

      dbClient = client;
      const documents = dbClient.db(config.mongoDbName).collection('Documents');

      const [latestDocument] = await documents.find().sort({date:-1}).limit(1).toArray();
      const oldApiDocument = latestDocument && latestDocument.document;
      const diff = findDifference(oldApiDocument, newApiDocument);
      const withUpdates = diff && diff.length > 0;

      if (withUpdates || !oldApiDocument) {
        const documentData = {
          url: documentUrl,
          document: newApiDocument,
          version: newApiDocument.info.version,
          diff,
          date: new Date(),
        };

        const {insertedId} = await documents.insertOne(documentData);

        if (withUpdates) {
          await sendMessage(`New api update v${documentData.version} ${documentData.date.toString()}:\n${config.host}/documents/${insertedId}`);
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

function getMessage(data) {
  return JSON.stringify(data, (key, value) =>{
    if (key === 'enum' || key === 'description') {
      return undefined;
    }

    return value;
  }, ' ');
}

function findDifference(oldDoc, newDoc) {
  if (!oldDoc) {
    return null;
  }

  let diffArra = jsDiff.createPatch('', getMessage(oldDoc), getMessage(newDoc))
    .split('\n')
    .filter(x => x)
    .map(line => {
      const [firstCharacter] = line;
      return {
        value: line,
        added: firstCharacter === '+',
        removed: firstCharacter === '-',
        info: firstCharacter === '@'
      };
    });
  diffArra.splice(0,4);

  return diffArra;
}

async function sendMessage(text) {

  // Send slack message
  await axios({
    method: 'post',
    url: `https://slack.com/api/chat.postMessage`,
    data: {
      channel: config.slackChanelId,
      text,
    },
    headers: {
      "Authorization": `Bearer ${config.slackToken}`,
      "content-type": "application/json; charset=utf-8"
    }
  });
}