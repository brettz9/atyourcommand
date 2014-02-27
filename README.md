# atyourcommand

Firefox add-on for opening web content into the command line
(including [WebAppFind](https://github.com/brettz9/webappfind)).

**This project is not yet functional.**

# Immediate to-dos

1. Finish substitution of current page contents, URL, etc.
1. Prepend/append to any type: save to temp file - whether to overwrite (and
continue execution), optionally prompt or use a user-designated (and
changeable within flags) directory; can use for copying whole file (or
URLs too even if PUT back to server)
1. Data URL or binary string
1. Current page's body as text or remote page's body as text/HTML (including file:// or C:\ pages)
1. If current file or link reference is a file:// link, have option to convert to native path
1. Context menu to support substitutions to pass page, text selection, URL,
image, and custom context(s) (for opening HTML or text of selection or page,
images as binary or data URL, etc.). Substitute in path even or only args?
1. Provide sample default paths for executables (at least cmd.exe and firefox.exe)
1. As per AppLauncher feature request, inform users of substitutions for URL, text, etc.
1. As per AppLauncher feature request, default to a specific, configurable
executable path (or save multiple options for drop-down)
1. Take into account base href!

# Likely to-dos

1. Opinion piece on great importance of data ownership and decoupling of local
or remote data from applications (also discuss need for return to (user-approved)
`globalStorage` for application independence and potential use in websites adopting
application-neutral add-on frameworks, and
[SharedStorage](https://gist.github.com/brettz9/8876920) and
[AsYouWish namespaced storage](https://github.com/brettz9/asyouwish/)
as hacks in the interim). Also consider idea for requesting or providing content
(prefs, request for privs, drafts/documents/chat logs/social media content) stored
in such `globalStorage` under user-approved (or site-approved) license and
purchasing terms negotiated in the browser with acceptable third-party verifiers.
Cover need for "data ownership" to more frequently accompany privacy
discussions. Ridiculousness of effort at code being decoupled when web (and
desktop in connection with the web) is itself not decoupled. Also cover the
ideas for PUT requests (for decoupled saving) and interfaces to the
likes of Firefox's SQLite database (including for access to its localStorage
contents) and HTTPQuery/PATCH requests for a potentially friendly and
uniform approach (which could subsume the local SQLite API as well)
toward allowing universal and
neutral APIs to obtain and save *portions* of documents as well as whole
documents among open data sources and applications.
1. Add demo of data page being opened into WebAppFind and sent to web app
which feeds data to a plug-in and receives data back for a PUT save back to
the remote file (important for showing capability of native apps integrated
with browser gaining same workflow access to the opening and, optionally,
editing, of a document, including online editing).
1. AtYourCommand to include HTTPQuery (partial) retrieval of remote content
(though delegate partial saving back to webappfind?)
1. Conditional operator to check whether PUT, HTTPQuery, etc. is supported,
and if so, change text sent to command line accordingly (convenience)
1. One-off command line dialog: add optionally savable label (for saving)
1. One-off command line dialog: add options to "save and execute",
"save and close" and add context menu link to prefs dialog
1. Prefs: label list: add, edit, delete, move up/down (adapt for AYW also?)
1. Include pre-sets for opening into WebAppFind (and Firefox) and
example like Notepad++
1. Investigate other applauncher.js aspects for possible types of substitutions?
1. Ensure filebrowser-enhanced can launch the currently loaded
file (optionally with args) by using atyourcommand

# Possible to-dos

1. i18n-ize
1. Create icons, etc.
1. Might allow selection of submenus, separators, etc.
1. As per AppLauncher feature request, allow shortcuts on the toolbar; also
modify to work with main menu, app-bar, or key command as well
1. Option to have context menu items, based on the substitutions used (or
user choice), cause them to only appear under certain, correct conditions
(but ensure commands can utilize multiple components (e.g., highlighted
link and page HTML)
1. Ability to confirm selected text content is a path, URL or file URL, etc.?
1. Allow atyourcommand to send content to web apps directly through WebAppFind
code when present (as opposed to through command line)?
1. To make atyourcommand more meaningful, ensure works with a
Gopher-over-HTTP protocol (e.g., one limited to <li> elements and other tags
auto-escaped):
	1. Do Gopher system for these files just extra required header; search "Gopher (protocol) over HTTP" (FTP, WebDAV?)
    1. Problem with informational message--needs to map to real files; use instead hidden files of given extension with optional sticky coordinates
    1. Use WebDAV request (via same-site Ajax or Firefox add-on privileged cross-domain (already with WebDAV add-on?)) for directory (propfind overloaded, was it?) so request for individual file reading or writing (as with directory listing) can be made over HTTP (including reverse webappfind)

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

# Notes I need to clean-up and integrate with the above

Todos for a Firefox add-on (or series of add-ons, including expanding suitable existing ones) to
bring web documents to be selected for its contents and/or URL to be passed to a desktop app
via its command line interface (or possibly opened or executed on the desktop). Also Gopher-related todos

1. https://github.com/piroor/ctxextensions (restartless and to AMO?); support not only full custom control over context menu, but also toolbar, menu, add-on bar, key command, etc.
    1. Support calling AsYouWish from a context menu (or etc.) (like WebAppFind allows calling it from the desktop)
        1. Command line API to AsYouWish to automatically grant privs if user option enabled, etc. (can then be used by cm add-on to invoke WebAppFind which invokes AYW with data or with a file?); how to prioritize AYW command line with WAF command line? Could use WebAppFind to allow a particular site to be opened in a hidden window, etc. for batch-like functionality
1. web2desktop: when allowing users to create command line commands for context menus/menus/toolbars/add-on bar/etc., allow and demo (with Blockly?) JS prompts (useful for dynamic batch)
1. special protocol to optionally invoke desktop files or remote URL files? (as with invoking webappfind from filebrowser (which can also be folder-aware)); same one to invoke command line?
1. Ability to invoke web2desktop with a hand-typed (auto-complete prompt) local file and/or URL, respectively!!!! (or auto-create using Execute Builder and then immediately execute)
1. Send messages in other direction from waf, exec. builder (to open web file from browser into a desktop app's command line; or to open a web file in a web app!)
1. Ensure web->desktop also handling file:// URLs and c:\ paths to: folder, execute on desktop, execute with web app
1. listener for specific sites to automatically open their contents with a webapp viewer or desktop file with optional command line args
1. Utilize (JavaScript-based) Blockly for pipelining of any kind of command (though avoid baking in UI as UI should be flexible, e.g., to allow use in menu, toolbar, add-on bar, etc.); also macro-like development
1. allow context menu add-on to also have the ability to send content to web apps (readonly) or, in conjunction with filebrowser-enhanced, right-click a file path (in the FF file browser or as an add-on icon when browsing files) directly to web apps
1. add https://addons.mozilla.org/en-US/firefox/addon/local-filesystem-links/ to
filebrowser-enhanced readme and other types below to relevant readmes as
well, in section on "related add-ons" or such. Might also mention
https://addons.mozilla.org/en-US/firefox/addon/launchy/
1. file: links to local, launchable files
1. Modify https://addons.mozilla.org/en-US/firefox/addon/local-filesystem-links/
(and filebrowser-enhanced) to ask for command line args (and also for
webappfind options not only in the file browser but also on right-click
on the file icon); also to support right-click open with... for webappfind
behavior
1. Served with special content type and protocol meant for external launching?
    1. Create protocol to force dialog asking to launch app (so if user clicks link, will get asked), optionally with args
    1. Modify "open with browser" add-on to allow launching of a file URL including with own args
        1. Overlay prompt at https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/ but make it support site prefs
		so choice will be remembered (checkbox to remember choice including any arguments, passing URL and/or file contents);
		also allow WAF detection (e.g., remote filetypes.json?) in addition to MIME detection?
1. As with "open with browser" site prefs, make filebrowser-enhanced context menu and right-click on webappfind icon sensitive to site prefs so right-click arguments can optionally be remembered; share options across all of these addons?
1. Open directory of already opened file or path
1. Modify filebrowser-enhanced to allow right-click on folder or file to get the path as path (could go to location bar for URL, but not for folder, so add this too)
1. Launch file currently opened in Firefox (e.g., if text file opened from text, launch it to be able to edit it)
1. Run file as executable (e.g., a batch)
