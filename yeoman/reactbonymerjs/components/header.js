'use strict';

/*define(['react'], function(React) {
	'use strict';
	return React.createClass({
		displayName: 'Header',
		render: function() {
			return (
					<img scr="../images/yeoman.png"/>
			)
		}
	});
});*/

define(['react', '../../components/templates/header'], function (React, template) {
	'use strict';

	return React.createClass({
		displayName: 'Header',
		styles: {
			logo: {
				width: '200px'
			}
		},
		render: template
	});
});
