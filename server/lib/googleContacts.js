/**
* @todo: recursively send requests until all contacts are fetched
*
* @see https://developers.google.com/google-apps/contacts/v3/reference#ContactsFeed
*
* To API test requests:
*
* @see https://developers.google.com/oauthplayground/
*
* To format JSON nicely:
*
* @see http://jsonviewer.stack.hu/
*
* Note: The Contacts API has a hard limit to the number of results it can return at a
* time even if you explicitly request all possible results. If the requested feed has
* more fields than can be returned in a single response, the API truncates the feed and adds
* a "Next" link that allows you to request the rest of the response.
*/
var EventEmitter = Npm.require('events').EventEmitter,
_ = Npm.require('underscore'),
qs = Npm.require('querystring'),
util = Npm.require('util'),
url = Npm.require('url'),
https = Npm.require('https'),
querystring = Npm.require('querystring');

GoogleContacts = function (opts) {
  if (typeof opts === 'string') {
    opts = { token: opts };
  }
  if (!opts) {
    opts = {};
  }

  this.contacts = [];
  this.consumerKey = opts.consumerKey ? opts.consumerKey : null;
  this.consumerSecret = opts.consumerSecret ? opts.consumerSecret : null;
  this.token = opts.token ? opts.token : null;
  this.refreshToken = opts.refreshToken ? opts.refreshToken : null;
};

GoogleContacts.prototype = {};

util.inherits(GoogleContacts, EventEmitter);


GoogleContacts.prototype._get = function (params, cb) {
  var self = this;

  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var req = {
    host: 'www.google.com',
    port: 443,
    path: this._buildPath(params),
    method: 'GET',
    headers: {
      'Authorization': 'OAuth ' + this.token,
      'GData-Version': '3.0'
    }
  };

  //console.log(req);

  https.request(req, function (res) {
    var data = '';

    res.on('end', function () {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        var error = new Error('Bad client request status: ' + res.statusCode);
        return cb(error);
      }
      try {
        data = JSON.parse(data);
        cb(null, data);
      }
      catch (err) {
        cb(err);
      }
    });

    res.on('data', function (chunk) {
      //console.log(chunk.toString());
      data += chunk;
    });

    res.on('error', function (err) {
      cb(err);
    });

    //res.on('close', onFinish);
  }).on('error', function (err) {
    cb(err);
  }).end();
};

GoogleContacts.prototype._getPhotoData = function (params, cb) {
  var self = this;

  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var req = {
    host: 'www.google.com',
    port: 443,
    path: this._buildPath(params),
    method: 'GET',
    headers: {
      'Authorization': 'OAuth ' + this.token,
      'GData-Version': '3.0'
    }
  };

  // console.log(req);

  https.request(req, function (res) {
    var data;
    var dataType = false;
    // var data = new Buffer();

    res.on('end', function () {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        var error = new Error('Bad client request status: ' + res.statusCode);
        return cb(error);
      }
      try {
        // console.log('end: ', data.length);
        cb(null, data);
      }
      catch (err) {
        cb(err);
      }
    });

    res.on('data', function (chunk) {
      // console.log(req.path, " : ", chunk.toString().length, ": ", chunk.length);
      if (dataType) {
        chunk_buffer = new Buffer(chunk, 'binary');
        // data += chunk;
        data = Buffer.concat([data, chunk_buffer]);
      } else {
        data = new Buffer(chunk, 'binary');
        dataType = true;
        // console.log('start: ');
      }
      // console.log('chunk: ', chunk.length);
    });

    res.on('error', function (err) {
      cb(err);
    });

    //res.on('close', onFinish);
  }).on('error', function (err) {
    cb(err);
  }).end();
};

GoogleContacts.prototype.getPhoto = function (path, cb) {
  var self = this;

  this._getPhotoData({path: path}, receivedPhotoData);
  function receivedPhotoData(err, data) {
    cb(err, data);
  }
};

GoogleContacts.prototype.getDetail = function (userId, cb) {
  var self = this;

  this._getDetailData({userId: userId}, receivedDetailData);
  function receivedDetailData(err, data) {
    cb(err, data);
  }
};

