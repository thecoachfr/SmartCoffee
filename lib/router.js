Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() { return Meteor.subscribe('factures') && Meteor.subscribe('coffeeUsers') && Meteor.subscribe('lines'); }
});

Router.route('/', {name: 'facturesList'});

Router.route('/factures/:_id', {
    name: 'facturePage',
    data: function() { return Factures.findOne(this.params._id); }
});

Router.route('/factures/:_id/edit', {
    name: 'factureEdit',
    data: function() { return Factures.findOne(this.params._id); }
});

Router.route('/submitFacture', {name: 'factureSubmit'});

Router.route('/users', {name: 'usersList'});

Router.route('/users/:_id', {
    name: 'userPage',
    data: function() { return CoffeeUsers.findOne(this.params._id); }
});

Router.route('/users/:_id/edit', {
    name: 'userEdit',
    data: function() { return CoffeeUsers.findOne(this.params._id); }
});

Router.route('/submitUser', {name: 'userSubmit'});


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
}

Router.onBeforeAction('dataNotFound', {only: 'facturePage'});
Router.onBeforeAction(requireLogin);