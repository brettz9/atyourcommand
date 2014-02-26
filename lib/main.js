/*globals exports, require */
/*jslint vars: true*/
(function () {'use strict';

var chrome = require('chrome'),
    Cc = chrome.Cc,
    Ci = chrome.Ci,
    file = require('sdk/io/file');

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

function autocompleteValues (data, emit) {
    var optValues,
        userVal = data.value,
        dir = file.dirname(userVal),
        base = file.basename(userVal);

    if (file.exists(userVal)) {
        if (userVal.match(/(?:\/|\\)$/)) {
            optValues = file.list(userVal).map(function (fileInDir) {
                return file.join(userVal, fileInDir);
            });
        }
        else {
            optValues = [userVal];
        }
    }
    else if (file.exists(dir)) {
        optValues = file.list(dir).filter(function (fileInDir) {
            return fileInDir.indexOf(base) === 0;
        }).map(function (fileInDir) {
            return file.join(dir, fileInDir);
        });
    }
    
    
    optValues = data.dirOnly ?
        optValues.filter(function (optValue) {
            try {
                return getFile(optValue).isDirectory();
            }
            catch (e) {
                return false;
            }
        }) :
        optValues;

    return {
        listID: data.listID,
        optValues: optValues,
        userVal: userVal // Just for debugging on the other side
    };
}

function reveal (path) {
    var localFile = getFile(path);
    localFile.reveal();
}
function picker (data, emit) {
    // Note: could use https://developer.mozilla.org/en-US/docs/Extensions/Using_the_DOM_File_API_in_chrome_code
    //         but this appears to be less feature rich
    var dir,
        dirPath = data.dirPath,
        selector = data.selector,
        selectFolder = data.selectFolder,
        defaultExtension = data.defaultExtension,
        windowMediator = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator),
        nsIFilePicker = Ci.nsIFilePicker,
        fp = Cc['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);

    if (!selectFolder) {
        fp.defaultExtension = defaultExtension;
        //fp.appendFilter('ICO (.ico)', '*.ico');
        //fp.appendFilter('SVG (.svg)', '*.svg');
        //fp.appendFilter('Icon file', '*.ico; *.svg');
        if (defaultExtension === 'ico') {
            fp.appendFilter('Icon file', '*.ico');
        }
    }

    if (dirPath) {
        try {
            dir = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
            dir.initWithPath(dirPath);
            fp.displayDirectory = dir;
        }
        catch(e) {
            l('initWithPath error: '+ e);
        }
    }
    fp.init(
        windowMediator.getMostRecentWindow(null),
        selectFolder ? "Pick a folder for the executable" : "Pick an icon file",
        selectFolder ? nsIFilePicker.modeGetFolder : nsIFilePicker.modeOpen
    );

    fp.open({done: function (rv) {
        var file, path,
            res = '';
        if (rv === nsIFilePicker.returnOK || rv === nsIFilePicker.returnReplace) {
            file = fp.file;
            path = file.path;
            res = path;
        }
        if (selectFolder) {
            emit('dirPickResult', {path: res, selector: selector, selectFolder: selectFolder});
        }
        else {
            emit('filePickResult', {path: res, selector: selector});
        }
        return false;
    }});
    /*
    var rv = fp.show();
    if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
        var file = fp.file;
        var path = fp.file.path;

    }*/
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
				contentScriptOptions: { // any JSON-serializable key/values
                    folderImage: data.url('Yellow_folder_icon_open.png')
				},
				contentURL: data.url('one-off.html'),
				onHide: function () {
					// panel.show(); // Don't allow hiding
				}
			});
			var on = panel.port.on,
				emit = panel.port.emit;
			panel.show();
			on('autocompleteValues', function (data) {
				emit('autocompleteValuesResponse', autocompleteValues(data));
			});
			on('filePick', function (data) {
				picker(data, function (arg1, arg2) {
					panel.show();
					emit(arg1, arg2);
				});
				emit('filePickResponse');
			});
			on('reveal', function (data) {
				reveal(data);
				panel.show();
			});
			on('buttonClick', function (data) {
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
									emit('finished');
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
