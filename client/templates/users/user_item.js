Template.userItem.helpers({ 
    isAdmin: function() {
        return Meteor.user() && (Meteor.user().username === 'admin'); 
    },
    getState: function () {
        if (this.killed == 0) return 'actif';
        return 'désactivé';
    },
    state: function() {
        return (this.killed == 0)?"<span class='label label-primary'>Actif</span>":"<span class='label label-info'>désactivé</span>";
    },
    coffee: function() {
        return "<span class='badge'>" + this.amount + " café(s)/jour</span>";
    }
});

Template.userItem.events({ 
'click .delete': function(e) { 
    e.preventDefault();
    if (confirm("Delete this user?")) { 
        var currentUserId = this._id; 
        CoffeeUsers.remove(currentUserId);     
        Router.go('usersList');
    } 
}
});