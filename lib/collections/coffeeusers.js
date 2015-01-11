CoffeeUsers = new Mongo.Collection('coffeeUsers');

Meteor.methods({
    userInsert: function(userAttributes) {
        check(Meteor.userId(), String);
        
        var errors = validateUser(userAttributes); 
        if (errors.name || errors.email || errors.amount)
            throw new Meteor.Error('invalid-user', "You must set a name, an email and an amount for your user");
        
        var userWithSameName = CoffeeUsers.findOne({name: userAttributes.name});
        if (userWithSameName) {
            return {
                factureExists: true,
                _id: userWithSameName._id
            }
        }
        
        var user = Meteor.user();
        var coffeeUser = _.extend(userAttributes, {
            userId: user._id, 
            author: user.username, 
            submitted: new Date()
        });
        var coffeeUserId = CoffeeUsers.insert(coffeeUser);
        
        return {
            _id: coffeeUserId
        }; 
    }
});

validateUser = function (coffeeUser) { 
    var errors = {};
    if (!coffeeUser.name)
        errors.name = "Please fill in a name";
     if (!coffeeUser.email)
        errors.email = "Please fill in an email";
    if (!coffeeUser.amount)
        errors.amount = "Please fill in an amount";
    return errors; 
}

CoffeeUsers.allow({
    update: function(userId, post) { return isAdmin(userId); }, 
    remove: function(userId, post) { return isAdmin(userId); },
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !! userId && isAdmin(userId); }
});

CoffeeUsers.deny({
    update: function(userId, post, fieldNames, modifier) {
        var errors = validateUser(modifier.$set);
        return errors.name || errors.email || errors.amount; 
    }
});