const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const config = require('../../dal/config');
const documentUrl = 'https://apistaging.collaborate.center/swagger/v1/swagger.json';



exports.getDocument = async function (req, res) {
    let dbClient = null;
  
    try {
      const response = await axios.get(documentUrl);
      const newApiDocument = response.data;

      const client = new MongoClient(config.uri, { useNewUrlParser: true });
      await client.connect();
  
      dbClient = client;
      const documents = dbClient.db(config.dbName).collection('Documents');

      const [latestDocument] = await documents.find().sort({date:-1}).limit(1).toArray();
      const oldApiDocument = latestDocument && latestDocument.document;

      const updates = findDifference(newApiDocument, oldApiDocument);

      if (updates) {
        const resultDoc = await documents.insertOne({
          url: documentUrl,
          document: newApiDocument,
          version: newApiDocument.info.version,
          date: new Date(),
        });
      }

      res.json({
        success: true,
        updates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    } finally {
      dbClient && await dbClient.close();
    }
};


function findDifference(newDoc, oldDoc) {
  const newApiList = Object.getOwnPropertyNames(newDoc.paths);
  
  if (!oldDoc) {
    return {
      added: newApiList,
      removed: []
    }
  }

  const oldApiList = Object.getOwnPropertyNames(oldDoc.paths);

  const added = newApiList.filter(x => !oldApiList.includes(x));
  const removed = oldApiList.filter(x => !newApiList.includes(x));

  if (added.length === 0 && removed.length === 0) {
    return null;
  }

  return {
    added,
    removed
  }
}