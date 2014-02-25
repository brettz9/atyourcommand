/*globals exports, require */
(function () {'use strict';

var data = require('sdk/self').data,
	cm = require('sdk/context-menu'),
	windows = require('sdk/windows').browserWindows;

exports.main = function () {

var prefsPanel = require('sdk/panel').Panel({
	width: 215,
	height: 160,
	contentURL: data.url('prefs.html')
});
var prefsWidget = require('sdk/widget').Widget({
	id: 'atyourcommand-prefs',
	label: 'AYC',
	// contentURL: data.url('.png'),
	content: 'AYC',
	// width: 50
	panel: prefsPanel
});

// Open context menu with a specific command line, a new command line, or prefs
// Todo: Also support text selection, URL, image, and custom context(s)

cm.Menu({
	label: 'At Your Command',
	context: cm.PageContext(),
	contentScriptFile: data.url('context-menu.js'),
	items: [
		// cm.Item({ label: 'Open in WebAppFind edit mode', data: '' }), // Todo: Put this into default storage
		// Todo: i18n-ize (and invite sharing with AppLauncher)
		cm.Item({ label: 'Send a one-off command', data: 'one-off' }),
		cm.Item({ label: 'Open preferences', data: 'prefs' })
	],
	onMessage: function (clickData) {
		switch (clickData) {
		case 'one-off':
			var panel = require('sdk/panel').Panel({
				width: 300,
				height: 300,
				contentScriptFile: [data.url('jml.js'), data.url('one-off.js')],
				contentScriptWhen: 'ready',
				contentURL: data.url('one-off.html')
			});
			panel.show();
			panel.port.on('loaded', function (data) {
				console.log(data);
			});
			break;
		case 'prefs':
			// Detachment of panel upon opening in this manner is a bug that is WONT-FIXED
			// since widgets to be deprecated per https://bugzilla.mozilla.org/show_bug.cgi?id=638142
			prefsWidget.panel.show();
			break;
		}
	}
});


};


exports.onUnload = function () { // reason
};


}());
