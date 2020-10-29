const axios = require('axios');

exports.getDocument = function(req, res) {
  axios.get('https://apistaging.collaborate.center/swagger/v1/swagger.json')
  .then(response => {
    console.log(response.data);
    
    res.json({ 
      success: true,
      document: response.data
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