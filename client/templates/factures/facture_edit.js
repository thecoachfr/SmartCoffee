Template.factureEdit.created = function() {
	Session.set('factureEditErrors', {});
	Session.set('user_search', null);
}

Template.factureEdit.helpers({
	is: function(template) {
		var currentRoute = Router.current();
		return currentRoute && capitalize(template) === currentRoute.lookupTemplate();
	},
	errorMessage: function(field) {
		return Session.get('factureEditErrors')[field]; },
		errorClass: function (field) {
			return !!Session.get('factureEditErrors')[field] ? 'has-error' : '';
		},
		lines: function() {
            var lines = this.lines();
			var array;
			if (Session.get('user_search')) {
				var theSearch = Session.get('user_search').toLowerCase();
				var filter = new Array();
				lines.map(function(line, cpt) {
					if (line.name.toLowerCase().match(theSearch) || line.firstname.toLowerCase().match(theSearch)) {
						filter.push(line);
					}
				});
				array = filter;
			} else {
				array = lines.fetch();
			}
			return array.sort(function(a,b) {
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			});
		},
		getDate: function() {
			return moment(new Date(this.year, this.month)).format("MMMM YYYY");
		}
	});

Template.factureEdit.events({
	'keyup #nameSearchInput': function(evt,tmpl){
		try{
			Session.set('user_search', $('#nameSearchInput').val());
			Meteor.flush();
		}catch(err){
			logError(err);
		}
	},
	'click #nameSearchInput':function(){
		Session.set('selected_word', '');
	},
	'submit form': function(e) {
		e.preventDefault();

		var currentFactureId = this._id;
		var factureProperties = {
			month: parseInt($(e.target).find('[name=month]').val()),
			year: parseInt($(e.target).find('[name=year]').val()),
		}

		Factures.update(currentFactureId, {$set: factureProperties}, function(error) {
			if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
            	Router.go('facturesList');
            }
        });
	},
	'click .closeBill': function(e) {
		e.preventDefault();

		var currentFactureId = this._id;
		var factureProperties = {
			state: 2
		};

		Factures.update(currentFactureId, {$set: factureProperties}, function(error) {
			if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
            	Router.go('facturesList');
            }
        });
	},
	'click .delete': function(e) {
		e.preventDefault();
		if (confirm("Delete this facture?")) {
			var currentFactureId = this._id;
			Factures.remove(currentFactureId);
			Router.go('facturesList');
		}
	},
	'click .sendEmail': function(e) {
		e.preventDefault();
		var facture = this;
    	var lines = Lines.find({ factureId: this._id, paid: false});
    	var res = lines.map(function (line) {
    		var user = findUser(line);
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
    		return data;
    	});
		Meteor.call('sendEmail', res);
	}
});
