Factures = new Mongo.Collection('factures');

Meteor.methods({
    factureInsert: function(factureAttributes) {
        check(Meteor.userId(), String);
        
        var factureWithSameDate = Factures.findOne({month: factureAttributes.month, year: factureAttributes.year});
        if (factureWithSameDate) {
            return {
                factureExists: true,
                _id: factureWithSameDate._id
            }
        }
        
        var user = Meteor.user();
        var facture = _.extend(factureAttributes, {
            userId: user._id, 
            author: user.username, 
            submitted: new Date()
        });
        var factureId = Factures.insert(facture);  
        var candidateLines = CoffeeUsers.find({ killed: 0 }, {sort: {submitted: -1}}).fetch();
        var lastMonthBill = findLastMonthBill();
        candidateLines.forEach(function(user, i) {
            var line = Lines.findOne({ factureId: lastMonthBill._id, coffeeUserId: user._id});
            Lines.insert({
                factureId: factureId,
                coffeeUserId: user._id,
                coffee: user.amount,
                amount: computeCoffeePrice(user.amount),
                delta: computeDelta(line),
                payement: 0.0,
                paid: (computeCoffeePrice(user.amount) + computeDelta(line)) <= 0 ,
                reminder : 0
            });
        });
        //}
        
        return {
            _id: factureId
        }; 
    },
    sendEmail: function(factureId) {    
        var facture = Factures.findOne({ _id: factureId});
        var lines = Lines.find({ factureId: factureId, paid: false});
        lines.forEach(function(line, cpt) {
            var user = findUser(line);
            var date = moment(new Date(facture.timestamp)).format("MMMM YYYY");
            var emailBody = "Salut " + user.firstname + ", \n\n";
            emailBody += "Pour le mois de " + date;
            emailBody += " tu dois " + (line.delta + line.amount).toFixed(2) + " € : \n";
            emailBody += " * dettes du/des mois précédent(s) : " + line.delta.toFixed(2) + " €\n";
            emailBody += " * pour ce mois : arrondi( " + user.amount + " café(s) x 22 jours x " + coffeePrice().toFixed(2) +" ) + 1 € = " + line.amount.toFixed(2) + "€ \n\n";
            emailBody += "La coffee team."
            console.log(user.email);
            if (Meteor.isServer) {
                Email.send({
                    from: "afau@smartadserver.com",
                    to: user.email,
                    subject: "Café " + date,
                    text: emailBody
                });
            }
            var reminder = line.reminder + 1;
            Lines.update(line._id, {$set: { reminder: reminder }},function(error) { 
                if (error) {
                    // display the error to the user
                    throwError(error.reason); 
                } 
            }); 
        });
    }
});

findUser = function(line) {
    return CoffeeUsers.findOne({ _id: line.coffeeUserId });
}

findLastMonthBill = function() {
    var date = new Date();
    var lastMonth = date.getMonth() - 1;
    var year = date.getFullYear();
    if (lastMonth < 0) {
        lastMonth = 11;
        year--;
    }
    var lastMonthBill = Factures.findOne({ month: lastMonth, year: year }); 
    return lastMonthBill;
}

computeDelta = function(line) {
    if (line)
        return line.delta + line.amount - line.payement;
    else 
        return 0.0;
};

coffeePrice = function() { return 0.12; };
daysInMonth = function() { return 22; };

computeCoffeePrice = function(nbCoffee) {
    return Math.round(nbCoffee*coffeePrice()*daysInMonth()) + 1;
}

Factures.allow({
    update: function(userId, post) { return ownsDocument(userId, post); }, 
    remove: function(userId, post) { return ownsDocument(userId, post); },
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !! userId; }
});
