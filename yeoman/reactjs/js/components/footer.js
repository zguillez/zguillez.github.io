'use strict';

define(['react'], function (React) {
	'use strict';
	return React.createClass({
		displayName: 'footer',
		render: function render() {
			return React.createElement(
				'footer',
				null,
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'p',
						null,
						'@2016'
					)
				)
			);
		}
	});
});
