Template.factureEdit.created = function() { 
    Session.set('factureEditErrors', {});
    Session.set('user_search', null);
}

Template.factureEdit.helpers({ 
    errorMessage: function(field) {
        return Session.get('factureEditErrors')[field]; },
    errorClass: function (field) {
        return !!Session.get('factureEditErrors')[field] ? 'has-error' : '';
    },
    lines: function() {
        var lines = Lines.find({ factureId: this._id }, 
                               { transform: function(userLine) {
            var user = CoffeeUsers.findOne({ _id: userLine.coffeeUserId});
            var newUserLine = _.extend(userLine, { name: user.name, firstname: user.firstname});                                                  
            return newUserLine;                                           
        }});
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
        });;
    },
    getSums: function() {
        var amounts = 0.0;
        var coffees = 0;
        var deltas = 0.0;
        Lines.find({ factureId: this._id }).map(function(e) {
            amounts += e.amount;
            coffees += e.coffee;
            deltas += e.delta;
        });
        return { 
            amounts: amounts.toFixed(2), 
            coffees: coffees, 
            deltas: deltas.toFixed(2), 
            totals: (deltas + amounts).toFixed(2)
        };
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
            console.log(err);
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
        Meteor.call('sendEmail', this._id);
    }
});