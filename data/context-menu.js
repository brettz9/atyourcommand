/*globals self*/
/*jslint vars: true*/
self.on('click', function (node, data) {'use strict';
    var msg = {
        type: data,
        pageURL: document.URL,
        pageTitle: document.title,
        pageHTML: document.documentElement.outerHTML,
        bodyText: document.body.textContent,
        selectedHTML: node.outerHTML,
        selectedText: node.textContent
    };
    var nodeName = node.nodeName.toLowerCase();
    if (nodeName === 'a' && node.hasAttribute('href')) {
        msg.linkPageURL = node.getAttribute('href'); // Todo: Take into account document.baseURI
        // We retrieve "linkPageTitle", "linkBodyText", and "linkPageHTML" only as needed
    }
    else if (nodeName === 'img' && node.hasAttribute('src')) {
        msg.imageURL = node.getAttribute('src'); // Todo: Take into account document.baseURI
    }
    
    self.postMessage(msg); // We need privs on the dialogs we open
});
