# atyourcommand

***NOTE: This project is not yet functional.***

Firefox add-on for opening arbitrary web content into the command line
(which also enables opening arbitrary web content into other web apps
via [WebAppFind](https://github.com/brettz9/webappfind)).

A number of automatic substitutions are available (and documented within
the dialog) such as obtaining the current URL, title,
content as HTML or text, etc.

# Todos to organize
1. Dynamic executable
1. Make reference to potential use with filebrowser or filebrowser-enhanced
links on the currently loaded file (optionally with args)
1. To handle file:// URLs and c:\ paths that are right-clicked (or currently
loaded) to: expose folder (or copy folder/file path), bare execution on
desktop or with web app (without specific executable, args, etc.; also
provide a prompt), e.g., for executables/batch files, see filebrowser enhanced
to-do about splitting off its context menu/add-on bar file:// capabilities into
separate add-on.


# Installation

Install the bundled XPI file.

To develop with source, install with npm:

`npm install .`

# Immediate to-dos

1. **Display of commands** in context menu or with list of commands
in edit mode (with the list of commands pre-opened) or in
new command mode (with the list pre-closed)

1. Complete work on giving user choice on whether to provide context
	menu items **only in certain selector-based contexts** (but making
	necessary JSON-friendly conversions for them)
    1. video, audio, object/embed/applet (may be hidden from UI),
	URL, `<a>`, canvas to data URL (including of image or video
	elements as in QR Secret Decoder Ring), textarea and input content
	(including selection ranges within), etc.
	1. If hidden are chosen, context will be page context

1. Finish behavior providing **string substitution** of current page contents,
URL, etc. (see todos in main.js under "buttonClick" "execute" event)
	1. Support defaults (including empty ones) and document
	1. Ensure user can just invoke a command without sending anything
	1. Allow textarea dialog prompt for content to supply to web app or
	command
	1. Option to open selection output in empty tab or window (as text, HTML,
	or textarea contents), hidden window, or dialog within right-clicked
	window.
	1. Allow command type which directly makes a PUT/POST/GET with contents
	and optionally headers/values (or make an SQLite command in Firefox or
	write output to file and optionally open that file in the browser or
	outside optionally with WebAppFind/filetypes.json), into window which is
	hidden or not, and optionally switching to that window.
	1. Support text or CSS path offset of highlighted text so if supplying
	all page text, an app can reconstruct the position of the highlighted
	text/elements in context (e.g., to allow supplying a correction of edited
	text to Github through its API).
	1. Ensure format of data is as abstract as possible in every way so as to
	avoid OS-specific syntax.
1. Option to **make command or executable batch**

1. Submit to AMO

# Higher priority to-dos (longer)

1. Option to associate with file/create shortcut (Executable Builder).
1. **Opinion piece** on great importance of data ownership and decoupling of local
or remote data from applications (also discuss need for return to (user-approved)
`globalStorage` for application independence and potential use in websites adopting
application-neutral add-on frameworks, and
[SharedStorage](https://gist.github.com/brettz9/8876920),
[AsYouWish namespaced storage](https://github.com/brettz9/asyouwish/),
and the HTML5 download attribute (whose ability to save anywhere is nice
but does not allow the site to prompt for a specific directory and does not
allow for automatic reading back of the file),
as hacks in the interim). Also consider idea for requesting or providing content
(prefs, request for privs, drafts/documents/chat logs/social media content) stored
in such `globalStorage` under user-approved (or site-approved) license and
purchasing terms negotiated in the browser with acceptable third-party verifiers.
Cover need for "data ownership" to more frequently accompany privacy
discussions. Ridiculousness of effort at code being decoupled when web (and
desktop in connection with the web) is itself not decoupled. Also cover the
ideas for PUT requests (for decoupled saving), SQL/local file/cache (see below)
toward allowing universal and
neutral APIs to obtain and save *portions* of documents as well as whole
documents among open data sources and applications (e.g., to right-click
when using a Firefox add-on for localStorage, FileSystem, or IndexedDB
browsing and send the data to the command line, including optionally
to WebAppFind for discovering a suitable web-app, and allowing an API
for saving back, thus freeing the user from local storage data lock-in).
Likewise for right-clicking a particular element (or XPath/CSS Selector
expression?) within a document to do a PATCH back to the server for
replacing just that portion with whatever value is indicated by the user or
by the web app which was delegated responsibility for the PUT/PATCH (an
HTML/XML document is itself a kind of database).
1. Add interfaces to the likes of Firefox's **SQLite** database (including
for access to its localStorage contents) or to **FileWriter/FileSystem**
and **cached files** (e.g., when right-clicking on a document, getting its
HTML cache or resource file cache files, or its localStorage, etc. so
no data is inaccessible) and **HTTPQuery/PATCH** requests against
local as well as remote data for a potentially friendly and uniform approach
(which could subsume the local SQLite API as well)
1. AtYourCommand to include **HTTPQuery** (partial) retrieval of remote content
(though delegate partial saving back to webappfind?)
1. Conditional operator for **PUT, HTTPQuery support detection**;
if supported, change text sent to command line accordingly (convenience)
1. Idea for command line apps to align themselves with a uniform,
atyourcommand-friendly syntax to simplify supplying of data (and to allow for
UI-building of such arguments for apps which are compliant). Indicate on
wiki projects supporting. (Or better yet, **parse existing help files or
command line help flag commands**, if structured enough.) Also
allow **joining of commands**. This could actually work with WebAppFind,
e.g., to make flags prefixed with webappfind- along with its own modes
(e.g., view, edit, binaryedit) or custom modes--see next todo.
1. Make **desktop app demo** (e.g., Notepad++ plugin? though ideally also a
database app to demonstrate how data that is typically otherwise "locked
away" to other apps) can be shuffled off by right-click
of text or a URL, etc.; also may itself display and make available for use
the commands stored by AtYourCommand (in files which themselves
might be openable in a WebAppFind filetypes.json
manner), determining relevance of commands by reverse detecting their
`<text>` or whatever substitutions, demoing how a desktop app can in
turn allow contextual snippets to be shuffled off to other applications
including web-based ones (via WebAppFind). See also todo for WebAppFind
re: possible command line syntax within filetypes.json.
1. **Grab contents as text or HTML** (allowing for CSS-Selector-enhanced
HTTPQuery syntax like `div.myClass:text()` or `a[href]:attr()` (and enhanced
further to support `:selected()`, `:checked()`, or such) to get back
other than an HTML string?) along with page text, URL, etc.; note: this
ability to specify selectors for output is potentially distinct from
specifying contexts via selector
    1. Option to supply prompt for selector or JS/jQuery eval at run-time
1. Support **eval-able custom selector definition retrieval**
for context determination (as with custom selector definitions for node
retrieval).

# Higher priority to-dos (shorter)

1. If item is a **required item**, could prevent "submit" (currently not
using `<form>`, so no submit).
1. Investigate **other applauncher.js aspects** for possible types of substitutions?
1. Add support for HTML fragments, `<div>`'s, or JSON-stringified
arrays for hidden items like the `<script src>`'s, `<link href>`'s or
`<html manifest>` on the page.
1. Include **pre-sets for opening into WebAppFind (and Firefox)** and
example like Notepad++

# Possible to-dos

1. As per AppLauncher feature request, default to a **specific, configurable
executable path** (or save multiple options for drop-down)
1. Allow storage of **own "path" environment** for greater portability across OS.
1. Option to **view groups of selectors by output type** (e.g., HTML string,
URL, etc.), instead of just by concept (e.g., "image URL" and "SVG
as string" being in same image group).
1. If a link type of command is chosen but no link is selected, **find first
item in page**. Same with images, videos, script files, stylesheets, etc.
1. Display of commands in dialog: **move up/down commands** instead
of alphabetical?
1. **Create icons**, etc. for add-on and let user create for individual
commands through SVG Edit?
1. Might allow selection of **submenus, separators, etc.**
1. Any **other command line necessities** (besides quoted string escaping)?
1. As per AppLauncher feature request, **allow shortcuts on the toolbar**;
also modify to work with **main menu, app-bar, or key command** as well
1. Ability to **confirm selected text content is the right type**: a path,
URL or file URL, etc.?
1. Allow atyourcommand to **send content to web apps directly through
WebAppFind** code when present (as opposed to through command line)?
1. **Remote site supply of commands**
	1. Way for websites to register commands or groups of commands upon
	user introspection and permission
	1. Served with special content type and protocol meant for external launching?
		1. Create protocol to force dialog asking to launch app (so if user
		clicks link, will get asked), optionally with args, and optionally with
		desktop file or remote URLs, etc. as content; will thereby also be
		able to support (and demo) WebAppFind invocation from remote
1. De-coupling remote content from its executable (as in regular
atyourcommand) but remember upon future loads of the content
	1. Modify [Open In Browser](https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/)
	add-on to allow launching of a file URL including with own args (and
	optional saving/editing of the command for reuse across atyourcommand
	content)
		1. Overlay
		[Open In Browser](https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/)
		but make it support **site prefs** (but not by domain as with Mozilla content prefs!)
		(in addition to mapping MIME to commands)
		so choice will be remembered (checkbox to remember choice including
		any arguments, passing URL and/or file contents); also allow
		WebAppFind detection (e.g., remote filetypes.json?) in addition
		to MIME detection?
		1. Point out potential use in automatically launching WebAppFind-driven
		web apps automatically with web data (and with PUT requests back to
		server, could get full round-trip decoupling of data and app)
		1. Allow all file:// URLs to optionally be opened externally as per https://support.mozilla.org/en-US/questions/758172
		1. Cover usage of http://kb.mozillazine.org/View_source.editor.external and http://kb.mozillazine.org/View_source.editor.path
	1. As with my possible todo for
	[Open In Browser](https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/)
	site prefs, make the filebrowser-enhanced context
	menu and right-click on WebAppFind icon (for the opening of the current
	browser document into WebAppFind) sensitive to site prefs so right-click
	arguments can optionally be remembered; share options across all of these
	addons?
1. To make atyourcommand more meaningful, **test with a
Gopher-over-HTTP protocol** (e.g., one limited to `<li>` elements and other tags
auto-escaped):
	1. Do Gopher system for these files just extra required header; search "Gopher (protocol) over HTTP" (FTP, WebDAV?)
	1. Problem with informational message--needs to map to real files; use instead hidden files of given extension with optional sticky coordinates
	1. Use **WebDAV** request (via same-site Ajax or Firefox add-on privileged cross-domain (already with WebDAV add-on?)) for directory (propfind overloaded, was it?) so request for individual file reading or writing (as with directory listing) can be made over HTTP (including reverse webappfind)
1. **Exporting as batch files**, and **converting batch files upon import** (also in
conjunction with
[Executable Builder](https://github.com/brettz9/executable-builder/)) which
could allow for convenient reuse of the content when attaching the batch
script to a "Open with..." handler. Use approach like
http://stackoverflow.com/a/5215844/271577
1. Have a mechanism to **return from a WebAppFind-opened web app**
back to the page which was the source of its content (e.g., in case one
accidentally didn't grab enough text or whatever)
1. Option to have **context menu items, based on the substitutions used** (in
addition to user choice), cause them to only appear under certain, correct
conditions (but ensure commands can utilize multiple components (e.g.,
highlighted link and page HTML).
1. Might provide an **extension to Firebug** and/or element inspector to
shuffle off its data from there.
1. Add **plug-in demo** of data page being opened into WebAppFind and sent to
web app which feeds data to a plug-in and receives data back for a PUT save
back to the remote file (important for showing capability of native apps
integrated with browser gaining same workflow access to the opening and,
optionally, editing, of a document, including online editing).
	1. Could create a convention to get data out of a plug-in by right-click
	(and demo - see
	[MDN - Scripting plugins](https://developer.mozilla.org/en-US/Add-ons/Plugins/Gecko_Plugin_API_Reference/Scripting_plugins#How_to_call_plugin_native_methods));
	also for a full-page plugin (see [MDN Plug-in Basics](https://developer.mozilla.org/en-US/Add-ons/Plugins/Gecko_Plugin_API_Reference/Plug-in_Basics))?
	Note that plugins are [deprecated](https://developer.mozilla.org/en-US/Add-ons/Plugins), however.
1. Rename or add to URLs (including as textarea) to allow any kind of **variable**?

# To-dos related to context-aware power-use or web-desktop interaction but beyond current scope of atyourcommand

1. https://github.com/piroor/ctxextensions (restartless and to AMO?);
support not only full custom control over context menu, but also
toolbar, menu, add-on bar, key command, etc.
	1. Break apart functionality to specialize in context menu
	text and URL manipulations? (If so, ensure some other way to
	have full control over where tools appear; do this by modifying
	the Firefox Add-ons SDK itself so capability baked-in?)
	1. Integrate with or replicate Greasemonkey behavior also?
	1. Get context menu to support hiding items via whitelist or
	blacklist until exposed by a key command (so that for normal
	browsing, the context menu is light, but can be made more
	powerful at a keystroke).
1. Utilize (JavaScript-based) Blockly for pipelining of any kind of
command (though avoid baking in UI as UI should be flexible, e.g.,
to allow use in menu, toolbar, add-on bar, etc.); also macro-like
development; tie into ExecutableBuilder for this as well.
1. When allowing users to create command line commands
for context menus/menus/toolbars/add-on bar/etc., allow and demo
(with Blockly?) JS prompts (useful for dynamic batch), e.g., to
replicate atyourcommand functionality. Might automatically provide
prompts when a variable is indicated without a value unless
marked as having a default (including an empty one).

# Inspiration

The main impetus for this project comes from my interest to act in the
reverse direction from <https://github.com/brettz9/webappfind>, but some
ideas were obtained from <https://addons.mozilla.org/en-US/firefox/addon/applauncher/>
after I discovered it had some of the same ideas (but I wanted it restartless,
with baked in WebAppFind support, etc.).

I was also very much inspired by (and would ultimately hope to replicate) the
powerful [ContextMenu Extensions](https://github.com/piroor/ctxextensions)
add-on which admirably provides controlled but extensible and open
programmability to regular users.
