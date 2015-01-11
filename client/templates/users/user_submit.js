Template.userSubmit.events({ 'submit form': function(e) {
    e.preventDefault();
    var coffeUser = {
        name: $(e.target).find('[name=name]').val(), 
        email: $(e.target).find('[name=email]').val(), 
        amount: parseInt($(e.target).find('[name=amount]').val()),
        killed: 0
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
        
        Router.go('userPage', {_id: result._id});
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