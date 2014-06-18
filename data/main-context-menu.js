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
		selector: data.selector,
		contentType: document.contentType,
		pageURL: document.URL,
		selectedHTML: node.outerHTML,
		selectedText: node.textContent,
		// Could require user to specify these (as associatable with specific tags)
		pageTitle: document.title, // hidden
		pageHTML: document.documentElement.outerHTML, // Treat like hidden to avoid need to select anything
		bodyText: document.body.textContent // Treat like hidden to avoid need to select anything
	};
	var nodeName = node.nodeName.toLowerCase();
	if (data.customProperty) {
		msg.customProperty = node[data.customProperty];
	}
	// Retrieve "linkPageTitle", "linkBodyText", and "linkPageHTML" only as needed
	
	self.postMessage(msg); // We need privs on the dialogs we open
});
