/*globals self*/
self.on('click', function (node, data) {
	self.postMessage(data); // We need privs on the dialogs we open
});
