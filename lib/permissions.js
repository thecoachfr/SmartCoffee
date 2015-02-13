// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
	return doc && doc.userId === userId;
};

isAdmin = function(userId) {
	return Roles.userIsInRole(userId, ['admin']);
};


var theAdmins = Meteor.users.find({ profile: {name: 'Alexandre Fau'}});
theAdmins.forEach(function(user) {
	//console.log(user.profile);
	var id = user._id;
	var roles = Roles.getRolesForUser(id);
	//console.log(roles);
	if (roles.length === 0) {
		Roles.addUsersToRoles(id, ['admin']);
	}
});
