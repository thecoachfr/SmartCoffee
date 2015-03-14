Meteor.methods({
  update: function() {
    var users = CoffeeUsers.find();
    users.forEach(function(e) {
      if (e.killed === 0 || isNaN(e.killed)) {
        var UserProperties = {
          killed: false
        };
        CoffeeUsers.update(e._id, {$set: UserProperties}, function(error) {
          if (error) {
                // display the error to the user
                throwError(error.reason);
            }
        });
      }
      if (e.killed === 1) {
        var UserProperties = {
          killed: true
        };
        CoffeeUsers.update(e._id, {$set: UserProperties}, function(error) {
          if (error) {
                // display the error to the user
                throwError(error.reason);
            }
        });
      }
    });

  }
});
