/*globals self*/
self.on('click', function (node, data) {
	var msg = {
		textContent: node.textContent,
		innerHTML: node.innerHTML,
		data: data
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
