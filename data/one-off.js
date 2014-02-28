/*globals ExpandableInputs, self, jml */

(function () {'use strict';

var
    emit = self.port.emit,
    on = self.port.on,
    options = self.options,
    args = new ExpandableInputs({
        table: 'executableTable',
        namespace: 'args',
        label: 'Arg %s:',
        inputSize: 100
    }),
    urls = new ExpandableInputs({
        table: 'URLArguments',
        namespace: 'urls',
        label: 'URL %s:',
        inputSize: 40,
        inputType: 'url'
    }),
    files = new ExpandableInputs({
        table: 'fileArguments',
        namespace: 'files',
        label: 'File %s:',
        inputSize: 40
    });

function l (msg) {
    console.log(msg);
}
function $ (sel) {
    return document.querySelector(sel);
}
function $$ (sel) {
    return document.querySelectorAll(sel);
}

// ADD EVENTS

$('body').addEventListener('click', function (e) {
    var target = e.target,
        dataset = target.dataset || {},
        cl = target.classList;
    function getInputValues (expInput) {
        var sel = expInput.getPrefixedNamespace() + 'input';
        return Array.from($$(sel)).map(function (arg) {
            return arg.value;
        });
    }

    // Abstract this
    if (cl.contains(files.getPrefixedNamespace() + 'add')) {
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
    else {
        emit('buttonClick', {
            id: target.id,
            executablePath: $('#executablePath').value,
            args: getInputValues(args),
            files: getInputValues(files),
            urls: getInputValues(urls)
        });
    }
});

$('#executablePath').addEventListener('input', function (e) {
    var target = e.target, val = e.target.value;
    emit('autocompleteValues', {
        value: val,
        listID: target.getAttribute('list')
    });
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

$('#executablePick').addEventListener('click', function (e) {
    var id = e.target.id,
        sel = '#' + id.replace(/Pick$/, 'Path');
    emit('filePick', {
        dirPath: $(sel).value,
        selector: sel,
        defaultExtension: 'exe'
    });
});

$('.revealButton').addEventListener('click', function (e) {
    var sel = e.target.dataset.sel,
        selVal = $(sel).value;
    if (selVal) {
        emit('reveal', selVal);
    }
});

// SETUP
$('.revealButton').style.backgroundImage = 'url("' + options.folderImage + '")';

on('executables', function (exes) {
	$('#executables').addEventListener('click', function (e) {
		var val = e.target.value;
		if (!val) {
			return;
		}
		$('#executablePath').value = val;
	});
	exes.forEach(function (exe) {
		var option = document.createElement('option');
		option.text = exe[0];
		option.value = exe[1];
		$('#executables').appendChild(option);
	});
});

// Todo: call multiple times and populate when prev. values stored
args.add();
urls.add();
files.add();

}());
