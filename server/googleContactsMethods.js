
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
  readContacts: function() {
    var gcontacts = getContacts();
    Future = Npm.require('fibers/future');

    var future = new Future(); // 1

    gcontacts.refreshAccessToken(Meteor.user().services.google.refreshToken,
    function (err, accessToken) { //2
      future["return"]({err: err, accessToken: accessToken}); // 4
    });

    var result = future.wait(); // 3, 5
    if (result.err && result.err !== null) { // 6
      logError('gcontact.refreshToken, ', result.err);
      return false;
    } else {
      logInfo('gcontact.access token success!');
      gcontacts.token = result.accessToken;

      var future2 = new Future(); // 1
      gcontacts.getContacts( function (err, contacts) { //2
        future2["return"]({err: err, contacts: contacts}); // 4
      });

      var result2 = future2.wait(); // 3, 5
      if (result2.err && result2.err !== null) { // 6
        logError('gcontact.refreshToken, ', result2.err);
        return false;
      } else {
        logInfo('Contacts OK');
        var added = 0;
        result2.contacts.forEach(function (user) {
          if (user.email) {
            if (validateAndAddGContact(user, user.email)) {
              added++;
            }
          } else {
            //logInfo("reject " + user.fullName);
            if (user.emails) {
              user.emails.forEach(function (email) {
                // logInfo(" - scaning " + email.email);
                if (validateAndAddGContact(user, email.email)) {
                  added++;
                }
              });
            }
          }
        });
        logInfo('reading ' + result2.contacts.length + ' contacts, ' + added + ' added.');
        return true;
      }
    }
  },
  readPhoto: function(id) {
    var gcontacts = getContacts();
    var user = GContacts.findOne({ _id: id });

    var future = new Future(); // 1

    gcontacts.refreshAccessToken(Meteor.user().services.google.refreshToken,
    function (err, accessToken) { //2
      future["return"]({err: err, accessToken: accessToken}); // 4
    });

    var result = future.wait(); // 3, 5
    if (result.err && result.err !== null) { // 6
      logError('gcontact.refreshToken, ', result.err);
      return false;
    } else {
      logInfo('gcontact.access token success!');
      gcontacts.token = result.accessToken;

      var future2 = new Future(); // 1
      gcontacts.getPhoto(user.photoUrl, function (err, res) { //2
        future2["return"]({err: err, photo: res}); // 4
      });

      var result2 = future2.wait(); // 3, 5
      if (result2.err && result2.err !== null) { // 6
        logError('gcontact.refreshToken, ', result2.err);
        return false;
      } else {
        logInfo('Photo OK ');
        user.dataImg = "data:image/png;base64," + btoa(result2.photo);
        GContacts.update(user._id, {$set: {dataImg: user.dataImg} }, function(err) {
          if (err)
          logError('error  ' + user.name + ' ' + err);
        });
      }
    }
  },
        /*
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
  },*/
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
