/*globals jml */

/**
* @class ExpandableInputs
* @requires jamilih
*/
var ExpandableInputs = (function () {'use strict';

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
* @param {number} [cfg.inputSize=50] The size for text inputs
*/
function ExpandableInputs (cfg) {
    if (!(this instanceof ExpandableInputs)) {
        return new ExpandableInputs(cfg);
    }
    if (!cfg || typeof cfg !== 'object' || !cfg.table) {
        throw "A config object with a table ID must be supplied to ExpandableInputs";
    }
    this.table = cfg.table;
    this.prefix = ((cfg.prefix && cfg.prefix.replace(/-$/, '')) || 'ei') + '-';
    this.ns = ((cfg.namespace && cfg.namespace.replace(/-$/, '')) || (ns++).toString()) + '-';
    this.label = cfg.label || '%s:';
    this.pattern = cfg.pattern || /%s/g;
    this.inputType = cfg.inputType && cfg.inputType !== 'file' ? cfg.inputType : 'text';
    this.inputSize = cfg.inputSize || 50;

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
                    (this.fileType ?
                        ($$('.temps').length > 0 ?
                            (function () {
                                var select = $('.temps').cloneNode(true);
                                select.id = prefixedNS + 'select-' + that.id;
                                select.dataset.sel = '#' + prefixedNS + 'input-' + that.id;
                                return select;
                            }()) :
                            ['select', {
                                id: prefixedNS + 'select-' + this.id,
                                'class': 'temps executable',
                                dataset: {sel: '#' + prefixedNS + 'input-' + this.id}
                            }]
                        ) :
                        ''
                    ),
                    ['input', (function () {
                        var atts = {
                            id: prefixedNS + 'input-' + that.id,
                            type: that.inputType,
                            'class': prefixedNS + 'input ' + prefixedNS + 'path',
                            size: that.inputSize,
                            value: ''
                        };
                        if (that.fileType) {
                            atts.list = prefixedNS + 'tempDatalist-' + that.id;
                            atts.autocomplete = 'off';
                        }
                        return atts;
                    }())],
                    // Todo: resolve any issues with fragments and Jamilih and use here to reduce following code checks
                    (this.fileType ?
                        ['datalist', {id: prefixedNS + 'tempDatalist-' + this.id}] :
                        ''
                    ),
                    (this.fileType ?
                        ['input', {
                            type: 'button',
                            'class': 'tempPick picker',
                            dataset: {
                                sel: '#' + prefixedNS + 'input-' + this.id,
                                select: {folder: 'true'}
                            },
                            value: 'Browse\u2026'
                        }] :
                        ''
                    ),
                    (this.fileType ?
                        ['input', {type: 'button', 'class': 'revealButton', dataset: {sel: '#' + prefixedNS + 'input-' + this.id}}] :
                        ''
                    ),
                    (this.fileType ?
                        ['label', [' ', ['input', {type: 'checkbox'}], 'Directory?']] :
                        ''
                    )
                ]],
                ['td', [
                    ['button', {
                        'class': prefixedNS + 'add'
                    }, ['+']]
                ]],
                ['td', [
                    ['button', {
                        'class': prefixedNS + 'remove',
                        dataset: {id: this.id}
                    }, ['-']]
                ]]
            ], null
        )
    );
    this.id++;
    this.num++;
};

return ExpandableInputs;

}());
