/*
These may need tweaking or moving out of NormalTags
*/
var Tags =[
	['frames', ['frame', 'frameset', ['iframe', {prop: 'src'}], ['noframes', {type: 'feature-present'}]]], 
	['navigation', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'nav']], 
	['block', ['article', 'aside', 'blockquote', 'body', 'center', 'details', 'dialog', 'div', 'fieldset', 'footer', 'listing', 'main', 'marquee', 'p', 'plaintext', 'pre', 'section', 'summary', 'xmp']],
	['lists', ['dd', 'dir', 'dl', 'dt', 'li', 'ol', 'ul']],
	['tables', ['caption', ['col', {type: 'hidden'}], ['colgroup', {type: 'hidden'}], 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr']],
	['forms', ['form', 'isindex', ['input', {prop: 'value'}], 'keygen', ['button', {prop: 'value'}], 'meter', 'optgroup', 'option', ['progress', {prop: 'value'}], ['select', {prop: 'value'}], ['textarea', {prop: 'value'}], 'menu', 'menuitem']],
	['links and anchors', [['a', {prop: 'href'}]]], // (or tags like images inside of links or anchors)
	['inline', [['abbr', {prop: 'title'}], ['acronym', {prop: 'title'}], 'address', 'b', 'bdi', 'bdo', 'big', 'blink', 'cite', 'code', ['data', {prop: 'value'}], 'del', 'dfn', 'em', 'figcaption', 'figure', 'font', 'i', 'ins', 'kbd', 'label', 'legend', 'mark', 'nobr', 'output', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'tt', 'u', 'var']],
	['time', ['time']], 
	['images', ['img', 'map', 'area', 'canvas']],
	['other media', ['video', 'audio', 'bgsound', 'source']],
	['plugins', ['object', 'applet', 'embed', 'param']],
	['empty but visible', ['br', 'hr', 'spacer', 'wbr']],
	['hidden', [['DOCTYPE', {type: 'special'}], ['comments', {type: 'special'}], ['procesing instructions', {type: 'special'}], ['CDATA', {type: 'special'}], 'html', 'head', 'meta', 'title', 'base', 'style', 'link', 'datalist', 'track', 'basefont']],
	['templates', ['content', 'decorator', 'element', 'shadow', 'template']], 
	['scripting', ['script', ['noscript', {type: 'feature-present'}]]]
];
