const axios = require('axios');

function runService(){
  axios.get('https://ntk-core-datamanager.herokuapp.com/api/document')
  .catch(error => console.log(error.message));
}

runService();