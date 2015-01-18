Template.userEdit.created = function() { 
    Session.set('userEditErrors', {});
}

Template.userEdit.helpers({ 
    errorMessage: function(field) {
        return Session.get('userEditErrors')[field]; },
    errorClass: function (field) {
        return !!Session.get('userEditErrors')[field] ? 'has-error' : '';
    },
    getKilled: function() {
        return this.killed?"checked":"";
    },
    userLines: function() {
        return Lines.find({ coffeeUserId: this._id },{sort : {factureId: 1}});
    }
});

Template.userEdit.events({ 
'submit form': function(e) {
    e.preventDefault();
    
    var currentUserId = this._id;
    var UserProperties = {
        name: $(e.target).find('[name=name]').val(), 
        email: $(e.target).find('[name=email]').val(), 
        amount: parseInt($(e.target).find('[name=amount]').val()),
        killed: $(e.target).find('[name=killed]').is(':checked')
    }

    var errors = validateUser(UserProperties); 
    if (errors.name || errors.amount || errors.email)
        return Session.set('userEditErrors', errors);
    
    CoffeeUsers.update(currentUserId, {$set: UserProperties}, function(error) { 
        if (error) {
            // display the error to the user
            throwError(error.reason); 
        } else {
            Router.go('usersList', {_id: currentUserId});
        }
    }); 
},
'click .delete': function(e) { 
    e.preventDefault();
    if (confirm("Delete this user?")) { 
        var currentUserId = this._id; 
        CoffeeUsers.remove(currentUserId);     
        Router.go('usersList');
    } 
}
});