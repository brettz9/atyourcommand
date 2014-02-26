/*globals self*/
/*jslint vars: true*/
self.on('click', function (node, data) {'use strict';
	var msg = {
		textContent: node.textContent,
		outerHTML: node.outerHTML,
		data: data,
		documentURL: document.URL,
		pageHTML: document.documentElement.outerHTML,
		pageBody: document.body.textContent,
		title: document.title
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
