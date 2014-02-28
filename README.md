# atyourcommand

***NOTE: This project is not yet functional.***

Firefox add-on for opening arbitrary web content into the command line
(which also enables opening arbitrary web content into other web apps
via [WebAppFind](https://github.com/brettz9/webappfind)).

A number of automatic substitutions are available (and documented within
the dialog) such as obtaining the current URL, title,
content as HTML or text, etc.

# Immediate to-dos

1. UI fixes
    1. Fix behavior of temp. dir. autocomplete
    1. Send checkbox info on whether a directory or not
1. Behavior additons
    1. Finish behavior providing substitution of current
    page contents, URL, etc. (see to-dos in code).


# Likely to-dos

1. Opinion piece on great importance of data ownership and decoupling of local
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
ideas for PUT requests (for decoupled saving) and interfaces to the
likes of Firefox's SQLite database (including for access to its localStorage
contents) or to FileWriter/FileSystem files and HTTPQuery/PATCH requests
for a potentially friendly and
uniform approach (which could subsume the local SQLite API as well)
toward allowing universal and
neutral APIs to obtain and save *portions* of documents as well as whole
documents among open data sources and applications.
1. Idea for command line apps to align themselves with a uniform,
atyourcommand-friendly syntax to simplify supplying of data (and to allow for
UI-building of such arguments for apps which are compliant). Indicate on
wiki projects supporting
1. Add demo of data page being opened into WebAppFind and sent to web app
which feeds data to a plug-in and receives data back for a PUT save back to
the remote file (important for showing capability of native apps integrated
with browser gaining same workflow access to the opening and, optionally,
editing, of a document, including online editing).
1. As per AppLauncher feature request, default to a specific, configurable
executable path (or save multiple options for drop-down)
1. One-off command line dialog: add optionally savable label (for saving)
1. One-off command line dialog: add options to "save and execute",
"save and close" and add context menu link to prefs dialog
1. Prefs: label list: add, edit, delete, move up/down (adapt for AYW also?)
1. Include pre-sets for opening into WebAppFind (and Firefox) and
example like Notepad++
1. Investigate other applauncher.js aspects for possible types of substitutions?
1. Make reference to potential use with filebrowser or filebrowser-enhanced
links on the currently loaded file (optionally with args)
1. AtYourCommand to include HTTPQuery (partial) retrieval of remote content
(though delegate partial saving back to webappfind?)
1. Conditional operator to check whether PUT, HTTPQuery, etc. is supported,
and if so, change text sent to command line accordingly (convenience)
1. To handle file:// URLs and c:\ paths that are right-clicked (or currently
loaded) to: expose folder (or copy folder/file path), bare execution on
desktop or with web app (without specific executable, args, etc.; also
provide a prompt), e.g., for executables/batch files, see filebrowser enhanced
to-do about splitting off its context menu/add-on bar file:// capabilities into
separate add-on.

# Possible to-dos

1. i18n-ize
1. Create icons, etc.
1. Might allow selection of submenus, separators, etc.
1. Any other command line necessities (besides quoted string escaping)?
1. As per AppLauncher feature request, allow shortcuts on the toolbar; also
modify to work with main menu, app-bar, or key command as well
1. Option to have context menu items, based on the substitutions used (or
user choice), cause them to only appear under certain, correct conditions
(but ensure commands can utilize multiple components (e.g., highlighted
link and page HTML)
1. Ability to confirm selected text content is a path, URL or file URL, etc.?
1. Allow atyourcommand to send content to web apps directly through WebAppFind
code when present (as opposed to through command line)?
1. Remote site supply of commands
    1. Way for websites to register commands or groups of commands upon
    user introspection and permission
    1. Served with special content type and protocol meant for external launching?
        1. Create protocol to force dialog asking to launch app (so if user
        clicks link, will get asked), optionally with args, and optionally with
        desktop file or remote URLs, etc. as content; will thereby also be
        able to support (and demo) WebAppFind invocation from remote
1. De-coupling of remote content from its executable (as in regular
atyourcommand) but remember upon future loads of the content
    1. Modify [Open In Browser](https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/)
    add-on to allow launching of a file URL including with own args (and
    optional saving/editing of the command for reuse across atyourcommand
    content)
        1. Overlay
        [Open In Browser](https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/)
        but make it support site prefs (but not by domain as with Mozilla content prefs!)
        so choice will be remembered (checkbox to remember choice including
        any arguments, passing URL and/or file contents); also allow
        WebAppFind detection (e.g., remote filetypes.json?) in addition
        to MIME detection?
        1. Point out potential use in automatically launching WebAppFind-driven
        web apps automatically with web data (and with PUT requests back to
        server, could get full round-trip decoupling of data and app)
    1. As with my possible todo for
    [Open In Browser](https://addons.mozilla.org/En-us/firefox/addon/open-in-browser/)
    site prefs, make the filebrowser-enhanced context
    menu and right-click on WebAppFind icon (for the opening of the current
    browser document into WebAppFind) sensitive to site prefs so right-click
    arguments can optionally be remembered; share options across all of these
    addons?
1. To make atyourcommand more meaningful, ensure works with a
Gopher-over-HTTP protocol (e.g., one limited to <li> elements and other tags
auto-escaped):
    1. Do Gopher system for these files just extra required header; search "Gopher (protocol) over HTTP" (FTP, WebDAV?)
    1. Problem with informational message--needs to map to real files; use instead hidden files of given extension with optional sticky coordinates
    1. Use WebDAV request (via same-site Ajax or Firefox add-on privileged cross-domain (already with WebDAV add-on?)) for directory (propfind overloaded, was it?) so request for individual file reading or writing (as with directory listing) can be made over HTTP (including reverse webappfind)

# To-dos related to context-aware power-use or web-desktop interaction but beyond current scope of atyourcommand

1. https://github.com/piroor/ctxextensions (restartless and to AMO?);
support not only full custom control over context menu, but also
toolbar, menu, add-on bar, key command, etc.
    1. Break apart functionality to specialize in context menu
    text and URL manipulations? (If so, ensure some other way to
    have full control over where tools appear; do this by modifying
    the Firefox Add-ons SDK itself so capability baked-in?)
1. Utilize (JavaScript-based) Blockly for pipelining of any kind of
command (though avoid baking in UI as UI should be flexible, e.g.,
to allow use in menu, toolbar, add-on bar, etc.); also macro-like
development
1. When allowing users to create command line commands
for context menus/menus/toolbars/add-on bar/etc., allow and demo
(with Blockly?) JS prompts (useful for dynamic batch), e.g., to
replicate atyourcommand functionality.

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
