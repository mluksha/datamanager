const MongoClient = require('mongodb').MongoClient;

exports.cleanOutdated = async function (req, res) {
  let dbClient = null;
  try {
    const client = new MongoClient(`mongodb+srv://${process.env.USER}:${encodeURIComponent(process.env.PASSWORD)}@cluster0.rnxp1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true });
    await client.connect();

    dbClient = client;
    const documents = dbClient.db(process.env.DB_NAME).collection('Documents');
    documentsCount = await documents.countDocuments();

    if (documentsCount > 50) {
      const latestDocuments = await documents.find().sort({date:-1}).limit(51).toArray();

      const lastFromLatestDocument = latestDocuments[latestDocuments.length - 1];

      await documents.deleteMany({date: {$lte:lastFromLatestDocument.date}});
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