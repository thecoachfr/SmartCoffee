Settings = new Mongo.Collection("settings");

Settings.helpers({
	lastEntry: function() {
		return Settings.findOne();
	}
});

Settings.before.update(function (userId, doc) {
	doc.timestamp = new Date();
});

Settings.attachSchema(new SimpleSchema({
	coffeePrice: {
		type: Number,
		decimal: true,
		label: "Prix d'un cafe",
		min:0.01,autoform: {
			'label-type': 'placeholder',
			placeholder: "Prix d'un cafe"
		},
	},
	daysInMonth: {
		type: Number,
		label: "Nombre de jours factures par mois",
		min:20,
		autoform: {
			'label-type': 'placeholder',
			placeholder: "Nombre de jours factures par mois"
		},
	},
	internalCost:{
		type: Number,
		decimal: true,
		label: "Frais d'entretien",
		min:0.5,
		autoform: {
			'label-type': 'placeholder',
			placeholder: "Frais d'entretien"
		},
	},
	timestamp:{
		type: Date
	},
}));

Settings.allow({
	update: function(userId, post) { return isAdmin(userId); }, 
	remove: function(userId, post) { return isAdmin(userId); },
	insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !! userId && isAdmin(userId); }
    }
    );