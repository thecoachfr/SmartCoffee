Template.factureLine.helpers({ 
    theUserName: function() {
        var user = CoffeeUsers.findOne({ _id: this.coffeeUserId});
        return user.name + ' ' + user.firstname; 
    },
    theUserCoffee: function() {
        return CoffeeUsers.findOne({ _id: this.coffeeUserId}).amount; 
    },
    theDelta: function() {
        return (this.delta).toFixed(2); 
    },
    theAmount: function() {
        return (this.amount).toFixed(2); 
    },
    theTotal: function() {
        return (this.delta + this.amount).toFixed(2); 
    },
    isPaid: function() {
        return this.paid?"readonly":""; 
    },
    isChecked: function() {
        return this.paid?"checked":""; 
    },
    thePayement: function() {
        return (this.payement == null)?0.0.toFixed(2):(this.payement).toFixed(2); 
    },
    paid: function() {
        return this.paid?"<i class='checkmark icon'></i> Payé":"" + this.reminder + " rappel(s) envoyé(s)";
    },
    paidClass: function() {
        return this.paid?"positive":"negative";
    }
});

Template.factureLine.events = {
  'click input[name=paid]': function(e) {
    e.preventDefault();      
    var lineId = e.currentTarget.value;
    var line = Lines.findOne({_id: lineId});  
    var properties = {
      paid: e.currentTarget.checked,
    };
    Lines.update(lineId, {$set: properties}, function(error) {
      if (error) {
        alert(error.reason);
      }
    });
  },
  'keypress input[name=payement]': function (evt, template) {
    if (evt.which === 13) {
        var lineId = evt.currentTarget.id;
        var line = Lines.findOne({_id: lineId});  
        var properties = {
            payement: parseFloat(evt.currentTarget.value),
            paid: true
        };
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