const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID

const config = require('../config');

const diff = [
  {
      "count": 1,
      "removed": true,
      "value": "              \"11: ConcatenatedVideo\",\n"
  },
  {
      "count": 1,
      "added": true,
      "value": "              \"11: ConcatenatedVideo\",\n"
  }
];


exports.getDocument = async function(req, res) {
  const id = req.params.id;
  let dbClient = null;
  let document = null;
  
  try {
    const client = new MongoClient(config.dbUri, { useNewUrlParser: true });
    await client.connect();
    dbClient = client;

    const documents = dbClient.db(config.dbName).collection('Documents');
    document = await documents.findOne(ObjectId(id));

    // todo: remove this
    document.diff = diff;
  } catch (error) {
    console.error(error);
  } finally {
    dbClient && await dbClient.close();
  }

  res.render('document', { title: 'Document', document});
};