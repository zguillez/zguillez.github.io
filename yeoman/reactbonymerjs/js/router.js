'use strict';
define(['backbone', 'underscore', 'views/index'], function(Backbone, _, IndexView) {
	var Router = Backbone.Router.extend({
		routes: {
			'': 'indexAction',
			'*params': 'defaultAction'
		},
		indexAction: function() {
			var indexView = new IndexView();
			indexView.render();
		},
		defaultAction: function(params) {
			console.log('No route:', params);
		}
	});
	var initialize = function() {
		var router = new Router();
		Backbone.emulateHTTP = true;
		Backbone.history.start();
		document.addEventListener('click', function(event) {
			var href = event.target.getAttribute("href");
			if (href) {
				var dataBypass = event.target.getAttribute("data-bypass");
				if (!dataBypass) {
					var protocol = this.protocol + '//';
					if (href.slice(protocol.length) !== protocol) {
						event.preventDefault();
						router.navigate(href, true);
					}
				}
			}
		}, false);
	};
	return {
		initialize: initialize
	};
});