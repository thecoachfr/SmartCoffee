// check that the userId specified owns the documents
ownsDocument = function(userId, doc) { 
    return doc && doc.userId === userId;
}

isAdmin = function(userId) {
    return Meteor.users.findOne(userId) && (Meteor.users.findOne(userId).username === 'admin');
}