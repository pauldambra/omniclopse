var OmniAdmin = OmniAdmin || {} 
OmniAdmin.app = Ember.Application.create();

OmniAdmin.app.Router.map(function() {
  this.resource('admin', { path: '/' });
  this.resource('home', { path: '/home'});
});