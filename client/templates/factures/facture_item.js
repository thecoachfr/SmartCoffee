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
        Lines.find({ factureId: this._id }).map(function(e) {
            amounts += e.amount;
            deltas += e.delta;
        });
        return { 
            totals: (deltas + amounts).toFixed(2)
        };
    },
    getState: function() {
        return (this.state == 1)?"<span class='label label-warning'>Ouverte</span>":"<span class='label label-primary'>Payée</span>";
    }
});
