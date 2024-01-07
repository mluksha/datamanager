const axios = require('axios');
const jsDiff = require('diff');
const MongoClient = require('mongodb').MongoClient;
const {generateApi} = require('swagger-typescript-api');
const path = require("path");
const fs = require("fs");

const config = require('../../../config')

// tenant documentUrl: https%3A%2F%2Fapi-dev.collaborate.center%2Fstaging%2Ftenant-service%2Fswagger%2Fv1%2Fswagger.json

exports.checkUpdates = async function (req, res) {
    let dbClient = null;
    try {
      const documentUrl = req.query.documentUrl;

      if (!documentUrl) {
        res.status(400).json({
          success: false,
          error: 'documentUrl is required',
        });

        return;
      }

      const filePath = await saveSwaggerToFile(documentUrl);
      const newApiDocument = await getTypeScriptDocument(filePath);
      await removeFile(filePath);

      const client = new MongoClient(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();

      dbClient = client;
      const documents = dbClient.db(config.mongoDbName).collection('Documents');

      const [latestDocument] = await documents.find({ url: documentUrl }, { projection: { _id: 1, document: 1 } }).sort({date:-1}).limit(1).toArray();
      const oldApiDocument = latestDocument && latestDocument.document;
      const diff = findDifference(oldApiDocument, newApiDocument);
      const withUpdates = diff && diff.length > 0;

      if (withUpdates || !oldApiDocument) {
        const documentData = {
          url: documentUrl,
          document: newApiDocument,
          version: 'v1',
          diff,
          previousDocumentId: latestDocument?._id.toString() ?? null,
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

function findDifference(oldDoc, newDoc) {
  if (!oldDoc) {
    return null;
  }

  const data = jsDiff.createPatch('', oldDoc, newDoc);
  const diffArra = data.split('\n').filter(x => x);
  diffArra.splice(0,4);

  return diffArra;
}

async function sendMessage(text) {
  console.log('Message: ' + text);

  // Send slack message
  /*
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
  */
}

async function getTypeScriptDocument(filePath) {
  try {
    const {files} = await generateApi({
      name: "MySuperbApi.ts",
      output: false,
      input: filePath,
      prettier: {
        printWidth: 120,
        tabWidth: 2,
        trailingComma: "all",
        parser: "typescript",
      },
      sortTypes: true,
      sortRoutes: true
    });

    const data ='\n T3est \n' + (files.map( x => x.fileContent).join(''));
  
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Can't get TypeScript document");
  }
}

async function saveSwaggerToFile(url) {
  try {
    const response = await axios.get(url);
    const swaggerDocument = JSON.stringify(response.data);
    const dirPath = './tmp';
    const fileName = `swagger-${Math.random()}.json`;

    if (!fs.existsSync(dirPath)){
      await fs.promises.mkdir(dirPath);
    }

    const filePath = path.resolve(process.cwd(), `${dirPath}/${fileName}`);
    await fs.promises.writeFile(filePath, swaggerDocument);

    return filePath;
  } catch (error) {
    console.error(error);
    throw new Error("Can't save Swagger file");
  }
}

async function removeFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.log('Can not remove file');
  }
}
