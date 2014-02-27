/*globals self*/
/*jslint vars: true*/
self.on('click', function (node, data) {'use strict';
	var msg = {
		type: data,
		selectedText: node.textContent,
		selectedHTML: node.outerHTML,
		pageURL: document.URL,
		bodyText: document.body.textContent,
		pageHTML: document.documentElement.outerHTML,
		pageTitle: document.title
	};
	var nodeName = node.nodeName.toLowerCase();
	if (nodeName === 'a' && node.hasAttribute('href')) {
		msg.linkLocation = node.getAttribute('href'); // Todo: Take into account base href!
	}
	else if (nodeName === 'img' && node.hasAttribute('src')) {
		msg.imageLocation = node.getAttribute('src'); // Todo: Take into account base href!
	}
	
	self.postMessage(msg); // We need privs on the dialogs we open
});
