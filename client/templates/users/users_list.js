Template.usersList.helpers({
  users: function() {
      return CoffeeUsers.find({}, { sort: { name: 1 }});
  }
});