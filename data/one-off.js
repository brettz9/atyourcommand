/*globals self, jml */
(function () {'use strict';

var id = 1, argNum = 1,
	emit = self.port.emit,
	on = self.port.on,
	options = self.options;

function l (msg) {
	console.log(msg);
}
function $ (sel) {
	return document.querySelector(sel);
}
function $$ (sel) {
	return document.querySelectorAll(sel);
}
Array.from = function (arg) {
	return [].slice.call(arg);
};

function removeArgument (id) {
	if ($$('.row').length === 1) { // Don't delete if only one remaining
		return;
	}
	$('#row' + id).parentNode.removeChild($('#row' + id));
	// Renumber to ensure args remain incrementing by one
	argNum = 1;
	Array.from($$('.argNumber')).forEach(function (argNumHolder) {
		argNumHolder.replaceChild(document.createTextNode('Arg ' + (argNum++) + ':'), argNumHolder.firstChild);
	});
}
function addArgument () {
	$('#executableTable').appendChild(jml(
		'tr', {'id': 'row' + id, 'class': 'row'}, [
				['td', [
					['label', {'for': 'arg' + id, 'class': 'argNumber'}, ['Arg ' + argNum + ':']]
				]],
				['td', [
					['input', {id: 'arg' + id, 'class': 'arg'}]
				]],
				['td', [
					['button', {'class': 'addArg'}, ['+']]
				]],
				['td', [
					['button', {'class': 'removeArg', dataset: {id: id}}, ['-']]
				]]
			], null
		)
	);
	id++;
	argNum++;
}


// ADD EVENTS

$('body').addEventListener('click', function (e) {
	var target = e.target,
		dataset = target.dataset || {},
		cl = target.classList;
	if (cl.contains('addArg')) {
		addArgument();
	}
	else if (cl.contains('removeArg')) {
		removeArgument(dataset.id);
	}
	else {
		emit('buttonClick', {
			id: target.id,
			executablePath: $('#executablePath').value,
			args: Array.from($$('.arg')).map(function (arg) {
				return arg.value;
			})
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

// todo: call multiple times and populate when prev. values stored
addArgument();

}());
