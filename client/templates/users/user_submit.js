Template.userSubmit.events({ 
	'click .create': function(e) {
		e.preventDefault();
		var coffeUser = {
			name: $('.ui.form').find('[name=name]').val(), 
			firstname: $('.ui.form').find('[name=firstname]').val(),
			email: $('.ui.form').find('[name=email]').val(), 
			amount: parseInt($('.ui.form').find('[name=amount]').val()),
			killed: $('.ui.form').find('[name=killed]').is(':checked')
		};
		
		var errors = validateUser(coffeUser); 
		if (errors.name || errors.amount || errors.email)
			return Session.set('userSubmitErrors', errors);
		
		Meteor.call('userInsert', coffeUser, function(error, result) { 
        // display the error to the user and abort
        if (error)
        	return throwError(error.reason);
        
        // show this result but route anyway
        if (result.userExists)
        	throwError('This user already exists');
        
        Router.go('userEdit', {_id: result._id});
    });
	}
});

Template.userSubmit.created = function() { 
	Session.set('userSubmitErrors', {});
}

Template.userSubmit.helpers({
	errorMessage: function(field) {
		return Session.get('userSubmitErrors')[field]; 
	},
	errorClass: function (field) {
		return !!Session.get('userSubmitErrors')[field] ? 'has-error' : '';
	}
});