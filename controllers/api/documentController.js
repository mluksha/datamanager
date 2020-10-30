const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const config = require('../../dal/config');
const documentUrl = 'https://apistaging.collaborate.center/swagger/v1/swagger.json';

exports.getDocument = async function (req, res) {
    let dbClient = null;
  
    try {
      const response = await axios.get(documentUrl);

      const client = new MongoClient(config.uri, { useNewUrlParser: true });
      await client.connect();
  
      dbClient = client;
      const documents = dbClient.db(config.dbName).collection('Documents');
  
      const resultDoc = await documents.insertOne({
        url: documentUrl,
        document: response.data,
        version: response.data.info.version,
        date: new Date(),
      });

      res.json({
        success: true,
        updates: [],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    } finally {
      dbClient && dbClient.close();
    }
};
