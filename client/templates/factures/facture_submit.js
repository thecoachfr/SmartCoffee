Template.factureSubmit.created = function() {
	Session.set('factureSubmitErrors', {});
};

Template.factureSubmit.helpers({
	errorMessage: function(field) {
		return Session.get('factureSubmitErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('factureSubmitErrors')[field] ? 'has-error' : '';
	},
	getDate: function() {
		var date = new Date();
		return moment(date).format("MMMM YYYY");
	},
	lines: function() {
		var lines = CoffeeUsers.find({ killed: false }, { sort: { name:1}});
		return lines;
	},
	getSums: function() {
		var coffees = 0.0;
		CoffeeUsers.find({ killed: false }).map(function(e) {
			coffees += e.amount;
		});
		var lastMonthDeltas = 0.0;
		var lastMonthAmounts = 0.0;
		var lastMonthBill = findLastMonthBill();
		Lines.find({factureId: lastMonthBill._id}).map(function(e) {
			lastMonthDeltas += e.delta;
			lastMonthAmounts += e.amount;
		});

		var amounts = computeCoffeePrice(coffees);
		return {
			coffees: coffees,
			amounts: amounts.toFixed(1),
			deltas: lastMonthDeltas.toFixed(1),
			totals: (lastMonthDeltas + lastMonthAmounts + amounts).toFixed(1)
		};
	}
});

Template.factureSubmit.events({
	'click .createBill': function(e) {
		e.preventDefault();
		var theDate = new Date();
		var month = theDate.getMonth();
		var year = theDate.getFullYear();
		var facture = {
			timestamp: new Date(year, month),
			month: month,
			year: year,
        state: 1 // Open
    };

    Meteor.call('factureInsert', facture, function(error, result) {
        // display the error to the user and abort
        if (error)
        	return throwError(error.reason);

        // show this result but route anyway
        if (result.factureExists)
        	throwError('This bill already exists');

        Router.go('factureEdit', {_id: result._id});
    });
}
});

Template.candidateLine.helpers({
	theUserName: function() {
		return this.name + ' ' + this.firstname;
	},
	getSum: function() {
		var lastMonthBill = findLastMonthBill();
		var line = Lines.findOne({ coffeeUserId: this._id, factureId: lastMonthBill._id});

		var amount = computeCoffeePrice(this.amount);
		var delta = computeDelta(line);
		var total = delta + amount;
		var paid = (total === 0)?"oui":"non";

		return {
			delta: delta.toFixed(1),
			total: total.toFixed(1),
			amount: amount.toFixed(1),
			paid: paid
		};
	}
});
