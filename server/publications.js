Meteor.publish('factures', function() {
    return Factures.find();
});

Meteor.publish('lines', function() {
    return Lines.find();
});

Meteor.publish('coffeeUsers', function() {
    return CoffeeUsers.find();
});

Meteor.publish('settings', function() {
    return Settings.find();
});

Meteor.publish('googleContacts', function() {
  return GContacts.find();
});

Meteor.publish('logs', function() {
  return Logs.find();
});


Meteor.publish(null, function (){
  return Meteor.roles.find({});
});