GoogleContacts.prototype._getDetailData = function (params, cb) {
  var self = this;

  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var url = '/m8/feeds/contacts/default/full/' + params.userId;

  var req = {
    host: 'www.google.com',
    port: 443,
    path: url,
    method: 'GET',
    headers: {
      'Authorization': 'OAuth ' + this.token,
      'GData-Version': '3.0'
    }
  };

  console.log(req);

  https.request(req, function (res) {
    var data;
    var dataType = false;
    // var data = new Buffer();

    res.on('end', function () {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        var error = new Error('Bad client request status: ' + res.statusCode);
        return cb(error);
      }
      try {
        // console.log('end: ', data.length);
        cb(null, data);
      }
      catch (err) {
        cb(err);
      }
    });

    res.on('data', function (chunk) {
      // console.log(req.path, " : ", chunk.toString().length, ": ", chunk.length);
      if (dataType) {
        chunk_buffer = new Buffer(chunk, 'binary');
        // data += chunk;
        data = Buffer.concat([data, chunk_buffer]);
      } else {
        data = new Buffer(chunk, 'binary');
        dataType = true;
        // console.log('start: ');
      }
      // console.log('chunk: ', chunk.length);
    });

    res.on('error', function (err) {
      cb(err);
    });

    //res.on('close', onFinish);
  }).on('error', function (err) {
    cb(err);
  }).end();
};

GoogleContacts.prototype.getContacts = function (cb, contacts) {
  var self = this;

  this._get({ type: 'contacts' }, receivedContacts);
  function receivedContacts(err, data) {
    if (err) return cb(err);

    self._saveContactsFromFeed(data.feed);

    var next = false;
    data.feed.link.forEach(function (link) {
      if (link.rel === 'next') {
        next = true;
        var path = url.parse(link.href).path;
        self._get({ path: path }, receivedContacts);
      }
    });
    if (!next) {
      cb(null, self.contacts);
    }
  }
};

_extractKind = function(rel) {
  if (rel)
  return rel.split('#')[1];
  else
  return 'unknown';
};

