/**
 * The Yahoo global namespace
 * @constructor
 */
var YAHOO = window.YAHOO || {};

/**
 * Returns the namespace specified and creates it if it doesn't exist
 *
 * YAHOO.namespace("property.package");
 * YAHOO.namespace("YAHOO.property.package");
 *
 * Either of the above would create YAHOO.property, then
 * YAHOO.property.package
 *
 * @param  {String} ns The name of the namespace
 * @return {Object}    A reference to the namespace object
 */
YAHOO.namespace = function( ns ) {

    if (!ns || !ns.length) {
        return null;
    }

    var levels = ns.split(".");
    var nsobj = YAHOO;

    // YAHOO is implied, so it is ignored if it is included
    for (var i=(levels[0] == "YAHOO") ? 1 : 0; i<levels.length; ++i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }

    return nsobj;
};

/**
 * Global log method
 * @param  {string}  sMsg       The message to log.
 * @param  {string}  sCategory  The log category for the message.  Default
 *                              categories are "info", "warn", "error", time".
 *                              Custom categories can be used as well. (opt)
 * @param  {string}  sSource    The name of the module generating the message (opt)
 * @return {boolean}            True if the log operation was successful.
 */
YAHOO.log = function(sMsg, sCategory, sSource) {
    var l = YAHOO.widget.Logger;
    if(l && l.log) {
        return l.log(sMsg, sCategory, sSource);
    } else {
        return false;
    }
};

YAHOO.namespace("util");
YAHOO.namespace("widget");
YAHOO.namespace("example");
