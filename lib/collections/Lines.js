Lines = new Mongo.Collection('lines');

Lines.helpers({
	coffeeUser: function() {
		return CoffeeUsers.findOne({ _id: this.coffeeUserId});		
	},
	bill:function() {
		return Factures.findOne({ _id: this.factureId});		
	},
});

Lines.allow({
	update: function(userId, post) { return isAdmin(userId); }, 
	remove: function(userId, post) { return isAdmin(userId); },
	insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !! userId && isAdmin(userId); }
    }
);