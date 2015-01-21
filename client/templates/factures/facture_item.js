
Template.factureItem.helpers({ 
    getDate: function() {
        return moment(this.timestamp).format("MMMM YYYY");
    },
    isAdmin: function() {
        return Meteor.user() && (Meteor.user().username === 'admin'); 
    },
    ownFacture: function() {
        return this.userId === Meteor.userId(); 
    },
    getSums: function() {
        var amounts = 0.0;
        var deltas = 0.0;
        var count = 0;
        var paidCount = 0;
        Lines.find({ factureId: this._id }).map(function(e) {
            amounts += e.amount;
            deltas += e.delta;
            count++;
            if (e.paid)
                paidCount++;
        });
        return { 
            totals: (deltas + amounts).toFixed(2),
            count: count,
            paidCount: paidCount,
            complete: Math.round(paidCount*100/count,0)
        };
    },
    getStateText: function() {
        return (this.state == 1)?"Ouverte":"Payée";
    },
    getStateColor: function() {
        return (this.state == 1)?"red":"teal";
    }
});
