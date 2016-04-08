'use strict';
define(['backbone', 'underscore', 'react', 'react_dom', 'text!../../templates/index.html',
		'views/footer', 'collections/data', '../../components/header'
	],
	function(Backbone, _, React, ReactDOM, IndexTemplate, FooterView, DataCollection, HeaderComponent) {
		var IndexView = Backbone.View.extend({
			el: document.getElementById('app'),
			template: _.template(IndexTemplate),
			data: {},
			events: {
				'click .logo': 'showAlert'
			},
			initialize: function() {
				this.dataCollection = DataCollection;
				this.footerView = FooterView;
			},
			render: function() {
				var scope = this;
				scope.data.libs = [];
				this.dataCollection.fetch({
					success: function(collection, response, options) {
						scope.dataCollection.each(function(lib) {
							scope.data.libs.push(lib.toJSON());
						});
						scope.el.innerHTML = scope.template(scope.data);
						scope.footerView.el = document.getElementById('footer');
						scope.footerView.render();
						ReactDOM.render(React.createElement(HeaderComponent, null), document.getElementById('header'));
					},
					error: function() {
						console.log('Error loading json');
					}
				});
			},
			showAlert: function() {
				alert('Hell Yeah!');
			}
		});
		return IndexView;
	});