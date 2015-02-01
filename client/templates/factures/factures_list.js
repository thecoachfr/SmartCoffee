Template.facturesList.helpers({
	factures: function() {
		return Factures.find({},{sort : {timestamp: -1}});
	}
});


Template.facturesList.events({
	'click .createBill': function(e) { 
		e.preventDefault();
		Router.go('/submitFacture');
	}
});


