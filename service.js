const axios = require('axios');

function runService(){
  axios.get('https://ntk-core-datamanager.herokuapp.com/api/documents/checkUpdates')
  .catch(error => console.error(error.message));
}

runService();