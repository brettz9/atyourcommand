/*globals exports, require */
/*jslint vars: true, todo:true*/
(function () {'use strict';

function l (msg) {
	console.log(msg);
}

var
	_ = require('sdk/l10n').get,
	XRegExp = require('./node_modules/xregexp/xregexp-all').XRegExp,
	data = require('sdk/self').data,
	cm = require('sdk/context-menu'),
	openDialog = require('./openDialog'),
	fileHelpers = require('./fileHelpers'), getExePaths = fileHelpers.getExePaths, getTempPaths = fileHelpers.getTempPaths, autocompleteValues = fileHelpers.autocompleteValues, picker = fileHelpers.picker, reveal = fileHelpers.reveal;	
	// ,windows = require('sdk/windows').browserWindows;

exports.main = function () {

// Open context menu with a specific command line, a new command line, or prefs
// Todo: Also support text selection, URL, image, and custom context(s)

cm.Menu({
	label: _("At Your Command"),
	context: cm.PageContext(),
	contentScriptFile: data.url('main-context-menu.js'),
	items: [
		// cm.Item({label: 'Open in WebAppFind edit mode', data: ''}), // Todo: Put this into default storage
		// Todo: invite (or utilize?) sharing of i18n with AppLauncher
		cm.Item({label: _("Send a one-off command"), data: 'one-off'}),
		cm.Item({label: _("Commands"), data: 'commands'})
		// cm.Item({label: _("Open preferences"), data: 'prefs'})
	],
	onMessage: function (e) {
		var win;
		var itemType = e.type;
		switch (itemType) {
		case 'one-off':
			win = openDialog({
				name: _("One-off"),
				dataURL: 'one-off.html',
				contentScript: {
					files: ['node_modules/jamilih/jml.js', 'ExpandableInputs.js', 'one-off.js'],
					when: 'ready',
					options: { // any JSON-serializable key/values
						folderImage: data.url('Yellow_folder_icon_open.png'),
						// Todo: Find way to parse locale file and pass to remove need for all of these?
						locale: [
							'title', 'lt', 'gt', 'create_new_command', 'Substitutions used',
							'if_present_command_saved', 'Command name',
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
				},
				ready: function (worker, on, emit) {
					// Todo: Allow saving by user
					on({
						autocompleteValues: function (data) {
							emit('autocompleteValuesResponse', autocompleteValues(data));
						},
						filePick: function (data) {
							picker(data, null, ['pickFolder', 'pickFile'].reduce(function (locale, key) {
									locale[key] = _("filepicker_" + key);
									return locale;
								}, {}),
								function (arg1, arg2) {
									emit(arg1, arg2);
								}
							);
							emit('filePickResponse');
						},
						reveal: function (data) {
							reveal(data);
						},
						buttonClick: function (data) {
							var id = data.id;
							switch (id) {
								case 'saveAndClose':
								case 'cancel':
									worker.destroy();
									win.close();
									break;
								case 'saveAndExecute':
								case 'execute':
								/*
									createProcessAtPath(
										data.executablePath, // Todo: Apply same substitutions within executable path in case it is dynamic based on selection?
										// Todo: handle hard-coded data.files, data.urls, data.dirs; ability to invoke with
										//   link to or contents of a sequence of hand-typed (auto-complete drop-down)
										//   local files and/or URLs (including option to encode, etc.)
										// Todo: If data.dirs shows something is a directory, confirm the supplied path is also (no UI enforcement on this currently)
								*/
								l(
										data.args.map(function (argVal) {
											// We use <> for escaping
											// since these are disallowed anywhere
											// in URLs (unlike ampersands)
											
											return XRegExp.replace(
												argVal,
												// Begin special syntax
												new XRegExp('<' +
													// saveTemp with its options
													'(?:(?<saveTemp>save-temp)' +
														'(\\s+?:overwrite=(?<overwrite>yes|no|prompt))?' +
														'(?:\\s+continue=(?<cont>yes|no))?' +
													'\\s+)?' +
													// Encoding
													'(?:(?<ucencode>ucencode-)|(?<uencode>uencode-))?' +
													// Escaping
													'(?<escquotes>escquotes-)?' +
													// Begin main grouping
													'(?:' +
														// Eval with body
														'(?:eval: (?<evl>[^>]*))|' +
														// Other flags
														([
															'pageURL', 'pageTitle', 'pageHTML',
															'bodyText', 'selectedHTML', 'selectedText',
															'linkPageURL', 'linkPageURLAsNativePath',
															'linkPageTitle', 'linkBodyText', 'linkPageHTML',
															'imageURL', 'imageDataURL', 'imageDataBinary'
														].reduce(function (str, key) {
															return str + '|(?<' + XRegExp.escape(key) + '>' + XRegExp.escape(key) + ')';
														}, '').slice(1)) +
													// End the main grouping
													')' +
												// End special syntax
												'>'),
												function (arg) {
													if (arg.saveTemp) {
														// arg.overwrite
														// arg.cont
													}
													/*
													arg.ucencode
													arg.uencode
													arg.escquotes
													arg.evl
													arg.pageURL
													arg.pageTitle
													arg.pageHTML
													arg.bodyText
													arg.selectedHTML
													arg.selectedText
													arg.linkPageURL
													arg.linkPageURLAsNativePath
													arg.linkPageTitle
													arg.linkBodyText
													arg.linkPageHTML
													arg.imageURL
													arg.imageDataURL
													arg.imageDataBinary
													*/
													// Todo: Ensure substitutions take place within eval() first
													// Todo: Ensure escaping occurs in proper order
													// ucencode needs encodeURIComponent applied
													// For linkPageURLAsNativePath, convert to native path
													// Allow eval()
													// Todo: Implement save-temp and all arguments
													// Retrieve "linkPageTitle", "linkBodyText", or "linkPageHTML" as needed and cache
													// Retrieve "imageDataBinary" and "imageDataURL" (available via canvas?) as needed (available from cache?)
													// Move ones found to be used here to the top of the list/mark in red/asterisked
												},
												'all'
											// Todo: Escape newlines (since allowable with textarea args)?
											).split('').reverse().join('').replace(/(?:<|>)(?!\\)/g, '').split('').reverse().join('').replace(/\\(<|>)/g, '$1');
										})
										/*
										,
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
									*/
									);
									break;
							}
						}
					});
					emit({
						executables: getExePaths(),
						temps: getTempPaths()
					});
				}
			});
			break;
		case 'commands':
			win = openDialog({
				name: _("Commands"),
				dataURL: 'commands.html',
				contentScript: {
					files: ['commands.js'],
					when: 'ready',
					options: {
						
					}
				},
				ready: function (worker, on, emit) {
					
				}
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
