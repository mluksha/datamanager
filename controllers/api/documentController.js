const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const config = require('../../dal/config');
const documentUrl = 'https://apistaging.collaborate.center/swagger/v1/swagger.json';

exports.getDocument = function(req, res) {
  axios.get(documentUrl)
  .then(response => {
    console.log(response.data);

    const client = new MongoClient(config.uri, { useNewUrlParser: true });
    client.connect(err => {
      if (err) {
        res.json({ 
          success: false,
          error: `Connection error: ${errerr.message}`
        });

        return;
      }

      const collection = client.db(config.dbName).collection("Documents");

      collection.insertOne({
        url: documentUrl,
        document: response.data,
        version: response.data.info.version,
        date: new Date()
      }, function(err, result) {
        client.close();

        if (err) {
          res.json({ 
            success: false,
            error: `DB error: ${err.message}`
          });

          return;
        }

        res.json({ 
          success: true,
          updates: []
        });
      });      
    });
  })
  .catch(error => {
    res.json({ 
      success: false,
      error: `API error: ${error.message}`
    });
  });
};