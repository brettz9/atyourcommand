/*jslint browser:true*/
(function () {'use strict';

// We could conditionally insert style rules (for dialog
//  and dialog:not([open]), dialog::backdrop) into the CSSOM
//  and use that, but this is less invasive
var styleDialogOpen = {
	// Styles obtained from http://www.w3.org/html/wg/drafts/html/master/rendering.html#flow-content-0
	'start': function (el) {
		var style = el.style;
		el.style.display = 'none';
		style.color = 'black';
		style.backgroundColor = 'white';
		style.borderStyle= 'solid';
		style.position = 'absolute';
		style.margin = 'auto';
		style.padding = '1em';
		style.left = '0';
		style.right = '0';
		style.width = 'fit-content';
		style.height = 'fit-content';
	},
	'true': function (el) {
		el.style.display = 'block';
	},
	'false': function (el) {
		el.style.display = 'none';
	},
	'noBackdrop': function (el) {
		var style = el.style;
		style.position = 'absolute';
		style.top = 'inherit';
		style.bottom = 'inherit';
		// Left and right already set on start (and not changed by true or false and same value as backdrop)
		style.backgroundColor = 'white';
	},
	// Todo: something is wrong when this is actually applied but not sure what
	'backdrop': function (el) {
		var style = el.style;
		style.position = 'fixed';
		style.zIndex = '100';
		style.top = '0';
		style.bottom = '0';
		style.left = '0';
		style.right = '0';
		style.backgroundColor = 'rgba(0,0,0,0.1)';	
	}
};

// From MDN: https://developer.mozilla.org/en-US/docs/Web/API/document.mozFullScreen#Example
function isDocumentInFullScreenMode() {
  // Note that the browser fullscreen (triggered by short keys) might
  // be considered different from content fullscreen when expecting a boolean
  return ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard methods
      document.mozFullScreen || document.webkitIsFullScreen);                   // current working methods
}

function styleIfFullScreen (el) {
	if (isDocumentInFullScreenMode()) {
		styleDialogOpen.backdrop(el);
	}
}

var fullOpened = false;

var dialogProto = Object.create(HTMLDivElement.prototype);

// CUSTOM ELEMENTS API
// new API for "attachedCallback" and "detachedCallback": "enteredViewCallback", "leftViewCallback"
dialogProto.createdCallback = function () {
	var self = this;
	this.returnValue = '';
	styleDialogOpen.start(this);
	styleIfFullScreen(this);
	// The fullscreenchange event is only for programmatic screen changes, so we have to poll below
	window.addEventListener('keydown', function (e) {
		if (e.keyCode === 27) {
			self.close();
		}
	});
	document.addEventListener('fullscreenchange', function () {
		styleIfFullScreen(self);
	});
	setInterval(function () {
		if (screen.width === window.innerWidth) {
			fullOpened = true;
			styleDialogOpen.backdrop(self);
		}
		else if (fullOpened) {
			fullOpened = false;
			styleDialogOpen.noBackdrop(self);
		}
	}, 500);
};
dialogProto.attributeChangedCallback = function (attrName, oldVal, newVal) {
	// alert(attrName + '::' + oldVal + '::' + newVal);
	if (attrName === 'open') {
		styleDialogOpen[newVal](this);
	}
};
// DIALOG API
dialogProto.show = function (anchor) {
	this.open = true;
};
dialogProto.showModal = function (anchor) {
	this.open = true;
};
dialogProto.close = function (returnValue) {
	this.open = false;
	this.returnValue = returnValue;
};

Object.defineProperties(dialogProto, {
	open: {
		get: function () {
			return !!this.hasAttribute('open');
		},
		set: function (val) {
			if (typeof val !== 'boolean') {
				return; // Throw?
			}
			this.setAttribute('open', val);
		}
	},
	returnValue: {
		get: function () {
			return this._returnValue;
		},
		set: function (val) {
			this._returnValue = String(val);
		}
	}
});

document.register('dialog', {
//	'extends': 'div',
	prototype: dialogProto
});

document.addEventListener('WebComponentsReady', function() {'use strict';

// This functionality should probably be inside Polymer
[].forEach.call(document.getElementsByTagName('dialog'), function (dialog) {
	if (dialog.hasAttribute('open')) { // Ensure this triggers display behavior since registration not available when first loading page
		var open = dialog.getAttribute('open');
		dialog.setAttribute('open', 'true');
	}
});

});


}());
