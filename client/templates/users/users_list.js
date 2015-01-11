Template.usersList.helpers({
  users: function() {
      return CoffeeUsers.find({});
  }
});