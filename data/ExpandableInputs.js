/*globals jml */
/*jslint vars:true*/
/**
* @class ExpandableInputs
* @requires jamilih
*/
var ExpandableInputs = (function (undef) {'use strict';

// DEBUGGING
function l (str) {
	console.log(str);
}

// STATIC VARS
var ns = 0; // Used to prevent conflicts if the user does not supply their own namespace

// POLYFILLS
Array.from = function (arg) {
	return [].slice.call(arg);
};

// UTILITIES

/**
* @static
* @private
*/
function $ (sel) {
	return document.querySelector(sel);
}
/**
* @static
* @private
*/
function $$ (sel) {
	return document.querySelectorAll(sel);
}

/**
* 
* @constructor
* @param {object} cfg Configuration object
* @param {string} cfg.table The ID of the table.
* @param {string} [cfg.prefix="ei-"] Prefix to denote expandable inputs. Should not need to be changed
* @param {string} [cfg.namespace] Namespace for this set
	of expandable inputs. If none is supplied, an incrementing value will be used.
* @param {string} [cfg.label="%s:"] The label to be shown. (See cfg.pattern for the regular expression used to do substitutions.)
* @param {string} [cfg.pattern=/%s/g] The regular expression for finding numbers within labels.
* @param {string} [cfg.inputType="text"] The type for text inputs
* @param {boolean} [cfg.selects=false] Whether to include a select menu for preset file paths or directories
* @param {number} [cfg.inputSize=50] The size for text inputs
* @param {number} [cfg.rows] The number of rows; auto-changes input to a textarea (even if set to 1)
* @param {string} [cfg.locale] A locale. Default to an English locale. (Note that the label property ought to also be localized.)
*/
function ExpandableInputs (cfg) {
	if (!(this instanceof ExpandableInputs)) {
		return new ExpandableInputs(cfg);
	}
	if (!cfg || typeof cfg !== 'object' || !cfg.table) {
		throw 'A config object with a table ID must be supplied to ExpandableInputs';
	}
	this.table = cfg.table;
	this.prefix = ((cfg.prefix && cfg.prefix.replace(/-$/, '')) || 'ei') + '-';
	this.ns = ((cfg.namespace && cfg.namespace.replace(/-$/, '')) || (ns++).toString()) + '-';
	this.label = cfg.label || "%s:";
	this.pattern = cfg.pattern || /%s/g;
	this.inputType = cfg.inputType && cfg.inputType !== 'file' ? cfg.inputType : 'text';
	this.selects = cfg.selects || false;
	this.inputSize = cfg.inputSize || 50;
	if (cfg.rows !== undef) {
		this.rows = cfg.rows;
	}
	this.locale = cfg.locale || {
		browse: "Browse\u2026",
		directory: "Directory?",
		plus: "+",
		minus: "-",
		reveal: "" // We use a background-image of a folder instead of text
	};

	// State variables
	this.fileType = cfg.inputType === 'file';
	this.resetCount();
}

ExpandableInputs.prototype.resetCount = function () {
	this.id = 1;
	this.num = 1;
};

ExpandableInputs.prototype.getLabel = function (num) {
	return this.label.replace(this.pattern, num);
};

ExpandableInputs.prototype.getPrefixedNamespace = function () {
	return this.prefix + this.ns;
};

ExpandableInputs.prototype.remove = function (id) {
	var prefixedNS = this.getPrefixedNamespace(),
		rowIDSel = '#' + prefixedNS + 'row-' + id;
	if ($$('.' + prefixedNS + 'row').length === 1) { // Don't delete if only one remaining
		return true;
	}
	$(rowIDSel).parentNode.removeChild($(rowIDSel));
	// Renumber to ensure inputs remain incrementing by one
	this.num = 1;
	Array.from($$('.' + prefixedNS + 'number')).forEach(function (numHolder) {
		numHolder.replaceChild(document.createTextNode(this.getLabel(this.num++)), numHolder.firstChild);
	}, this);
	return false;
};
ExpandableInputs.prototype.addTableEvent = function () {
	var that = this;
	$('#' + this.table).addEventListener('click', function (e) {
		var dataset = e.target.dataset;
		if (!dataset || !dataset.ei_type) {
			return;
		}
		switch (dataset.ei_type) {
			case 'remove':
				var noneToRemove = that.remove(dataset.ei_id);

				// Allow DOM listening for removal
				if (!noneToRemove) {
					var e = document.createEvent('HTMLEvents');
					e.initEvent('change', true, true);
					$('#' + that.table).dispatchEvent(e);
				}

				break;
			case 'add':
				that.add();
				break;
		}
	});
};

ExpandableInputs.prototype.getValues = function (type) {
	var selector = '.' + this.getPrefixedNamespace() + type;
	return Array.from($$(selector)).map(function (arg) {
		if (arg.type === 'checkbox') {
			return arg.checked;
		}
		return arg.value;
	});
};
ExpandableInputs.prototype.getTextValues = function () {
	return this.getValues('input');
};

ExpandableInputs.prototype.setValues = function (type, storage) {
	// We could simplify this by allowing add() to take an initial value
	var prefixedNS = this.getPrefixedNamespace();
	var selector = '.' + prefixedNS + type;
	storage = storage || [];
	if (Array.from($$(selector)).length !== storage.length) { // Don't remove if already the right number
		Array.from($$('.' + prefixedNS + 'row')).forEach(function (row) {
			row.parentNode.removeChild(row);
		});
		this.resetCount();
		if (!storage.length) {
			this.add();
			return;
		}
		storage.forEach(function () {
			this.add();
		}, this);
	}

	Array.from($$(selector)).forEach(function (arg, i) {
		var data = storage[i];
		if (arg.type === 'checkbox') {
			arg.checked = data || false;
		}
		else {
			arg.value = data || '';
		}
	});
};

ExpandableInputs.prototype.setTextValues = function (storage) {
	return this.setValues('input', storage);
};


ExpandableInputs.prototype.add = function () {
	var that = this,
		prefixedNS = this.getPrefixedNamespace();
	if (!this.tableEventAdded) {
		this.addTableEvent();
		this.tableEventAdded = true;
	}
	$('#' + this.table).appendChild(jml(
		'tr', {
			'id': prefixedNS + 'row-' + this.id,
			'class': prefixedNS + 'row'
		}, [
				['td', [
					['label', {
						'for': prefixedNS + 'input-' + this.id,
						'class': prefixedNS + 'number'
					}, [this.getLabel(this.num)]]
				]],
				['td', [
					(this.fileType && this.selects ?
						($$('.' + prefixedNS + 'presets').length > 0 ?
							(function () {
								var select = $('.' + prefixedNS + 'presets').cloneNode(true);
								select.id = prefixedNS + 'select-' + that.id;
								select.dataset.ei_sel = '#' + prefixedNS + 'input-' + that.id;
								return select;
							}()) :
							['select', {
								id: prefixedNS + 'select-' + this.id,
								'class': prefixedNS + 'presets',
								dataset: {ei_sel: '#' + prefixedNS + 'input-' + this.id}
							}]
						) :
						''
					),
					[(this.hasOwnProperty('rows') ? 'textarea' : 'input'), (function () {
						var atts = {
							id: prefixedNS + 'input-' + that.id,
							'class': prefixedNS + 'input ' + prefixedNS + 'path'
						};
						if (that.hasOwnProperty('rows')) { // textarea
							atts.cols = that.inputSize;
							atts.rows = that.rows;
						}
						else { // input
							atts.size = that.inputSize;
							atts.type = that.inputType;
							atts.value = '';
						}
						if (that.fileType) {
							atts.list = prefixedNS + 'fileDatalist-' + that.id;
							atts.autocomplete = 'off';
						}
						return atts;
					}())],
					(this.fileType ?
						{'#': [
							['datalist', {id: prefixedNS + 'fileDatalist-' + this.id}],
							['input', {
								type: 'button',
								'class': prefixedNS + 'picker',
								dataset: {
									ei_sel: '#' + prefixedNS + 'input-' + this.id,
									ei_directory: '#' + prefixedNS + 'directory' + this.id
								},
								value: this.locale.browse
							}],
							['input', {type: 'button', 'class': prefixedNS + 'revealButton', value: this.locale.reveal, dataset: {ei_sel: '#' + prefixedNS + 'input-' + this.id}}],
							['label', [
								['input', {
									id: prefixedNS + 'directory' + this.id,
									type: 'checkbox',
									'class': prefixedNS + 'directory'
								}],
								this.locale.directory
							]]
						]} :
						''
					)
				]],
				['td', [
					['button', {
						'class': prefixedNS + 'add',
						dataset: {ei_type: 'add'}
					}, [this.locale.plus]]
				]],
				['td', [
					['button', {
						'class': prefixedNS + 'remove',
						dataset: {ei_id: this.id, ei_type: 'remove'}
					}, [this.locale.minus]]
				]]
			], null
		)
	);
	this.id++;
	this.num++;
};

return ExpandableInputs;

}());
