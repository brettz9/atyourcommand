/*globals ExpandableInputs, self, jml */

(function () {'use strict';

var
    emit = self.port.emit,
    on = self.port.on,
    options = self.options,
    args = new ExpandableInputs({
        locale: options.locale,
        table: 'executableTable',
        namespace: 'args',
        label: "Arg %s:",
        inputSize: 60,
        rows: 1 // Might perhaps make this optional to save space, but this triggers creation of a textarea so args could be more readable (since to auto-escape newlines as needed)
    }),
    urls = new ExpandableInputs({
        locale: options.locale,
        table: 'URLArguments',
        namespace: 'urls',
        label: "URL %s:",
        inputSize: 40,
        inputType: 'url'
    }),
    files = new ExpandableInputs({
        locale: options.locale,
        table: 'fileArguments',
        namespace: 'files',
        label: "File %s:",
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

// ADD EVENTS

$('body').addEventListener('click', function (e) {
    var val, sel, selVal,
        target = e.target,
        dataset = target.dataset || {},
        cl = target.classList;
    function getValues (type, expInput) {
        var sel = '.' + expInput.getPrefixedNamespace() + type;
        return Array.from($$(sel)).map(function (arg) {
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
    if (target.classList.contains('ei-files-path')) {
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
