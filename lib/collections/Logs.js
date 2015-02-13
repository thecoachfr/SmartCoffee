Logs = new Mongo.Collection('logs');

//Logs.remove({});

Logs.before.update(function (userId, doc) {
	doc.timestamp = new Date().getTime();
});

Logs.before.insert(function (userId, doc) {
	doc.timestamp = new Date().getTime();
});


Logs.allow({
	update: function(userId, post) { return isAdmin(userId); },
	remove: function(userId, post) { return isAdmin(userId); },
	insert: function(userId, doc) {
        // only allow posting if you are logged in
        return !! userId && isAdmin(userId); }
    }
);

getComponent = function() {
	return Meteor.isServer ? "Server":"Client";
};


logInfo = function(message) {
	Logs.insert({ type: "Message", text: message, component: getComponent()  });
};
logWarning = function(message) {
	Logs.insert({ type: "Warning", text: message, component: getComponent()  });
};
logError = function(message) {
	Logs.insert({ type: "Error", text: message, component: getComponent()  });
};
