Meteor.publish('factures', function() { 
    return Factures.find();
});

Meteor.publish('lines', function() { 
    return Lines.find();
});

Meteor.publish('coffeeUsers', function() { 
    return CoffeeUsers.find();
});