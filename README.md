# atyourcommand

Firefox add-on for opening web content into the command line (including WebAppFind).

**This project is not yet functional.**

# Possible to-dos

1. One-off command line dialog: Optionally savable name, path of executable, expandable number of args
1. One-off command line dialog: add the option to
	"save and execute", "save and close", "execute", or "cancel"
1. Prefs: name list: add, edit, delete, move up/down (adapt for AYW also?)
1. Context menu to support page, text selection, URL, image, and custom context(s) (for opening images, etc.).
1. Include pre-sets for opening into WebAppFind (and Firefox)
1. i18n-ize
1. Create icons, etc.
1. Might allow selection of submenus, separators, etc.

# Inspiration

The main impetus for this project comes from my interest to act in the
reverse direction from <https://github.com/brettz9/webappfind>, but some
ideas were obtained from <https://addons.mozilla.org/en-US/firefox/addon/applauncher/>
after I discovered it had some of the same ideas (but I wanted it restartless,
with baked in WebAppFind support, etc.).

# Notes I need to clean-up and integrate with the above

Todos for a Firefox add-on (or series of add-ons, including expanding suitable existing ones) to
bring web documents to be selected for its contents and/or URL to be passed to a desktop app
via its command line interface (or possibly opened or executed on the desktop). Also Gopher-related todos

1. https://github.com/piroor/ctxextensions (restartless and to AMO?); support not only full custom control over context menu, but also toolbar, menu, add-on bar, key command, etc.
    1. Support calling AsYouWish from a context menu (or etc.) (like WebAppFind allows calling it from the desktop)
        1. Command line API to AsYouWish to automatically grant privs if user option enabled, etc. (can then be used by cm add-on to invoke WebAppFind which invokes AYW with data or with a file?); how to prioritize AYW command line with WAF command line? Could use WebAppFind to allow a particular site to be opened in a hidden window, etc. for batch-like functionality
0. web2desktop: Option to pass current already loaded HTML string to command line (e.g., to WAF)
0. web2desktop: when allowing users to create command line commands for context menus/menus/toolbars/add-on bar/etc., allow and demo (with Blockly?) JS prompts (useful for dynamic batch)
1. special protocol to optionally invoke desktop files or remote URL files? (as with invoking webappfind from filebrowser (which can also be folder-aware)); same one to invoke command line?
1. Ability to invoke web2desktop with a hand-typed (auto-complete prompt) local file and/or URL, respectively!!!! (or auto-create using Execute Builder and then immediately execute)
1. Send messages in other direction from waf, exec. builder (to open web file from browser into a desktop app's command line; or to open a web file in a web app!)
1. Ensure web->desktop also handling file:// URLs and c:\ paths to: folder, execute on desktop, execute with web app
1. listener for specific sites to automatically open their contents with a webapp viewer or desktop file with optional command line args

0. allow context menu add-on to also have the ability to send content to web apps (readonly) or, in conjunction with filebrowser-enhanced, right-click a file path (in the FF file browser or as an add-on icon when browsing files) directly to web apps

0. add https://addons.mozilla.org/en-US/firefox/addon/local-filesystem-links/ to filebrowser-enhanced readme and other types below to relevant readmes as well, in section on "related add-ons" or such. Might also mention https://addons.mozilla.org/en-US/firefox/addon/launchy/

1. Right-click content, link/path, content/link source, link content (i.e., choose to make something executable even if not)
1. refer to applauncher in relevant readmes and update to be restartless and to be able to convert a file path to a file URL or, more importantly, a file URL to a file path;  Make applauncher only appear under certain, correct conditions (if it is not already)
1. applauncher supports content, link/path (as link and/or text?), content/link/link-content source (results of "view source as"), link content? so will work with webappfind?
1. Allow context menu add-on to also have the ability to send content to web apps (readonly)
1. Modify applauncher to work with menu, toolbars, app-bar, or key command as well

file: links to local, launchable files
0. Modify https://addons.mozilla.org/en-US/firefox/addon/local-filesystem-links/ (and filebrowser-enhanced) to ask for command line args (and also for webappfind options not only in the file browser but also on right-click on the file icon); also to support right-click open with... for webappfind behavior
0. Modify filebrowser-enhanced to launch the currently loaded file (optionally with args)
0. Served with special content type and protocol meant for external launching?
    1. Create protocol to force dialog asking to launch app (so if user clicks link, will get asked), optionally with args
    1. Modify "open with browser" add-on to allow launching of a file URL including with own args
        1. Overlay prompt at https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/ but make it support site prefs
		so choice will be remembered (checkbox to remember choice including any arguments, passing URL and/or file contents);
		also allow WAF detection (e.g., remote filetypes.json?) in addition to MIME detection?
0. As with "open with browser" site prefs, make filebrowser-enhanced context menu and right-click on webappfind icon sensitive to site prefs so right-click arguments can optionally be remembered; share options across all of these addons?

1. Open directory of already opened file or path
1. modify filebrowser-enhanced to allow right-click on folder or file to get the path as path (could go to location bar for URL, but not for folder, so add this too)

1. launch file currently opened in Firefox (e.g., if text file opened from text, launch it to be able to edit it)
1. Run file as executable (e.g., a batch)

1. To make web2desktop/web2command more meaningful, ensure works with a Gopher-over-HTTP protocol (e.g., one limited to <li> elements and other tags auto-escaped):
1. Do gopher system for these files just extra required header; search "Gopher (protocol) over HTTP" (FTP, WebDAV?)
    1. problem with informational message--needs to map to real files; use instead hidden files of given extension with optional sticky coordinates
    1. use WebDAV request (via same-site Ajax or Firefox add-on privileged cross-domain (already with WebDAV add-on?)) for directory (propfind overloaded, was it?) so request for individual file reading or writing (as with directory listing) can be made over HTTP (including reverse webappfind)
