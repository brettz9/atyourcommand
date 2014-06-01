/*globals ExpandableInputs, self, jml */
/*jslint todo:true*/
(function () {'use strict';

var
    emit = self.port.emit,
    on = self.port.on,
    options = self.options,
    locale = options.locale,
    ei_locale = options.ei_locale,
    args = new ExpandableInputs({
        locale: ei_locale,
        table: 'executableTable',
        namespace: 'args',
        label: ei_locale.args_num,
        inputSize: 60,
        rows: 1 // Might perhaps make this optional to save space, but this triggers creation of a textarea so args could be more readable (since to auto-escape newlines as needed)
    }),
    urls = new ExpandableInputs({
        locale: ei_locale,
        table: 'URLArguments',
        namespace: 'urls',
        label: ei_locale.url_num,
        inputSize: 40,
        inputType: 'url'
    }),
    files = new ExpandableInputs({
        locale: ei_locale,
        table: 'fileArguments',
        namespace: 'files',
        label: ei_locale.file_num,
        inputSize: 25,
        inputType: 'file',
        selects: true
    });

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
    return locale[key] || '(Non-internationalized string--FIXME!)';
}

// ADD EVENTS

document.title = _("title");
jml('div', [
    ['div', {id: 'processExecuted', style: 'visibility:hidden;'}, [
        _("Process executed")
    ]],
    ['div', {id: 'substitutions-explanation-container'}, [
        ['h3', [_("Substitutions explained")]],
        ['div', {id: 'substitutions-explanation'}, [
            _("Substitution_sequences_allow"),
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
                ['select', {id: 'executables', 'class': 'ei-exe-presets', dataset: {sel: '#executablePath'}}],
                ['input', {type: 'text', size: '55', id: 'executablePath', 'class': 'ei-exe-path', list: 'datalist', autocomplete: 'off', value: '', required:'required'}],
                ['input', {type: 'button', id: 'executablePick', 'class': 'ei-exe-picker', dataset: {sel: '#executablePath', 'default-extension': 'exe'}, value: _("Browse")}],
                ['datalist', {id: 'datalist'}],
                ['input', {type: 'button', 'class': 'ei-exe-revealButton', dataset: {sel: '#executablePath'}}]
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
        /*
        ['button', {id: 'saveAndExecute'}, [_("Save and execute")]],
        ['button', {id: 'saveAndClose'}, [_("Save and close")]]
        ['br'],
        ['br']
        */
        ['label', [_("keep_dialog_open"), ['input', {type: 'checkbox', id: 'keepOpen'}]]],
        ['br'],
        ['button', {id: 'execute'}, [_("Execute")]],
        ['button', {id: 'cancel'}, [_("Cancel")]]
    ]]
], $('body'));


$('body').addEventListener('click', function (e) {
    var val, sel, selVal,
        target = e.target,
        dataset = target.dataset || {},
        cl = target.classList;
    function getValues (type, expInput) {
        var selector = '.' + expInput.getPrefixedNamespace() + type;
        return Array.from($$(selector)).map(function (arg) {
            if (arg.type === 'checkbox') {
                return arg.checked;
            }
            return arg.value;
        });
    }
    function getInputValues (expInput) {
        return getValues('input', expInput);
    }

    if (cl.contains('ei-files-presets') || (target.parentNode && target.parentNode.classList.contains('ei-files-presets')) ||
        cl.contains('ei-exe-presets') || (target.parentNode && target.parentNode.classList.contains('ei-exe-presets'))) {
        val = target.value;
        if (!val) {
            return;
        }
        sel = dataset.sel || (target.parentNode && target.parentNode.dataset.sel);
        if (sel) {
            $(sel).value = val;
        }
    }
    else if (cl.contains('ei-files-picker') || cl.contains('ei-exe-picker')) {
        sel = dataset.sel;
        emit('filePick', {
            dirPath: $(sel).value,
            selector: sel,
            defaultExtension: dataset.defaultExtension || undefined,
            selectFolder: ($(dataset.directory) && $(dataset.directory).checked) ? true : undefined
        });
    }
    else if (cl.contains('ei-files-revealButton') || cl.contains('ei-exe-revealButton')) {
        sel = dataset.sel;
        selVal = sel && $(sel).value;
        if (selVal) {
            emit('reveal', selVal);
        }
    }
    // Abstract this
    else if (cl.contains(files.getPrefixedNamespace() + 'add')) {
        files.add();
    }
    else if (cl.contains(files.getPrefixedNamespace() + 'remove')) {
        files.remove(dataset.id);
    }
    else if (cl.contains(urls.getPrefixedNamespace() + 'add')) {
        urls.add();
    }
    else if (cl.contains(urls.getPrefixedNamespace() + 'remove')) {
        urls.remove(dataset.id);
    }
    else if (cl.contains(args.getPrefixedNamespace() + 'add')) {
        args.add();
    }
    else if (cl.contains(args.getPrefixedNamespace() + 'remove')) {
        args.remove(dataset.id);
    }
    else if (target.id === 'cancel') {
        emit('buttonClick', {id: 'cancel'});
    }
    else if (target.id === 'execute') {
        emit('buttonClick', {
            id: target.id,
            executablePath: $('#executablePath').value,
            args: getInputValues(args),
            files: getInputValues(files),
            urls: getInputValues(urls),
            dirs: getValues('directory', files)
        });
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


on('finished', function () {
    $('#processExecuted').style.visibility = 'visible';
    if (!$('#keepOpen').checked) {
        emit('buttonClick', {id: 'cancel'});
    }
    else {
        setTimeout(function () {
            $('#processExecuted').style.visibility = 'hidden';
        }, 2000);
    }
});

function fileOrDirResult (data) {
    var path = data.path,
        selector = data.selector;
    if (path) {
        $(selector).value = path;
    }
}
on('filePickResult', fileOrDirResult);

// SETUP

// Insert this as a class, so it works for others inserted into doc
$('#dynamicStyleRules').sheet.insertRule(
    '.ei-files-revealButton, .ei-exe-revealButton {background-image: url("' + options.folderImage + '");}', 0
);

function handleOptions (data) {
    var paths = data.paths,
        type = data.type,
        sel = type === 'executables' ? '#' + type : '.ei-files-presets';

    paths.forEach(function (pathInfo) {
        var option = document.createElement('option');
        option.text = pathInfo[0];
        option.value = pathInfo[1];
        $(sel).appendChild(option);
    });
}
on('executables', handleOptions);
on('temps', handleOptions);

// Todo: For prefs when prev. values stored, call multiple times and populate
args.add();
urls.add();
files.add();

}());
