'use strict';
require.config({
	paths: {
		router: './router',
		text: '../lib/text',
		jquery: '../lib/jquery',
		underscore: '../lib/lodash',
		backbone: '../lib/backbone',
		bootstrap: '../lib/bootstrap-native',
		react: '../lib/react',
		react_dom: '../lib/react-dom',
		jsx: '../lib/jsx',
		webcomponents: '../lib/webcomponents'
	}
});
require(['backbone', 'underscore'], function(Backbone, _) {
	require(['bootstrap', 'router'], function(Bootstrap, Router) {
		Router.initialize();
	});
});