GoogleContacts.prototype._parseFeed = function (entry) {
  try {
    var contact = {};

    //console.log(entry);

    contact.uniqueGoogleId = entry.id.$t;
    contact.lastGoolgUpdate = entry.updated.$t;

    if (entry.gd$name &&
      (entry.gd$name.gd$familyName || entry.gd$name.gd$givenName || entry.gd$name.gd$fullName))
      {
        if (entry.gd$name.gd$familyName) {
          contact.familyName = entry.gd$name.gd$familyName.$t;
        }
        if (entry.gd$name.gd$givenName) {
          contact.givenName = entry.gd$name.gd$givenName.$t;
        }
        if (entry.gd$name.gd$fullName) {
          contact.fullName = entry.gd$name.gd$fullName.$t;
        }

      } else if (entry.title) {
        contact.fullName = entry.title.$t;
      }

      if (entry.content) {
        contact.company = entry.content.$t;
      }
      if (entry.gd$email) {
        contact.emails = _.map(entry.gd$email, function(element) {
          if (element.primary)
            contact.email = element.address;
          return { kind: _extractKind(element.rel) ,email: element.address };
        });
      }
      if (entry.gd$phoneNumber) {
        contact.phones = _.map(entry.gd$phoneNumber, function(element) {
          return  { kind: _extractKind(element.rel) , phone: element.$t };
        });
      }
      if (entry.gd$postalAddress) {
        contact.addresses = _.map(entry.gd$postalAddress, function(element) {
          return  { kind: _extractKind(element.rel) , address: element.$t };
        });
      }
      if (entry.link) {
        entry.link.some(function(link) {
          if ((link.rel) && (link.rel.indexOf('#photo') !== -1) &&
          (link.type.indexOf('image') !== -1)){
            contact.photoUrl = link.href;
            contact.mimeType = link.type;
          }});
        }

        //console.log(contact);

        return contact;
      } catch (e) {
        console.log(e);
      }
    };

    GoogleContacts.prototype._saveContactsFromFeed = function (feed) {
      var self = this;
      //console.log(feed);
      var i = 0;
      self.contacts = _.map(feed.entry,this._parseFeed);
    };

    GoogleContacts.prototype._buildPath = function (params) {
      if (params.path) return params.path;

      params = params || {};
      params.type = params.type || 'contacts';
      params.alt = params.alt || 'json';
      params.projection = params.projection || 'thin';
      params.email = params.email || 'default';
      params['max-results'] = params['max-results'] || 2000;

      var query = {
        alt: params.alt,
        'max-results': params['max-results']
        //,
        //q: 'Alexandre'
      };

      var path = '/m8/feeds/';
      path += params.type + '/';
      path += params.email + '/';
      path += params.projection;
      path += '?' + qs.stringify(query);

      return path;
    };

    GoogleContacts.prototype.refreshAccessToken = function (refreshToken, cb) {
      if (typeof params === 'function') {
        cb = params;
        params = {};
      }

      var data = {
        refresh_token: refreshToken,
        client_id: this.consumerKey,
        client_secret: this.consumerSecret,
        grant_type: 'refresh_token'

      };

      var body = qs.stringify(data);

      var opts = {
        host: 'accounts.google.com',
        port: 443,
        path: '/o/oauth2/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': body.length
        }
      };

      //console.log(opts);
      //console.log(data);

      var req = https.request(opts, function (res) {
        var data = '';
        res.on('end', function () {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            var error = new Error('Bad client request status: ' + res.statusCode);
            return cb(error);
          }
          try {
            data = JSON.parse(data);
            //console.log(data);
            cb(null, data.access_token);
          }
          catch (err) {
            cb(err);
          }
        });

        res.on('data', function (chunk) {
          //console.log(chunk.toString());
          data += chunk;
        });

        res.on('error', function (err) {
          cb(err);
        });

        //res.on('close', onFinish);
      }).on('error', function (err) {
        cb(err);
      });

      req.write(body);
      req.end();
    };

    /*
    { id: { '$t': 'http://www.google.com/m8/feeds/contacts/alexandre.fau%40gmail.com/base/3635559a8fcd9fde' },
    'gd$etag': '"SHY4ejVSLit7I2A9XRdbEUkKQgM."',
    updated: { '$t': '2014-12-09T15:56:19.832Z' },
    'app$edited':
    { 'xmlns$app': 'http://www.w3.org/2007/app',
    '$t': '2014-12-09T15:56:19.832Z' },
    category:
    [ { scheme: 'http://schemas.google.com/g/2005#kind',
    term: 'http://schemas.google.com/contact/2008#contact' } ],
    title: { '$t': 'Alexandre Fau' },
    content: { '$t': 'FAU' },
    link:
    [ { rel: 'http://schemas.google.com/contacts/2008/rel#photo',
    type: 'image/*',
    href: 'https://www.google.com/m8/feeds/photos/media/alexandre.fau%40gmail.com/3635559a8fcd9fde',
    'gd$etag': '"TRRTJ1oeWit7I2BrOmEueRpTHlg7f0R_Ny8."' },
    { rel: 'self',
    type: 'application/atom+xml',
    href: 'https://www.google.com/m8/feeds/contacts/alexandre.fau%40gmail.com/thin/3635559a8fcd9fde' },
    { rel: 'edit',
    type: 'application/atom+xml',
    href: 'https://www.google.com/m8/feeds/contacts/alexandre.fau%40gmail.com/thin/3635559a8fcd9fde' } ],
    'gd$name':
    { 'gd$fullName': { '$t': 'Alexandre Fau' },
    'gd$givenName': { '$t': 'Alexandre' },
    'gd$familyName': { '$t': 'Fau' } },
    'gContact$birthday': { when: '1972-10-02' },
    'gd$organization':
    [ { rel: 'http://schemas.google.com/g/2005#other',
    'gd$orgName': [Object] } ],
    'gd$email':
    [ { address: 'alexandre.fau@gmail.com',
    primary: 'true',
    rel: 'http://schemas.google.com/g/2005#home' },
    { address: 'afau@smartadserver.com',
    rel: 'http://schemas.google.com/g/2005#work' },
    { address: 'thecoachfr@me.com',
    rel: 'http://schemas.google.com/g/2005#other' },
    { address: 'fau_alexandre@hotmail.com',
    rel: 'http://schemas.google.com/g/2005#other' },
    { address: 'alexandre.fau_43@kindle.com',
    rel: 'http://schemas.google.com/g/2005#other' },
    { address: 'alexandre.fau@facebook.com',
    rel: 'http://schemas.google.com/g/2005#other' } ],
    'gd$im':
    [ { address: 'fau_alexandre@hotmail.com',
    protocol: 'http://schemas.google.com/g/2005#MSN',
    rel: 'http://schemas.google.com/g/2005#work' },
    { address: 'alexandre.fau',
    protocol: 'http://schemas.google.com/g/2005#facebook',
    rel: 'http://schemas.google.com/g/2005#other' },
    { address: 'the_coach_fr@hotmail.com',
    protocol: 'http://schemas.google.com/g/2005#MSN',
    rel: 'http://schemas.google.com/g/2005#home' } ],
    'gd$phoneNumber':
    07.000(1)?    [ { rel: 'http://schemas.google.com/g/2005#mobile',
    07.000(1)?        uri: 'tel:+33-6-78-09-01-65',
    07.001(1)?        '$t': '+33 6 78 09 01 65' },
    07.001(1)?      { rel: 'http://schemas.google.com/g/2005#home',
    07.002(1)?        uri: 'tel:+33-9-51-77-97-60',
    07.002(1)?        '$t': '+33 9 51 77 97 60' } ],
    07.003(1)?   'gd$structuredPostalAddress':
    07.003(1)?    [ { rel: 'http://schemas.google.com/g/2005#work',
    07.004(1)?        'gd$formattedAddress': [Object],
    07.004(1)?        'gd$street': [Object],
    07.005(1)?        'gd$city': [Object],
    07.0        'gd$postcode': [Object],
    07.0        'gd$country': [Object] },
    07.007(1)?      { rel: 'http://schemas.google.com/g/2005#home',
    07.007(1)?        'gd$formattedAddress': [Object],
    07.008(1)?        'gd$street': [Object],
    07.008(1)?        'gd$city': [Object],
    07.009(1)?        'gd$region': [Object],
    07.009(1)?        'gd$postcode': [Object],
    07.010(1)?        'gd$country': [Object] } ],
    07.011(1)?   'gContact$relation':
    07.011(1)?    [ { '$t': 'Christian Fau', rel: 'father' },
    07.012(1)?      { '$t': 'Josette Fau', rel: 'mother' },
    07.012(1)?      { '$t': 'Olivier Fau', rel: 'brother' },
    07.013(1)?      { '$t': 'Sylvie Fau', rel: 'sister' } ],
    07.013(1)?   'gContact$userDefinedField':
    07.014(1)?    [ { key: 'gamecenter', value: 'thecoachfr' },
    07.015(1)?      { key: 'Facebook', value: 'alexandre.fau' },
    07.015(1)?      { key: 'Twitter', value: 'TheCoachFr' } ],
    07.016(1)?   'gContact$website':
    07.017(1)?    [ { href: 'https://www.facebook.com/alexandre.fau',
    07.017(1)?        label: 'Facebook' } ],
    07.018(1)?   'gContact$groupMembershipInfo':
    07.018(1)?    [ { deleted: 'false',
    07.019(1)?        href: 'http://www.google.com/m8/feeds/groups/alexandre.fau%40gmail.com/base/62d6c3908b4c4350' },
    07.020(1)?      { deleted: 'false',
    07.020(1)?        href: 'http://www.google.com/m8/feeds/groups/alexandre.fau%40gmail.com/base/bfa6d168f263b96' },
    07.021(1)?      { deleted: 'false',
    07.022(1)?        href: 'http://www.google.com/m8/feeds/groups/alexandre.fau%40gmail.com/base/3695c4498ca7aa20' },
    07.022(1)?      { deleted: 'false',
    07.023(1)?        href: 'http://www.google.com/m8/feeds/groups/alexandre.fau%40gmail.com/base/6' } ] }

    */
