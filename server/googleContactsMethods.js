
btoa = function(encoded) {
  return new Buffer(encoded || '', 'base64').toString('base64');
};

// prod :
//consumerKey: "1053376773009-av1i91ugqgogqqsell7qeoh97dd9dufk.apps.googleusercontent.com",
//consumerSecret: "NSzEYj2Zv3G_tYeTrMB-WSDY",
// dev
//  1053376773009-87j3c6ap03k5kqr0ndt9p6epirl6lnr9.apps.googleusercontent.com
// G9ltYzBhiFrLytzqCfrIWcmk

var consumerKey = "1053376773009-87j3c6ap03k5kqr0ndt9p6epirl6lnr9.apps.googleusercontent.com";
var consumerSecret = "G9ltYzBhiFrLytzqCfrIWcmk";

getContacts = function() {
  if (inProduction()) {
    logInfo("Running in Prod");
    consumerKey ="1053376773009-av1i91ugqgogqqsell7qeoh97dd9dufk.apps.googleusercontent.com";
    consumerSecret = "NSzEYj2Zv3G_tYeTrMB-WSDY";
  } else {
    logInfo("Running in Dev");
    consumerKey = "1053376773009-87j3c6ap03k5kqr0ndt9p6epirl6lnr9.apps.googleusercontent.com";
    consumerSecret = "G9ltYzBhiFrLytzqCfrIWcmk";
  }

  var opts= {
    email: Meteor.user().services.google.email,
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    token: Meteor.user().services.google.accessToken,
    refreshToken: Meteor.user().services.google.refreshToken
  };

  gcontacts = new GoogleContacts(opts);

  return gcontacts;
};

validateAndAddGContact = function(user, email) {
  if (email.indexOf('smartadserver.com') != -1 ||
  email.indexOf('aufeminin.com') != -1) {
    if (!GContacts.findOne({ uniqueGoogleId: user.uniqueGoogleId})) {
      GContacts.insert(user);
      logInfo("add " + user.fullName + " with email " + email);
      return true;
    }
  }
  return false;
};

Meteor.methods({
  readContacts : function() {
    var gcontacts = getContacts();

    insertContacts = function(err, contacts) {
      if (err) {
        logError(err);
      }

      var added = 0;

      contacts.forEach(function (user) {

        if (user.email) {
          if (validateAndAddGContact(user, user.email))
          added++;
        } else {
          // no main email
          logInfo("reject " + user.fullName);
          if (user.emails) {
            user.emails.forEach(function (email) {
              logInfo(" - scaning " + email.email);
              if (validateAndAddGContact(user, email.email))
              added++;
            });
          }
        }
      });

      logInfo('reading ' + contacts.length + ' contacts, ' + added + ' added.');
    };

    localLogError = function(e) {
      logError("error " + e.stack);
    };

    mbINsertContacts = Meteor.bindEnvironment(insertContacts, localLogError);

    mbLogError = Meteor.bindEnvironment(function(msg) {
      logError('gcontact.refreshToken, ' + msg);
    }, localLogError);

    mbLogMessage = Meteor.bindEnvironment(function(msg) {
      logInfo(msg);
    }, localLogError);

    logInfo('before gContacts refreshaccess token');

    try {
      var res = gcontacts.refreshAccessToken(Meteor.user().services.google.refreshToken, function (err, accessToken)
      {
        if(err)
        {
          //console.log('gcontact.refreshToken, ' + err);
          fnError(err);
          return false;
        }
        else
        {
          fnMessage('gcontact.access token success!');
          //logInfo('gcontact.access token success!');

          gcontacts.token = accessToken;
          gcontacts.getContacts(fn);
        }
      });
      if (!res) {
        logError('Something goes wrong');
      }
    } catch(err) {
      logError(err);
    }
  },
  readPhoto: function(id) {
    var gcontacts = getContacts();
    var user = GContacts.findOne({ _id: id });

    fn = Meteor.bindEnvironment(function (err, res) {
      if (!err) {
        user.dataImg = "data:image/png;base64," + btoa(res);
        GContacts.update(user._id, {$set: {dataImg: user.dataImg} }, function(err) {
          if (err)
          logError('error  ' + user.name + ' ' + err);
        });
      } else {
        logError('error  ' + user.name + ' ' + err);
      }
    },
    function(e) {
      logError("error ", e.stack);
    });

    gcontacts.refreshAccessToken(Meteor.user().services.google.refreshToken, function (err, accessToken)
    {
      if(err)
      {
        logError('gcontact.refreshToken, ', err);
        return false;
      }
      else
      {
        gcontacts.token = accessToken;
        gcontacts.getPhoto(user.photoUrl, fn);
      }
    });
  },
  getDetail: function(id) {
    var gcontacts = getContacts();

    fn = Meteor.bindEnvironment(function (err, res) {
      if (!err) {
        logInfo('Details : ' + res);
      } else {
        logError('error  ' + err);
      }
    },
    function(e) {
      logError("error ", e.stack);
    });

    gcontacts.refreshAccessToken(Meteor.user().services.google.refreshToken, function (err, accessToken)
    {
      if(err)
      {
        logError('gcontact.refreshToken, ', err);
        return false;
      }
      else
      {
        //console.log ('gcontact.access token success!');
        gcontacts.token = accessToken;
        gcontacts.getDetail('3635559a8fcd9fde', fn);
      }
    });
  },
  clearLogs: function() {
    Logs.remove({});
  }
});
