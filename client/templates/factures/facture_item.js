
Template.factureItem.helpers({ 
	isAdmin: function() {
		return Meteor.user() && (Meteor.user().username === 'admin'); 
	},
	ownFacture: function() {
		return this.userId === Meteor.userId(); 
	},
	getStateText: function() {
		return (this.state == 1)?"Ouverte":"Payée";
	},
	getStateColor: function() {
		return (this.state == 1)?"red":"teal";
	}
});
