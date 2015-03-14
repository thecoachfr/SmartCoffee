Template.userItem.helpers({
	isAdmin: function() {
		return Meteor.user() && (Meteor.user().username === 'admin');
	},
	getState: function () {
		if (this.killed === false) return 'actif';
		return 'désactivé';
	},
	state: function() {
		return (this.killed === false)?"<i class='blue flag icon'></i>":"<i class='red flag icon'></i>";
	},
	coffee: function() {
		return "<span class='badge'>" + this.amount + " café(s)/jour</span>";
	},
	dataImg: function() {
		var gContact = GContacts.findOne({ _id: this.gContactId });
		if (gContact)
			return '<img class="ui avatar image" src="'+gContact.dataImg+'">';
		else
		  return '';
	}
});

Template.userItem.events({
	'click .delete': function(e) {
		e.preventDefault();
		if (confirm("Delete this user?")) {
			var currentUserId = this._id;
			CoffeeUsers.remove(currentUserId);
			Router.go('usersList');
		}
	}
});
