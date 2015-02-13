Template.admin.helpers({
  logs: function() {
//    console.log(Session.get("type"));
    if (Session.get("type") && Session.get("type") !== "") {
      return Logs.find({type: Session.get("type")},{sort : {timestamp: -1}, limit:10});
    } else {
      return Logs.find({type: "Message"},{sort : {timestamp: -1}, limit:10});
    }
  },
  activeMessage: function() {
    return (Session.get("type") && Session.get("type") === "Message")?"active":"";
  },
  activeAll: function() {
    return (Session.get("type") && Session.get("type") !== "")?"":"active";
  },
  activeWarning: function() {
    return (Session.get("type") && Session.get("type") === "Warning")?"active":"";
  },
  activeError: function() {
    return (Session.get("type") && Session.get("type") === "Error")?"active":"";
  }
});

Template.admin.rendered = function() {
  this.$('.ui.checkbox').checkbox ();
};


Template.admin.events({
  'click .filterMessage': function(e) {
    e.preventDefault();
    Session.set("type","Message");
    Meteor.flush();
  },
  'click .filterWarning': function(e) {
    e.preventDefault();
    Session.set("type","Warning");
    Meteor.flush();
  },
  'click .filterError': function(e) {
    e.preventDefault();
    Session.set("type","Error");
    Meteor.flush();
  },
  'click .filterAll': function(e) {
    e.preventDefault();
    Session.set("type","");
    Meteor.flush();
  },
  'click .clearLog': function(e) {
    e.preventDefault();
    Meteor.call('clearLogs');
  }
});

Template.log.helpers({
  getLevel: function() {
    if (this.type === 'Message')
    return "<a class='ui ribbon label'>" + this.type + "</a>";
    if (this.type === 'Warning')
    return "<a class='ui teal label'>" + this.type + "</a>";
    if (this.type === 'Error')
    return "<a class='ui red label'>" + this.type + "</a>";
  },
  getComponent: function() {
    if (this.component === 'Server')
    return "<a class='ui green label'>" + this.component + "</a>";
    if (this.component === 'Client')
    return "<a class='ui teal label'>" + this.component + "</a>";
  },
  getDate: function() {
    return moment(new Date(this.timestamp)).format("YYYY-MM-DD HH:mm:ss");
  }
});
