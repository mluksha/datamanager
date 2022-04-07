const axios = require('axios');

function checkAPIUpdates(){
  axios.get('https://ntk-core-datamanager.herokuapp.com/api/documents/checkUpdates')
  .catch(error => console.error(error.message));
}

checkAPIUpdates();