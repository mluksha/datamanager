const axios = require('axios');

function cleanOutdated(){
  axios.get('https://ntk-core-datamanager.herokuapp.com/api/documents/cleanOutdated')
  .catch(error => console.error(error.message));
}

cleanOutdated();