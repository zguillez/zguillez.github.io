'use strict';

define(['react', 'components/header', 'components/footer'], function (React, Header, Footer) {
	'use strict';
	var Content = React.createClass({
		displayName: 'Content',

		getInitialState: function getInitialState() {
			return {
				libs: []
			};
		},
		componentDidMount: function componentDidMount() {
			$.get('data/data.json', (function (result) {
				if (this.isMounted()) {
					var libs = [];
					for (var i = 0; i < result.length; i++) {
						libs.push(React.createElement(
							'a',
							{ key: result[i].name, href: result[i].url, target: '_black', className: 'btn btn-default btn-sm' },
							result[i].name
						));
					}
					this.setState({
						libs: libs
					});
				}
			}).bind(this));
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(Header, null),
				React.createElement(
					'section',
					{ className: 'content' },
					React.createElement(
						'header',
						null,
						React.createElement('img', { src: 'images/reactjs.png', className: 'logo' })
					),
					React.createElement(
						'div',
						{ className: 'buttons row' },
						this.state.libs
					)
				),
				React.createElement(Footer, null)
			);
		}
	});
	return Content;
});
