# dialog

Beginnings of a polyfill for HTML dialog (using the
[Polymer CustomElements](https://github.com/Polymer/CustomElements)
polyfill).

**Note: this is barely functional and not fully compliant with the [spec](http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-dialog-element)**.

# Browser support

Currently works in at least Firefox 30.0, Safari 5.1.7, IE 11.0.
Chrome (35.0.1916.114 m) doesn't allow registration without 'x-'
but otherwise works if the APIs are changed to be defined with 'x-'.

# Example

```html
<dialog open="">An open dialog</dialog>
```

or:

```js
document.addEventListener('WebComponentsReady', function() {'use strict';

var dialog = document.createElement('dialog');
dialog.appendChild(document.createTextNode('Hello world!'));
document.body.appendChild(dialog);
dialog.show();
setTimeout(function () {
	dialog.close('Later all!');
	alert(dialog.returnValue);
}, 2000);

});
```

# Installation

```
$ bower install polyfill-dialog
```

Then clone and reference
"bower_components/polyfill-dialog/bower_components/CustomElements/custom-elements.js"
and "bower_components/polyfill-dialog/src/main.js" in your HTML as in demo/index.html.

# Dev Setup

Fork this repo, rename it, then clone it.

Note, however, that I am currently manually commenting out the line in
"bower_components/CustomElements/src/CustomElements.js" (line 108)
which throws an error on encountering a hyphen in the name. We don't
want to add a hyphen, however, because our dialog is attempting to be
a faithful polyfill.

# Todo

1. Make compliant as far as possible with rest of spec.
1. Figure out issue with full screen display
1. Add tests
