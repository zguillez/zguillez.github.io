'use strict';
define(['backbone', 'underscore', 'text!../../templates/footer.html'], function(Backbone, _, FooterTemplate) {
	var FooterView = Backbone.View.extend({
		el: 'div',
		template: _.template(FooterTemplate),
		render: function() {
			this.el.innerHTML = this.template();
		}
	});
	return new FooterView();
});