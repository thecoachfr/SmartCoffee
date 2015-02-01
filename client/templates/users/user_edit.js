Template.userEdit.created = function() { 
	Session.set('userEditErrors', {});
}

Template.userEdit.rendered = function() { 
	this.$('.ui.checkbox').checkbox ();
}

Template.userEdit.helpers({ 
	errorMessage: function(field) {
		return Session.get('userEditErrors')[field]; 
	},
	errorClass: function (field) {
		return !!Session.get('userEditErrors')[field] ? 'has-error' : '';
	},
	getKilled: function() {
		return this.killed?"checked":"";
	},
	hasUnpaid: function() {
		var paid = true;
		this.lines().forEach(function (doc, idx, cursor) {
			paid = paid && doc.paid;
		});
		return !paid;
	},
});

Template.userEdit.events({ 
	'click .ui.submit': function(e) {
		e.preventDefault();
		
		var currentUserId = this._id;
		var UserProperties = {
			name: $('.ui.form').find('[name=name]').val(), 
			firstname: $('.ui.form').find('[name=firstname]').val(),
			email: $('.ui.form').find('[name=email]').val(), 
			amount: parseInt($('.ui.form').find('[name=amount]').val()),
			killed: $('.ui.form').find('[name=killed]').is(':checked')
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
	},
	'click .sendEmail': function(e) { 
		e.preventDefault();
		var user = this;
		var line = Lines.findOne({ coffeeUserId: this._id },{sort : {factureId: -1}});
		if (!line.paid) {
			var facture = Factures.findOne({
				_id: line.factureId
			});
			var date = moment(new Date(facture.year,facture.month)).format("MMMM YYYY");
			var total = (line.delta + line.amount);
			var data = {
				email: user.email,
				id: line._id,
				reminder: line.reminder,
				firstname: user.firstname,
				theMonth: date,
				thisMonthTotal: total.toFixed(2),
				amount: line.amount.toFixed(2),
				dettes: line.delta.toFixed(2),
				numberOfCoffee: user.amount,
				daysInMonth: daysInMonth(), 
				coffeePrice: coffeePrice().toFixed(2),
				internalCost: internalCost().toFixed(2)
			};
			var html = Blaze.toHTML(Blaze.With(data, function() { return Template.email; }));
			data.html = html;
			Meteor.call('sendOneEmail', data);
		}
	}	
});