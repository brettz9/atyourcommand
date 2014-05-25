/*globals exports, require */
/*jslint vars: true*/
(function () {'use strict';

var chrome = require('chrome'),
    Cc = chrome.Cc,
    Ci = chrome.Ci,
    _ = require('sdk/l10n').get,
    file = require('sdk/io/file'),
    tabs = require('sdk/tabs');

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
function getHardFile (dir) {
    return Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get(dir, Ci.nsIFile);
}
/**
* @see getHardPaths()
*/
function getHardPath (dir) {
    return getHardFile(dir).path;
}
function getFirefoxExecutable () {
    var file = getHardFile('CurProcD');
    file = file.parent; // Otherwise, points to "browser" subdirectory
    file.append('firefox.exe');
    return file;
}
function getTempPaths () {
    return {
        type: 'temps',
        paths: [
            ['System temp', getHardPath('TmpD')]
        ]
    };
}
function getExePaths () {
    return {
        type: 'executables',
        paths: [
            ['Firefox', getFirefoxExecutable().path],
            ['Command prompt', file.join(getHardPath('SysD'), 'cmd.exe')]
        ]
    };
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

var filePickerLocale = ['pickFolder', 'pickFile'].reduce(function (locale, key) {
    locale[key] = _("filepicker_" + key);
    return locale;
}, {});

// Todo: Apply these changes in other add-ons using it; also add this as a filterMap where needed [{type: '*.ico', message: "Icon file"}]
function picker (data, filterMap, locale, emit) {
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
        (filterMap || []).forEach(function (filters) {
            fp.appendFilter(filters.message, filters.type);
        });
    }

    if (dirPath) {
        try {
            dir = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
            dir.initWithPath(dirPath);
            if (!dir.isDirectory()) { // Todo: Return this change to other add-ons
                dir.initWithPath(file.dirname(dirPath));
            }
            fp.displayDirectory = dir;
        }
        catch(e) {
            l('initWithPath error: '+ e);
        }
    }
    fp.init(
        windowMediator.getMostRecentWindow(null),
        selectFolder ? locale.pickFolder : locale.pickFile,
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
    winUtils = require('sdk/window/utils'),
    windows = require('sdk/windows').browserWindows;

exports.main = function () {

/*
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
*/

// Open context menu with a specific command line, a new command line, or prefs
// Todo: Also support text selection, URL, image, and custom context(s)

cm.Menu({
    label: _("At Your Command"),
    context: cm.PageContext(),
    contentScriptFile: data.url('main-context-menu.js'),
    items: [
        // cm.Item({ label: 'Open in WebAppFind edit mode', data: '' }), // Todo: Put this into default storage
        // Todo: invite (or utilize?) sharing of i18n with AppLauncher
        cm.Item({ label: _("Send a one-off command"), data: 'one-off' })
        // cm.Item({ label: _("Open preferences"), data: 'prefs' })
    ],
    onMessage: function (e) {
        var itemType = e.type;
        switch (itemType) {
        case 'one-off':
            // We can't use panels because:
            // 1. Its lack of persistence is WON'T-FIXED per https://bugzilla.mozilla.org/show_bug.cgi?id=595040
            // 2. Tooltips and autocomplete don't show up.
            // However, see http://stackoverflow.com/questions/22002010/addon-sdk-way-to-make-a-dialog/
            var win = winUtils.openDialog({
                // url: data.url('one-off.html'),
                // For more, see https://developer.mozilla.org/en-US/docs/Web/API/window.open#Position_and_size_features
                features: Object.keys({
                    chrome: true,
                    centerscreen: true, // Needs chrome per docs; not working for some reason (even though it does work when calling via chrome code)
                    resizable: true,
                    scrollbars: true
                }).join() + ',width=850,height=650',
                name: _("One-off")
                // parent: 
                // args: 
            });
            win.addEventListener('load', function () {
                tabs.activeTab.on('ready', function (tab) {
                    var worker = tab.attach({
                        contentScriptFile: [data.url('jml.js'), data.url('ExpandableInputs.js'), data.url('one-off.js')],
                        contentScriptWhen: 'ready',
                        contentScriptOptions: { // any JSON-serializable key/values
                            folderImage: data.url('Yellow_folder_icon_open.png'),
                            locale: [
                                'title', 'Substitutions used',
                                'currently_available_sequences',
                                'Process executed', 'Substitutions explained',
                                'Substitution_sequences_allow',
                                'prefixes_can_be_applied'
                            ].concat(['eval',
                                'pageURL', 'pageTitle', 'pageHTML',
                                'bodyText', 'selectedHTML',
                                'selectedText', 'linkPageURL',
                                'linkPageURLAsNativePath', 'linkPageTitle', 'linkBodyText', 'linkPageHTML', 'imageURL', 'imageDataURL', 'imageDataBinary'
                            ].map(function (key) {
                                    return 'seq_' + key;
                            })).concat([
                                'Sequences', 'Path of executable', 'Browse',
                                'Hard-coded files and URLs',
                                'keep_dialog_open', 'Execute', 'Cancel'
                            ]).concat([
                                'save-temp', 'ucencode-', 'uencode-', 'escquotes-'
                            ].map(function (key) {
                                return 'prefix_' + key;
                            })).reduce(function (locale, key) {
                                locale[key] = _(key);
                                return locale;
                            }, {}),
                            ei_locale: [
                                'browse', 'directory', 'plus', 'minus', 'reveal',
                                'args_num', 'url_num', 'file_num'
                            ].reduce(function (locale, key) {
                                locale[key] = _("expandable_inputs_" + key);
                                return locale;
                            }, {})
                        }
                    });
                    var port = worker.port,
                        on = port.on.bind(port),
                        emit = port.emit.bind(port);

                    // Todo: Allow saving by user
                    emit('executables', getExePaths());
                    emit('temps', getTempPaths());

                    on('autocompleteValues', function (data) {
                        emit('autocompleteValuesResponse', autocompleteValues(data));
                    });
                    on('filePick', function (data) {
                        picker(data, null, filePickerLocale, function (arg1, arg2) {
                            emit(arg1, arg2);
                        });
                        emit('filePickResponse');
                    });
                    on('reveal', function (data) {
                        reveal(data);
                    });
                    on('buttonClick', function (data) {
                        var id = data.id;
                        switch (id) {
                            case 'saveAndClose':
                            case 'cancel':
                                worker.destroy();
                                win.close();
                                break;
                            case 'saveAndExecute':
                            case 'execute':
                                createProcessAtPath(
                                    data.executablePath, // Todo: Apply same substitutions within executable path in case it is dynamic based on selection?
                                    // Todo: handle hard-coded data.files, data.urls, data.dirs; ability to invoke with
                                    //   link to or contents of a sequence of hand-typed (auto-complete drop-down)
                                    //   local files and/or URLs (including option to encode, etc.)
                                    // Todo: If data.dirs shows something is a directory, confirm the supplied path is also (no UI enforcement on this currently)
                                    data.args.map(function (argVal) {
                                        // We use <> for escaping
                                        // since these are disallowed anywhere
                                        // in URLs anywhere (unlike ampersands)
                                        return argVal.replace(
                                            // Todo: Ensure substitutions take place within eval() first
                                            // Todo: Ensure escaping occurs in proper order
                                            /<(save-temp (\s+?:overwrite=yes|no|prompt)?(?:\s+continue=yes|no)?)?(uc?encode-)?(escquotes-)?(?:(eval: [^>]*)|(pageURL)|(pageTitle)|(pageHTML)|(bodyText)|(selectedHTML)|(selectedText)|(linkPageURL)|(linkPageURLAsNativePath)|(linkPageTitle)|(linkBodyText)|(linkPageHTML)|(imageURL)|(imageDataURL)|(imageDataBinary))>/g,
                                            function () {
                                                // ucencode needs encodeURIComponent applied
                                                // For linkPageURLAsNativePath, convert to native path
                                                // Allow eval()
                                                // Todo: Implement save-temp and all arguments
                                                // Retrieve "linkPageTitle", "linkBodyText", or "linkPageHTML" as needed and cache
                                                // Retrieve "imageDataBinary" and "imageDataURL" (available via canvas?) as needed (available from cache?)
                                                // Move ones found to be used here to the top of the list/mark in red/asterisked
                                            }
                                        ).split('').reverse().join('').replace(/(?:<|>)(?!\\)/g, '').split('').reverse().join('').replace(/\\(<|>)/g, '$1');
                                        // Todo: Escape newlines (since allowable with textarea args)?
                                    }),
                                    {
                                        errorHandler: function (err) {
                                            throw (err);
                                        },
                                        observe: function (aSubject, aTopic, data) {
                                            if (aTopic === 'process-finished') {
                                                emit('finished');
                                            }
                                        }
                                    }
                                );
                                break;
                        }
                    });
                });
                tabs.activeTab.url = data.url('one-off.html');
            });
            break;
        case 'prefs':
            // Detachment of panel upon opening in this manner is a bug that is WONT-FIXED
            // since widgets to be deprecated per https://bugzilla.mozilla.org/show_bug.cgi?id=638142
            // prefsWidget.panel.show();
            break;
        }
    }
});


};


exports.onUnload = function () { // reason
};


}());
