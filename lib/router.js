Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { return Meteor.subscribe('factures') &&
	Meteor.subscribe('coffeeUsers') &&
	Meteor.subscribe('lines') &&
	Meteor.subscribe('googleContacts') &&
	Meteor.subscribe('logs') &&
	Meteor.subscribe('settings'); }
});

var requireAdmin = function() {
	var loggedInUser = Meteor.user();

	if (!Roles.userIsInRole(loggedInUser, ['admin'])) {
		this.render('accessDenied');
	} else {
		this.next();
	}
};

Router.route('/', {name: 'facturesList'});

Router.route('/factures/:_id/edit', {
	name: 'factureEdit',
	data: function() { return Factures.findOne(this.params._id); },
	onBeforeAction: requireAdmin
});

Router.route('/submitFacture', {
	name: 'factureSubmit',
	onBeforeAction: requireAdmin
});

Router.route('/users', {name: 'usersList'});

Router.route('/users/:_id/edit', {
	name: 'userEdit',
	data: function() { return CoffeeUsers.findOne(this.params._id); },
	onBeforeAction: requireAdmin
});

Router.route('/submitUser', {
	name: 'userSubmit',
	onBeforeAction: requireAdmin
});

Router.route('/settings', {
	name: 'settings',
	onBeforeAction: requireAdmin
});

Router.route('/admin', {
	name: 'admin',
	onBeforeAction: requireAdmin
});

var requireLogin = function() {
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			this.render('accessDenied');
		}
	} else {
		this.next();
	}
};

Router.onBeforeAction('dataNotFound', {only: 'facturePage'});
Router.onBeforeAction(requireLogin);
