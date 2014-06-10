/*globals ExpandableInputs, self, jml, $ */
/*jslint vars:true, todo:true, browser:true, devel:true */
var $J = $;
$.noConflict();
(function () {'use strict';

var
	currentName = '', optionData = {},
	createNewCommand = true,
	changed = false,
	nameChanged = false,
	emit = self.port.emit,
	on = self.port.on,
	options = self.options,
	locale = options.locale,
	oldStorage = options.oldStorage,
	ei_locale = options.ei_locale,
	inputs = {
		args: new ExpandableInputs({
			locale: ei_locale,
			table: 'executableTable',
			namespace: 'args',
			label: ei_locale.args_num,
			inputSize: 60,
			rows: 1 // Might perhaps make this optional to save space, but this triggers creation of a textarea so args could be more readable (since to auto-escape newlines as needed)
		}),
		urls: new ExpandableInputs({
			locale: ei_locale,
			table: 'URLArguments',
			namespace: 'urls',
			label: ei_locale.url_num,
			inputSize: 40,
			inputType: 'url'
		}),
		files: new ExpandableInputs({
			locale: ei_locale,
			table: 'fileArguments',
			namespace: 'files',
			label: ei_locale.file_num,
			inputSize: 25,
			inputType: 'file',
			selects: true
		})
	};

// POLYFILLS
Array.from = function (arg) {
	return [].slice.call(arg);
};

// UTILITIES
function l (msg) {
	console.log(msg);
}
function $ (sel) {
	return document.querySelector(sel);
}
function $$ (sel) {
	return document.querySelectorAll(sel);
}
function forSel (sel, cb) {
	Array.from($$(sel)).forEach(cb);
}
function _ (key) {
	return locale[key] || '(Non-internationalized string--FIXME!)' + key;
}



function addOptions (type) {
	var paths = optionData[type].paths,
		sel = type === 'executables' ? '#' + type : '.ei-files-presets',
		selects = $$(sel);

	Array.from(selects).forEach(function (select) {
		while (select.firstChild) {
			select.removeChild(select.firstChild);
		}

		paths.forEach(function (pathInfo) {
			var option = document.createElement('option');
			option.text = pathInfo[0];
			option.value = pathInfo[1];
			select.appendChild(option);
		});
		if (type === 'temps') {
			setSelectOfValue(select, $('#' + select.id.replace('-select-', '-input-')).value);
		}
	});
}

function handleOptions (data) {
	optionData[data.type] = data;
	addOptions(data.type);
}

function setSelectOfValue(sel, val) {
	var names = typeof sel === 'string' ? $(sel) : sel;
	var idx = Array.from(names.options).findIndex(function (option) {
		return option.value === val;
	});
	names.selectedIndex = idx === -1 ? 0 : idx;
}

function resetChanges () {
	changed = false;
	nameChanged = false;
}

function populateEmptyForm () {
	$('#selectNames').selectedIndex = 0; // Unlike populateFormWithStorage, we will always need to set the name
	$('#executablePath').focus();

	createNewCommand = true;
	currentName = '';
	$('#delete').style.display = 'none';
	
	$('#command-name').value = '';
	$('#command-name').defaultValue = '';

	$('#executables').selectedIndex = 0;
	$('#executablePath').value = '';

	['args', 'urls', 'files'].forEach(function (inputType) {
		inputs[inputType].setTextValues();
	});
	inputs.files.setValues('directory');
	addOptions('temps'); // Todo: make a way for the select to be populated through the ExpandableInputs API
	resetChanges();
}

function populateFormWithStorage (name) {
	createNewCommand = false;
	currentName = name;
	$('#delete').style.display = 'inline';
	
	$('#command-name').value = name;
	$('#command-name').defaultValue = name;

	var executablePath = oldStorage[currentName].executablePath;
	setSelectOfValue('#executables', executablePath);
	$('#executablePath').value = executablePath;

	['args', 'urls', 'files'].forEach(function (inputType) {
		inputs[inputType].setTextValues(oldStorage[currentName][inputType]);
	});
	inputs.files.setValues('directory', oldStorage[currentName].dirs);
	addOptions('temps'); // Todo: make a way for the select to be populated through the ExpandableInputs API
	resetChanges();
}

function fileOrDirResult (data) {
	var path = data.path,
		selector = data.selector;
	if (path) {
		$(selector).value = path;
	}
}



function rebuildCommandList () {
	while ($('#selectNames').firstChild) {
		$('#selectNames').removeChild($('#selectNames').firstChild);
	}

	jml({'#': Object.keys(oldStorage).sort().reduce(
		function (opts, commandName) {
			opts.push(['option', [commandName]]);
			return opts;
		},
		[
			['option', {value: '', selected: 'selected'}, [_("create_new_command")]]
		]
	)}, $('#selectNames'));
}

function finished () {
	$('#processExecuted').style.display = 'block';
	if (!$('#keepOpen').checked) {
		emit('buttonClick', {id: 'cancel'});
	}
	else {
		setTimeout(function () {
			$('#processExecuted').style.display = 'none';
		}, 2000);
	}
}
function newStorage (data) {
	oldStorage = data.commands;
	rebuildCommandList();
	setSelectOfValue('#selectNames', data.name);
	populateFormWithStorage(data.name); // Important to update other flags even if just changed, so convenient to just re-run
}
function removeStorage (data) {
	oldStorage = data.commands;
	rebuildCommandList();
	if (!data.keepForm) {
		populateEmptyForm();
	}
}


// ADD INITIAL CONTENT

document.title = _("title");
jml('div', [
	['div', (function (options) {
		var atts = {id: 'names'};
		if (options.itemType === 'one-off') {
			atts.hidden = true;
		}
		return atts;
	}(options)), [
		['select', {id: 'selectNames', size: 39, $on: {click: function (e) {
			if (changed) {
				var abandonUnsaved = confirm(_("have_unsaved_changes"));
				if (!abandonUnsaved) {
					setSelectOfValue('#selectNames', currentName);
					return;
				}
			}
			var name = e.target.value;
			if (name === '') { // Create new command
				populateEmptyForm();
			}
			else {
				populateFormWithStorage(name);
			}
		}}}
	]]],
	['div', (function (options) {
		var atts = {id: 'main', $on: {change: function (e) {
			changed = true;
			if (e.target.id === 'command-name') {
				nameChanged = true;
			}
		}}};
		atts.className = options.itemType === 'one-off' ? 'closed' : 'open';
		return atts;
	}(options)), [
		['button', {id: 'showNames', $on: {click: function () {
			$('#names').hidden = !$('#names').hidden;
			var showNames = $('#showNames');
			if (!$('#names').hidden) {
				$('#main').className = 'open';
				showNames.replaceChild(document.createTextNode(_("lt")), showNames.firstChild);
			}
			else {
				$('#main').className = 'closed';
				showNames.replaceChild(document.createTextNode(_("gt")), showNames.firstChild);
			}
		}}}, [
			_(options.itemType === 'one-off' ? "gt" : "lt")
		]],
		['div', {id: 'processExecuted', style: 'display:none;'}, [
			_("Process executed")
		]],
		['br'],
		['div', {id: 'substitutions-explanation-container'}, [
			['h3', [_("Substitutions explained")]],
			['div', {id: 'substitutions-explanation'}, [
				_("Substitution_sequences_allow"),
				['br'],['br'],
				_("prefixes_can_be_applied"),
				['dl', [
						'save-temp', 'ucencode-', 'uencode-', 'escquotes-'
					].reduce(function (children, prefix) {
						children.push(['dt', [prefix]]);
						children.push(['dd', [_("prefix_" + prefix)]]);
						return children;
					}, [])
				],
				['b', [_("Sequences")]],
				['dl', [
						'eval', 'pageURL', 'pageTitle', 'pageHTML', 'bodyText',
						'selectedHTML', 'selectedText', 'linkPageURL',
						'linkPageURLAsNativePath', 'linkPageTitle',
						'linkBodyText', 'linkPageHTML', 'imageURL',
						'imageDataURL', 'imageDataBinary'
					].reduce(function (children, seq) {
						children.push(['dt', [seq]]);
						children.push(['dd', [_("seq_" + seq)]]);
						return children;
					}, [])
				]
			]]
		]],
		['div', {id: 'substitutions-used-container'}, [
			['h3', [_("Substitutions used")]],
			['div', {id: 'substitutions-used'}, [
				_("currently_available_sequences"),
				['br'],['br'],
				/*
				['dl', [
					['dt', ['save-temp-']], ['dd'],
					['dt', ['ucencode-']], ['dd'],
					['dt', ['uencode-']], ['dd'],
					['dt', ['escquotes-']], ['dd'],
				]],
				*/
				['b', [_("Sequences")]],
				['dl', [
						'eval', 'pageURL', 'pageTitle', 'pageHTML', 'bodyText',
						'selectedHTML', 'selectedText', 'linkPageURL',
						'linkPageURLAsNativePath', 'linkPageTitle',
						'linkBodyText', 'linkPageHTML', 'imageURL',
						'imageDataURL', 'imageDataBinary'
					].reduce(function (children, seq) {
						children.push(['dt', [seq]]);
						children.push(['dd']);
						return children;
					}, [])
				]
			]]
		]],
		['div', {id: 'command-name-section'}, [
			['label', {title: _("if_present_command_saved")}, [
				_("Command name") + ' ',
				['input', (function (options) {
					var atts = {id: 'command-name', size: '35'};
					if (options.itemType === 'commands') {
						atts.autofocus = 'autofocus';
					}
					return atts;
				}(options))]
			]],
			['br'],
			['label', [
				_("Restrict contexts") + ' ',
				['select', {multiple: 'multiple', id: 'restrict-contexts', $on: {click: function (e) {
					// Not sure why we're losing focus or the click event is going through here but not in my multiple-select demo
					// ms.focus();
					e.stopPropagation();
				}}}, [
				
				/*
				// 'a', (or tags like images inside of links or anchors)
				// 'abbr', 'acronym', 'address', 'b', 'bdi', 'bdo', 'big', 'blink', 'cite', 'code', 'data', 'del', 'dfn', 'em', 'figcaption', 'figure', 'font', 'i', 'ins', 'kbd', 'label', 'legend', 'mark', 'nobr', 'output', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'tt', 'u', 'var', 
				// 'time', 
				// 'br', 'hr', 'spacer', 'wbr',
				// 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'nav', 
				// 'article', 'aside', 'blockquote', 'body', 'center', 'dialog', 'details', 'div', 'fieldset', 'footer', 'listing', 'main', 'marquee', 'p', 'plaintext', 'pre', 'section', 'summary', 'xmp'
				// 'ol', 'dl', 'dt', 'dd', 'dir', 'li', 'ul', 
				// 'caption', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'col', 'colgroup', 
				// 'video', 'audio', 'bgsound', 'source',
				// 'form', 'isindex', 'input', 'keygen', 'button', 'meter', 'optgroup', 'option', 'progress', 'select', 'textarea', 'menu', 'menuitem',
				// 'frame', 'frameset', 'iframe', 
				// 'noframes', 'noscript',
				// 'DOCTYPE', comments, procesing instructions, CDATA, 'html', 'head', 'meta' (also within body), 'title', 'base', 
				// 'style', 'link', 'script', 'datalist', 'track', 'basefont', 
				// 'content', 'decorator', 'element', 'shadow', 'template', 
				// 'img', 'map', 'area', 'canvas', 
				// 'object', 'applet', 'embed', 'param', 
				*/
				
					['option', ['text']],
					['optgroup', {label: _("Images")}, [
						['option', ['canvas']],
						['option', ['img']]
					]]
				]]
			]],
			' ' + _("or") + ' ',
			['label', [
				_("Specify your own context") + ' ',
				['input', {id: 'own-context', placeholder: 'a[href],img[src]'}]
			]]
		]],
		['table', [
			/*
			['tr', [
				['td', [
					['label', [_("Label:")]]
				]],
				['td', [
					['input', {id: 'label'}]
				]]
			]]
			*/
			['tr', [
				['td', [
					['label', {'for': 'executablePath'}, [_("Path of executable")]]
				]],
				['td', [
					['select', {id: 'executables', 'class': 'ei-exe-presets', dataset: {ei_sel: '#executablePath'}}],
					['input', {
						type: 'text', size: '55', id: 'executablePath', 'class': 'ei-exe-path',
						list: 'datalist', autocomplete: 'off', value: '', required:'required'
					}],
					['input', {type: 'button', id: 'executablePick', 'class': 'ei-exe-picker', dataset: {ei_sel: '#executablePath', 'ei_default-extension': 'exe'}, value: _("Browse")}],
					['datalist', {id: 'datalist'}],
					['input', {type: 'button', 'class': 'ei-exe-revealButton', dataset: {ei_sel: '#executablePath'}}]
				]]
			]]
		]],
		['div', {id: 'executableTableContainer'}, [
			['table', {id: 'executableTable'}]
		]],
		['div', {id: 'fileAndURLArgumentContainer'}, [
			['b', [_("Hard-coded files and URLs")]],
			['br'],
			['table', {id: 'fileArguments'}],
			['table', {id: 'URLArguments'}]
		]],
		['br'],
		['div', {'class': 'focus'}, [
			['label', [_("keep_dialog_open"), ['input', {type: 'checkbox', id: 'keepOpen'}]]],
			['br'],
			['button', {'class': 'passData save'}, [_("Save")]],
			['button', {id: 'delete', 'class': 'passData delete', hidden: true}, [_("Delete")]],
			// ['br'],
			['button', {'class': 'passData execute'}, [_("Execute")]],
			['button', {id: 'cancel'}, [_("Cancel")]]
		]]
	]]
], $('body'));

// ADD EVENTS

var ms = $J('#restrict-contexts').multipleSelect({filter: true, filterAcceptOnEnter: true, width: '150'});

$('body').addEventListener('click', function (e) {
	var val, sel, selVal,
		target = e.target,
		dataset = target.dataset || {},
		cl = target.classList;

	if (cl.contains('ei-files-presets') || (target.parentNode && target.parentNode.classList.contains('ei-files-presets')) ||
		cl.contains('ei-exe-presets') || (target.parentNode && target.parentNode.classList.contains('ei-exe-presets'))) {
		val = target.value;
		if (!val) {
			return;
		}
		sel = dataset.ei_sel || (target.parentNode && target.parentNode.dataset.ei_sel);
		if (sel) {
			$(sel).value = val;
		}
	}
	else if (cl.contains('ei-files-picker') || cl.contains('ei-exe-picker')) {
		sel = dataset.ei_sel;
		emit('filePick', {
			dirPath: $(sel).value,
			selector: sel,
			defaultExtension: dataset.ei_defaultExtension || undefined,
			selectFolder: ($(dataset.ei_directory) && $(dataset.ei_directory).checked) ? true : undefined
		});
	}
	else if (cl.contains('ei-files-revealButton') || cl.contains('ei-exe-revealButton')) {
		sel = dataset.ei_sel;
		selVal = sel && $(sel).value;
		if (selVal) {
			emit('reveal', selVal);
		}
	}
	else if (e.target.id === 'cancel') {
		emit('buttonClick', {close: true});
	}
	else if (cl.contains('passData')) {
		var name = $('#command-name').value;
		if (cl.contains('delete')) {
			var ok = confirm(_("sure_wish_delete"));
			if (ok) {
				emit('buttonClick', {name: name, remove: true});
			}
			return;
		}
		if (cl.contains('save')) {
			if (!name) {
				alert(_("supply_name"));
				return;
			}
			if (nameChanged) {
				if (oldStorage[name]) {
					var overwrite = confirm(_("name_already_exists_overwrite"));
					if (!overwrite) {
						return;
					}
				}
				else if (!createNewCommand) {
					var renameInsteadOfNew = confirm(_("have_unsaved_name_change"));
					if (!renameInsteadOfNew) { // User wishes to create a new record (or cancel)
						$('#selectNames').selectedIndex = 0;
						nameChanged = false;
						return; // Return so that user has some way of correcting or avoiding (without renaming)
					}
				}
				// Proceed with rename, so first delete old value (todo: could ensure first added)
				emit('buttonClick', {name: $('#command-name').defaultValue, remove: true, keepForm: true});
			}
			else if (!changed && !cl.contains('execute')) {
				alert(_("no_changes_to_save"));
				return;
			}
		}
		var data = {
			name: name,
			storage: {
				executablePath: $('#executablePath').value,
				args: inputs.args.getTextValues(),
				files: inputs.files.getTextValues(),
				urls: inputs.urls.getTextValues(),
				dirs: inputs.files.getValues('directory')
			}
		};
		if (cl.contains('execute')) {
			data.execute = true;
		}
		emit('buttonClick', data);
	}
});

$('body').addEventListener('input', function (e) {
	var target = e.target, val = e.target.value;
	if (target.classList.contains('ei-files-path') || target.classList.contains('ei-exe-path')) {
		emit('autocompleteValues', {
			value: val,
			listID: target.getAttribute('list')
		});
	}
});

// COPIED FROM filebrowser-enhanced directoryMod.js (RETURN ALL MODIFICATIONS THERE)
on('autocompleteValuesResponse', function (data) {
	var datalist = document.getElementById(data.listID);
	while (datalist.firstChild) {
		datalist.removeChild(datalist.firstChild);
	}
	data.optValues.forEach(function (optValue) {
		var option = jml('option', {
			// text: optValue,
			value: optValue
		});
		datalist.appendChild(option);
	});
});


on('finished', finished);
on('filePickResult', fileOrDirResult);
on('executables', handleOptions);
on('temps', handleOptions);
on('newStorage', newStorage);
on('removeStorage', removeStorage);

// INITIAL BEHAVIORS

// Insert this as a class, so it works for others inserted into doc
$('#dynamicStyleRules').sheet.insertRule(
	'.ei-files-revealButton, .ei-exe-revealButton {background-image: url("' + options.folderImage + '");}', 0
);

rebuildCommandList();

// Todo: For prefs when prev. values stored, call multiple times and populate and reduce when not used
['args', 'urls', 'files'].forEach(function (inputType) {
	inputs[inputType].add();
});

}());
