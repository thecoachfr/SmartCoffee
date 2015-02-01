Template.factureLine.helpers({ 
	is: function(template) {
		var currentRoute = Router.current();
		return currentRoute && capitalize(template) === currentRoute.lookupTemplate();
	},
	theUserName: function() {
		return this.name + ' ' + this.firstname; 
	},
	theMonth: function() {
		return this.bill().getDate();
	},
	theDelta: function() {
		return (this.delta).toFixed(1); 
	},
	theAmount: function() {
		return (this.amount).toFixed(1); 
	},
	theTotal: function() {
		return (this.delta + this.amount).toFixed(1); 
	},
	isPaid: function() {
		return this.paid?"readonly":""; 
	},
	isChecked: function() {
		return this.paid?"checked":""; 
	},
	thePayement: function() {
		return (this.payement == null)?0.0.toFixed(1):(this.payement).toFixed(1); 
	},
	paid: function() {
		return this.paid?"<i class='checkmark icon'></i> Payé":"" + this.reminder + " rappel(s) envoyé(s)";
	},
	paidClass: function() {
		return this.paid?"positive":"negative";
	}
});

Template.factureLine.rendered = function() { 
	this.$('.ui.checkbox').checkbox ();
}

Template.factureLine.events = {
	'click .ui.checkbox': function(e) {
		e.preventDefault(); 	    
		var elem = $(e.currentTarget).find('[name=paid]');    
		var lineId = elem.val();
		var line = Lines.findOne({_id: lineId});  
		var properties = {
			paid: elem.is(':checked')
		};
		console.log(line); 
		Lines.update(lineId, {$set: properties}, function(error) {
			if (error) {
				alert(error.reason);
			}
		});
	},
	'keypress input[name=delta]': function (evt, template) {
		if (evt.which === 13) {
			var lineId = evt.currentTarget.id;
			var line = Lines.findOne({_id: lineId});  
			var properties = {
				delta: parseFloat(evt.currentTarget.value)
			};
			console.log(line);
			if (properties.delta) {
				Lines.update(lineId, {$set: properties}, function(error) {
					if (error) {
						alert(error.reason);
					}
				});
			}
		}
	},
	'keypress input[name=payement]': function (evt, template) {
		if (evt.which === 13) {
			var lineId = evt.currentTarget.id;
			var line = Lines.findOne({_id: lineId});  
			var properties = {
				payement: parseFloat(evt.currentTarget.value),
				paid: true
			};
			console.log(properties);
			if (properties.payement) {
				Lines.update(lineId, {$set: properties}, function(error) {
					if (error) {
						alert(error.reason);
					}
				});
			}
		}
	}
};