/*globals jml */

/**
* @class ExpandableInputs
* @requires jamilih
*/
var ExpandableInputs = (function (undef) {'use strict';

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
	this.id = 1;
	this.num = 1;
}

ExpandableInputs.prototype.getLabel = function (num) {
	return this.label.replace(this.pattern, num);
};

ExpandableInputs.prototype.getPrefixedNamespace = function () {
	return this.prefix + this.ns;
};

ExpandableInputs.prototype.remove = function (id) {
	var prefixedNS = this.getPrefixedNamespace(),
		that = this,
		rowIDSel = '#' + prefixedNS + 'row-' + id;
	if ($$('.' + prefixedNS + 'row').length === 1) { // Don't delete if only one remaining
		return;
	}
	$(rowIDSel).parentNode.removeChild($(rowIDSel));
	// Renumber to ensure inputs remain incrementing by one
	this.num = 1;
	Array.from($$('.' + prefixedNS + 'number')).forEach(function (numHolder) {
		numHolder.replaceChild(document.createTextNode(that.getLabel(that.num++)), numHolder.firstChild);
	});
};

ExpandableInputs.prototype.add = function () {
	var that = this,
		prefixedNS = this.getPrefixedNamespace();
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
								select.dataset.sel = '#' + prefixedNS + 'input-' + that.id;
								return select;
							}()) :
							['select', {
								id: prefixedNS + 'select-' + this.id,
								'class': prefixedNS + 'presets',
								dataset: {sel: '#' + prefixedNS + 'input-' + this.id}
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
						// Todo: resolve any issues with fragments and Jamilih and use here to reduce need for jml() call here
						jml(
							'datalist', {id: prefixedNS + 'fileDatalist-' + this.id},
							'input', {
								type: 'button',
								'class': prefixedNS + 'picker',
								dataset: {
									sel: '#' + prefixedNS + 'input-' + this.id,
									directory: '#' + prefixedNS + 'directory' + this.id
								},
								value: this.locale.browse
							},
							'input', {type: 'button', 'class': prefixedNS + 'revealButton', value: this.locale.reveal, dataset: {sel: '#' + prefixedNS + 'input-' + this.id}},
							'label', [
								['input', {
									id: prefixedNS + 'directory' + this.id,
									type: 'checkbox',
									'class': prefixedNS + 'directory'
								}],
								this.locale.directory
							],
							null
						) :
						''
					)
				]],
				['td', [
					['button', {
						'class': prefixedNS + 'add'
					}, [this.locale.plus]]
				]],
				['td', [
					['button', {
						'class': prefixedNS + 'remove',
						dataset: {id: this.id}
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
