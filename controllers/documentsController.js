const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID

const config = require('../../../config')

exports.getDocument = async function(req, res) {
  const id = req.params.id;
  let dbClient = null;
  let document = null;
  
  try {
    const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true });
    await client.connect();
    dbClient = client;

    const documents = dbClient.db(process.env.DB_NAME).collection('Documents');
    document = await documents.findOne(ObjectId(id));

  } catch (error) {
    console.error(error);
  } finally {
    dbClient && await dbClient.close();
  }

  res.render('document', { title: 'Document', document});
};