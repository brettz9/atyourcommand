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
	var data = typeof data === 'string' ? {data: data} : data;
	var msg = {
		data: data.data,
		selector: data.selector,
		
		// Todo: ensure all of the following are documented
		// Other non-element magic items?
		contentType: document.contentType,
		pageURL: document.URL,
		characterSet: document.characterSet,
		lastModified: document.lastModified,
		referrer: document.referrer,
		// Todo: allow user to designate individual:
		//   cookies/FileSystem/indexedDB/localStorage!!!!!; comma-separated
		//   list (or using privileges, get all of cookies/localStorage for
		//   the page); means to supply privileged write (or listen)-access
		//   back to these local storage items?
		// Todo: Document anchors (name/text), designMode, plugins useful?

		// Todo: add to these magic items, depending also on whether there is a context or not
		selectedHTML: node.outerHTML,
		selectedText: node.textContent,
		// Todo: Change to require user to specify these (since associatable with specific tags)
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
