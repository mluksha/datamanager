const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const user = 'serveradmin';
const password = 'Data#1nikita';
const dbName = 'dm-staging';
const uri = `mongodb+srv://${user}:${encodeURIComponent(password)}@cluster0.rnxp1.mongodb.net/${dbName}?retryWrites=true&w=majority`;


exports.getDocument = function(req, res) {
  axios.get('https://apistaging.collaborate.center/swagger/v1/swagger.json')
  .then(response => {
    console.log(response.data);

    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      if (err) {
        console.log("Connection error");
        console.log(err.message);
        res.json({ 
          success: false,
          error: err.message
        });

        return;
      }

      const collection = client.db(dbName).collection("Documents");

      collection.insertOne({
        url: 'https://apistaging.collaborate.center',
        document: response.data,
        version: "0.0",
        date: new Date()
      }, function(err, result) {
        client.close();

        if (err) {
          console.log("Not inserted");
          console.log(err.message);
          res.json({ 
            success: false,
            error: err.message
          });

          return;
        }

        console.log("Inserted 1 document into the collection");
        console.log(response.data);

        res.json({ 
          success: true,
          document: response.data
        });
      });      
    });
  })
  .catch(error => {
    console.log(error);
    res.json({ 
      success: false,
      error: error.message
    });
  });
};