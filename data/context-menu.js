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
		msg.href = node.getAttribute('href');
	}
	else if (nodeName === 'img' && node.hasAttribute('src')) {
		msg.src = node.getAttribute('src');
	}
	
	self.postMessage(msg); // We need privs on the dialogs we open
});
