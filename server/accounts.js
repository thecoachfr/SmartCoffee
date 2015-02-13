/*ServiceConfiguration.configurations.remove({
  service: "google"
});*/

Accounts.config({
  forbidClientAccountCreation: true,
  restrictCreationByEmailDomain: function(address) {
        return new RegExp('.*@smartadserver.com$', 'i').test(address);
    }
});

inDevelopment = function () {
  return process.env.NODE_ENV === "development";
};

inProduction = function () {
  return process.env.NODE_ENV === "production";
};
