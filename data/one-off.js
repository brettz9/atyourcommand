/*globals self*/

function $ (sel) {
	return document.querySelector(sel);
}

self.port.emit('loaded', 'sth');
console.log(jml);

var id = 1;
$('body').appendChild(jml(
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
