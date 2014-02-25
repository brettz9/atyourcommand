/*globals exports, require */
/*jslint vars: true*/
(function () {'use strict';

var chrome = require('chrome'),
    Cc = chrome.Cc,
    Ci = chrome.Ci;

function l (msg) {
	console.log(msg);
}

function createProcess (aNsIFile, args, observer) {
    var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
    observer = (observer && observer.observe) ?
        observer :
        {observe: function (aSubject, aTopic, data) {}};
	process.init(aNsIFile);
    process.runAsync(args, args.length, observer);
}
function getFile (path) {
    var localFile = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
    localFile.initWithPath(path);
    return localFile;
}
function createProcessAtPath (path, args, observer) {
	try {
		var file = getFile(path);
		createProcess(file, args, observer);
	}
	catch (e) {
		if (observer && observer.errorHandler) {
			observer.errorHandler(e);
		}
	}
}


var data = require('sdk/self').data,
	cm = require('sdk/context-menu'),
	windows = require('sdk/windows').browserWindows;

exports.main = function () {

var prefsPanel = require('sdk/panel').Panel({
	width: 240,
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
		cm.Item({ label: 'Send a one-off command', data: 'one-off' })
		// cm.Item({ label: 'Open preferences', data: 'prefs' })
	],
	onMessage: function (clickData) {
		switch (clickData) {
		case 'one-off':
			// The lack of persistence here is WON'T-FIXED per https://bugzilla.mozilla.org/show_bug.cgi?id=595040
			var panel = require('sdk/panel').Panel({
				width: 350,
				height: 300,
				contentScriptFile: [data.url('jml.js'), data.url('one-off.js')],
				contentScriptWhen: 'ready',
				contentURL: data.url('one-off.html'),
				onHide: function () {
					// panel.show(); // Don't allow hiding
				}
			});
			panel.show();
			panel.port.on('buttonClick', function (data) {
				var id = data.id;
				switch (id) {
					case 'saveAndClose':
					case 'cancel':
						panel.destroy();
						break;
					case 'saveAndExecute':
					case 'execute':
						createProcessAtPath(data.executablePath, data.args, {
							errorHandler: function (err) {
								throw (err);
							},
							observe: function (aSubject, aTopic, data) {
								if (aTopic === 'process-finished') {
									panel.port.emit('finished');
								}
							}
						});
						break;
				}
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
