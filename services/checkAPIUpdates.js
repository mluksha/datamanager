const axios = require('axios');
const config = require('../config');

function checkAPIUpdates(){
  axios.get(`${config.host}/api/documents/checkUpdates`)
  .catch(error => console.error(error.message));
}

checkAPIUpdates();