/*globals self, postMessage */
self.on('click', function (node, data) {'use strict';
	postMessage({name: data});
});
