Template.header.helpers({
	activeIfTemplateIs: function(template) {
		var currentRoute = Router.current();
		return currentRoute && capitalize(template) === currentRoute.lookupTemplate() ? 'active' : '';
	}
});

capitalize = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}