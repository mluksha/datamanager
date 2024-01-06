const axios = require('axios');
const config = require('../config');

function cleanOutdated(){
  axios.get(`${config.host}/api/documents/cleanOutdated`)
  .catch(error => console.error(error.message));
}

cleanOutdated();