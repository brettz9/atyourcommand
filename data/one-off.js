/*globals self, jml */
(function () {'use strict';

var id = 1, argNum = 1;

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
		self.port.emit('buttonClick', {
			id: target.id,
			executablePath: $('#executablePath').value,
			args: Array.from($$('.arg')).map(function (arg) {
				return arg.value;
			})
		});
	}
});

self.port.on('finished', function () {
	// Would be nice if the panel stuck around, but calling the process causes focus to be lost
	$('#processExecuted').style.display = 'block';
	setTimeout(function () {
		self.port.emit('buttonClick', {id: 'cancel'});
	}, 2000);
});

// ADD INITIAL ARGS
// todo: call multiple times and populate when prev. values stored
addArgument();

}());
