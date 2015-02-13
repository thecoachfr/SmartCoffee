Template.usersList.created = function() {
	Session.set('user_search', '');
}


Template.usersList.helpers({
	users: function() {
		var filter =  CoffeeUsers.find({
			name :{ $regex: Session.get('user_search'), $options: 'i' }},
			{ sort: { name: 1 }});
		if (filter.count() === 0) {
			filter = CoffeeUsers.find({
				firstname : { $regex: Session.get('user_search'), $options: 'i' }},
				{ sort: { name: 1 }});
		}
		return filter;
	}
});

Template.usersList.events({
	'keyup #nameSearchInput': function(evt,tmpl){
		try{
			Session.set('user_search', $('#nameSearchInput').val());
			//console.log(Session.get('user_search'));
			Meteor.flush();
		}catch(err){
			logError(err);
		}
	},
	'click #nameSearchInput':function(){
		Session.set('selected_word', '');
	},
	'click .createUser': function(e) {
		e.preventDefault();
		Router.go('/submitUser');
	}
});
