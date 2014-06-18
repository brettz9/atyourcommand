/*globals self*/
/*jslint vars: true*/
/*
// For "context" events, "node" will always be the SelectorContext node,
//  even if a child node is the one responsible for activating the menu
self.on('context', function (node) {'use strict';
});
*/
// For "click" events where "SelectorContext" was used, "node" will be
//  the SelectorContext node; otherwise, it will be the actual node clicked
self.on('click', function (node, data) {'use strict';
	var msg = {
		type: data,
		contentType: document.contentType,
		pageURL: document.URL,
		pageTitle: document.title,
		pageHTML: document.documentElement.outerHTML,
		bodyText: document.body.textContent,
		selectedHTML: node.outerHTML,
		selectedText: node.textContent
	};
	var nodeName = node.nodeName.toLowerCase();
	
	
	if (nodeName === 'a' && node.hasAttribute('href')) {
		msg.linkPageURL = node.href; // Includes base URI
		// We retrieve "linkPageTitle", "linkBodyText", and "linkPageHTML" only as needed
	}
	else if (nodeName === 'img' && node.hasAttribute('src')) {
		msg.imageURL = node.src; // Includes base URI
	}
	
	self.postMessage(msg); // We need privs on the dialogs we open
});
