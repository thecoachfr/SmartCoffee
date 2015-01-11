Template.facturesList.helpers({
  factures: function() {
      return Factures.find({},{sort : {timestamp: -1}});
  }
});


