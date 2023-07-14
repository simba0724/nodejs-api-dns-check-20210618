const dns = require('dns');

exports.check_mx = async (email) => {
  let promise = new Promise((resolve, reject) => {
    const domain = email.split('@')[1];

    dns.resolve(domain, 'MX', function(err, addresses) {
      if (err) {
        resolve({
          "email": email,
          "status": false,
          "detail": "No mx for this mail address"
        })
      } else if (addresses && addresses.length > 0) {      
          resolve({
           "email": email,
           "status": true
          });
      } else {
          resolve({
            "email": email,
            "status": false,
            "detail": "No mx for this mail address"
          })
      }
    })
  })

  return promise;
}