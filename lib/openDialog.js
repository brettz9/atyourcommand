/*globals module, require */
/*jslint vars: true */

(function () {'use strict';

function l (msg) {
	console.log(msg);
}

var winUtils = require('sdk/window/utils'),
	tabs = require('sdk/tabs'),
	data = require('sdk/self').data;

function mapify (f) {
	return function (map) {
		if (typeof map === 'string') {
			return f.apply(null, arguments);
		}
		var evt;
		for (evt in map) {
			if (map.hasOwnProperty(evt)) {
				f(evt, map[evt]);
			}
		}
	};
}
	
function openDialog (opts) {
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
		}).join() + ',outerWidth=' + (opts.outerWidth || 1180) + ', outerHeight=' + (opts.outerHeight || 670),
		name: opts.name
		// parent: 
		// args: 
	});
	win.addEventListener('load', function () {
		tabs.activeTab.on('ready', function (tab) {
			var contentScript = {};
			contentScript.contentScriptFile = opts.contentScript.files.map(function (script) {
				return data.url(script);
			});
			contentScript.contentScriptWhen = opts.contentScript.when;
			contentScript.contentScriptOptions = opts.contentScript.options;
			contentScript.contentStyleFile =opts.contentStyleFile;
			contentScript.contentStyle =opts.contentStyle;

			var worker = tab.attach(contentScript);
			var port = worker.port,
				on = port.on.bind(port),
				emit = port.emit.bind(port),
				onMap = mapify(on),
				emitMap = mapify(emit);

			opts.ready(worker, onMap, emitMap); // pass tab, port?
		});
		tabs.activeTab.url = data.url(opts.dataURL);
	});
	return win;
}

module.exports = openDialog;

}());
