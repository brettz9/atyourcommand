/*globals self*/

function $ (sel) {
	return document.querySelector(sel);
}

self.port.emit('loaded', 'sth');

var id = 1;
$('#executableTable').appendChild(jml(
	'tr', [
			['td', [
				['label', {'for': 'arg' + id}, ['Arg ' + id]]
			]],
			['td', [
				['input', {id: 'arg' + id}]
			]],
			['td', [
				['button', ['+']]
			]]
		], null
	)
);
