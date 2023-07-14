const Validator = require("validator");
const dns = require('dns');
var validUrl = require('valid-url');
var checkUrl = require('url');

const { check_mx } = require('../helpers/check_mx');

module.exports = {
  check_mail_get: async (req, res, next) => {
    const { email } = req.query;

    if (!Validator.isEmail(email)) {
      return res.status(400).json({
       "data": {
         "email": email,
         "status": false,
         "detail": "The mail address if malformed"
       }
      });
    }

    const domain = email.split('@')[1];

    dns.resolve(domain, 'MX', function(err, addresses) {
      if (err) {
          return res.status(400).json({
            "data": {
              "email": email,
              "status": false,
              "detail": "No mx for this mail address"
            }
          });
      } else if (addresses && addresses.length > 0) {      
          res.status(200).json({"data": {
           "email": email,
           "status": true
          }})
      } else {
        return res.status(400).json({
          "data": {
            "email": email,
            "status": false,
            "detail": "No mx for this mail address"
          }
        });
      }
    })
  },

  check_mail_post: async (req, res, next) => {
    const { emails } = req.body;
    const result = [];
// console.log(emails)
    for (var i = emails.length - 1; i >= 0; i--) {
      if (!Validator.isEmail(emails[i])) {
        result.push({
          "email": emails[i],
          "status": false,
          "detail": "The mail address if malformed"
        })
      } else {
        let data = await check_mx(emails[i])
        result.push(data);
      }
    }

    res.json({data: result})
  },

  check_url: async (req, res, next) => {
    const { url } = req.query;
    var domain = checkUrl.parse(url).hostname;

    dns.resolve(domain, 'MX', function(err, addresses) {
      if (err) {
          return res.status(400).json({
            "data": {
              "url": url,
              "status": false,
              "detail": "Could not resolve domain for this address"
            }
          });
      } else {
        res.status(200).json({"data": {
          "url": url,
          "status": true
        }})
      }
    })
  },
}
