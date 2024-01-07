const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID

const config = require('../config')

exports.getAll = async function(req, res) {
  let dbClient = null;
  let list = [];

  try {
    const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    dbClient = client;

    const documents = dbClient.db(config.mongoDbNameE).collection('Documents');
    list = await documents.find({}, { projection: { _id: 1, url: 1, date: 1 }}).sort({ date: -1 }).toArray();
  } catch (error) {
    console.error(error);
  } finally {
    dbClient && await dbClient.close();
  }

  res.render('documentList', { title: 'Documents', list});
};

exports.getDocument = async function(req, res) {
  const id = req.params.id;
  let dbClient = null;
  let document = null;
  
  try {
    const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    dbClient = client;

    const documents = dbClient.db(config.mongoDbNameE).collection('Documents');
    document = await documents.findOne(ObjectId(id), { projection: { document: 0 }});
  } catch (error) {
    console.error(error);
  } finally {
    dbClient && await dbClient.close();
  }

  res.render('document', { title: id, documentId: id, document});
};

exports.documentTypeScript = async function(req, res) {
  const id = req.params.id;
  let dbClient = null;
  let document = null;
  
  try {
    const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    dbClient = client;

    const documents = dbClient.db(config.mongoDbNameE).collection('Documents');
    document = await documents.findOne(ObjectId(id), { projection: { diff: 0 }});
  } catch (error) {
    console.error(error);
  } finally {
    dbClient && await dbClient.close();
  }

  res.render('documentTypeScript', { title: id, documentId: id, document});
};