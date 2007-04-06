


/**
* Creates a list of options or commands which are made visible in response to 
* an HTML element's "contextmenu" event ("mousedown" for Opera).
*
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the context menu.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;select&#62;</code> element to be used as the data source for the 
* context menu.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object specifying the 
* <code>&#60;div&#62;</code> element of the context menu.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-94282980">HTMLSelectElement</a>} p_oElement Object specifying 
* the <code>&#60;select&#62;</code> element to be used as the data source for 
* the context menu.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the context menu. See configuration class documentation 
* for more details.
* @class ContextMenu
* @constructor
* @extends YAHOO.widget.Menu
* @namespace YAHOO.widget
*/
YAHOO.widget.ContextMenu = function(p_oElement, p_oConfig) {

    YAHOO.widget.ContextMenu.superclass.constructor.call(
            this, 
            p_oElement,
            p_oConfig
        );

};


/**
* Constant representing the name of the ContextMenu's events
* @property YAHOO.widget.ContextMenu._EVENT_TYPES
* @private
* @final
* @type Object
*/
YAHOO.widget.ContextMenu._EVENT_TYPES = {

    "TRIGGER_CONTEXT_MENU": "triggerContextMenu",

    "CONTEXT_MENU": (
                        (YAHOO.widget.Module.prototype.browser == "opera" ? 
                            "mousedown" : "contextmenu")
                    ),
    "CLICK": "click"

};


/**
* Constant representing the ContextMenu's configuration properties
* @property YAHOO.widget.ContextMenu._DEFAULT_CONFIG
* @private
* @final
* @type Object
*/
YAHOO.widget.ContextMenu._DEFAULT_CONFIG = {

    "TRIGGER": { 
        key: "trigger" 
    }

};


YAHOO.lang.extend(YAHOO.widget.ContextMenu, YAHOO.widget.Menu, {



// Private properties


/**
* @property _oTrigger
* @description Object reference to the current value of the "trigger" 
* configuration property.
* @default null
* @private
* @type String|<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/leve
* l-one-html.html#ID-58190037">HTMLElement</a>|Array
*/
_oTrigger: null,


/**
* @property _bCancelled
* @description Boolean indicating if the display of the context menu should 
* be cancelled.
* @default false
* @private
* @type Boolean
*/
_bCancelled: false,



// Public properties


/**
* @property contextEventTarget
* @description Object reference for the HTML element that was the target of the
* "contextmenu" DOM event ("mousedown" for Opera) that triggered the display of 
* the context menu.
* @default null
* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-58190037">HTMLElement</a>
*/
contextEventTarget: null,



// Events


/**
* @event triggerContextMenuEvent
* @description Custom Event wrapper for the "contextmenu" DOM event 
* ("mousedown" for Opera) fired by the element(s) that trigger the display of 
* the context menu.
*/
triggerContextMenuEvent: null,



/**
* @method init
* @description The ContextMenu class's initialization method. This method is 
* automatically called by the constructor, and sets up all DOM references for 
* pre-existing markup, and creates required markup if it is not already present.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;div&#62;</code> element of the context menu.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;select&#62;</code> element to be used as the data source for 
* the context menu.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object specifying the 
* <code>&#60;div&#62;</code> element of the context menu.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-
* html.html#ID-94282980">HTMLSelectElement</a>} p_oElement Object specifying 
* the <code>&#60;select&#62;</code> element to be used as the data source for 
* the context menu.
* @param {Object} p_oConfig Optional. Object literal specifying the 
* configuration for the context menu. See configuration class documentation 
* for more details.
*/
init: function(p_oElement, p_oConfig) {

    if(!this.ITEM_TYPE) {

        this.ITEM_TYPE = YAHOO.widget.ContextMenuItem;

    }


    // Call the init of the superclass (YAHOO.widget.Menu)

    YAHOO.widget.ContextMenu.superclass.init.call(this, p_oElement);


    this.beforeInitEvent.fire(YAHOO.widget.ContextMenu);


    if(p_oConfig) {

        this.cfg.applyConfig(p_oConfig, true);

    }
    
    
    this.initEvent.fire(YAHOO.widget.ContextMenu);
    
},


/**
* @method initEvents
* @description Initializes the custom events for the context menu.
*/
initEvents: function() {

	YAHOO.widget.ContextMenu.superclass.initEvents.call(this);

    // Create custom events

    this.triggerContextMenuEvent = 

            new YAHOO.util.CustomEvent(
                    YAHOO.widget.ContextMenu._EVENT_TYPES.TRIGGER_CONTEXT_MENU, 
                    this
                );

},


/**
* @method cancel
* @description Cancels the display of the context menu.
*/
cancel: function() {

    this._bCancelled = true;

},



// Private methods


/**
* @method _removeEventHandlers
* @description Removes all of the DOM event handlers from the HTML element(s) 
* whose "context menu" event ("click" for Opera) trigger the display of 
* the context menu.
* @private
*/
_removeEventHandlers: function() {

    var Event = YAHOO.util.Event,
        oTrigger = this._oTrigger;


    // Remove the event handlers from the trigger(s)

    if (oTrigger) {

        Event.removeListener(
            oTrigger, 
            YAHOO.widget.ContextMenu._EVENT_TYPES.CONTEXT_MENU, 
            this._onTriggerContextMenu
        );    
        
        if(this.browser == "opera") {
        
            Event.removeListener(
                oTrigger, 
                YAHOO.widget.ContextMenu._EVENT_TYPES.CLICK, 
                this._onTriggerClick
            );
    
        }

    }

},



// Private event handlers


/**
* @method _onTriggerClick
* @description "click" event handler for the HTML element(s) identified as the 
* "trigger" for the context menu.  Used to cancel default behaviors in Opera.
* @private
* @param {Event} p_oEvent Object representing the DOM event object passed back 
* by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu Object representing the context 
* menu that is handling the event.
*/
_onTriggerClick: function(p_oEvent, p_oMenu) {

    if(p_oEvent.ctrlKey) {
    
        YAHOO.util.Event.stopEvent(p_oEvent);

    }
    
},


/**
* @method _onTriggerContextMenu
* @description "contextmenu" event handler ("mousedown" for Opera) for the HTML 
* element(s) that trigger the display of the context menu.
* @private
* @param {Event} p_oEvent Object representing the DOM event object passed back 
* by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.ContextMenu} p_oMenu Object representing the context 
* menu that is handling the event.
*/
_onTriggerContextMenu: function(p_oEvent, p_oMenu) {

    var Event = YAHOO.util.Event;

    if(p_oEvent.type == "mousedown" && !p_oEvent.ctrlKey) {

        return;

    }


    /*
        Prevent the browser's default context menu from appearing and 
        stop the propagation of the "contextmenu" event so that 
        other ContextMenu instances are not displayed.
    */

    Event.stopEvent(p_oEvent);


    // Hide any other ContextMenu instances that might be visible

    YAHOO.widget.MenuManager.hideVisible();


    this.contextEventTarget = Event.getTarget(p_oEvent);

    this.triggerContextMenuEvent.fire(p_oEvent);


    if(!this._bCancelled) {

        // Position and display the context menu
    
        this.cfg.setProperty("xy", Event.getXY(p_oEvent));

        this.show();

    }

    this._bCancelled = false;

},



// Public methods


/**
* @method toString
* @description Returns a string representing the context menu.
* @return {String}
*/
toString: function() {

    return ("ContextMenu " + this.id);

},


/**
* @method initDefaultConfig
* @description Initializes the class's configurable properties which can be 
* changed using the context menu's Config object ("cfg").
*/
initDefaultConfig: function() {

    YAHOO.widget.ContextMenu.superclass.initDefaultConfig.call(this);

    /**
    * @config trigger
    * @description The HTML element(s) whose "contextmenu" event ("mousedown" 
    * for Opera) trigger the display of the context menu.  Can be a string 
    * representing the id attribute of the HTML element, an object reference 
    * for the HTML element, or an array of strings or HTML element references.
    * @default null
    * @type String|<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
    * level-one-html.html#ID-58190037">HTMLElement</a>|Array
    */
    this.cfg.addProperty(
        YAHOO.widget.ContextMenu._DEFAULT_CONFIG.TRIGGER.key, 
        { handler: this.configTrigger }
    );

},


/**
* @method destroy
* @description Removes the context menu's <code>&#60;div&#62;</code> element 
* (and accompanying child nodes) from the document.
*/
destroy: function() {

    // Remove the DOM event handlers from the current trigger(s)

    this._removeEventHandlers();
    

    // Continue with the superclass implementation of this method

    YAHOO.widget.ContextMenu.superclass.destroy.call(this);

},



// Public event handlers for configuration properties


/**
* @method configTrigger
* @description Event handler for when the value of the "trigger" configuration 
* property changes. 
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.ContextMenu} p_oMenu Object representing the context 
* menu that fired the event.
*/
configTrigger: function(p_sType, p_aArgs, p_oMenu) {
    
    var Event = YAHOO.util.Event,
        oTrigger = p_aArgs[0];

    if(oTrigger) {

        /*
            If there is a current "trigger" - remove the event handlers 
            from that element(s) before assigning new ones
        */

        if(this._oTrigger) {
        
            this._removeEventHandlers();

        }

        this._oTrigger = oTrigger;


        /*
            Listen for the "mousedown" event in Opera b/c it does not 
            support the "contextmenu" event
        */ 
  
        Event.on(
            oTrigger, 
            YAHOO.widget.ContextMenu._EVENT_TYPES.CONTEXT_MENU, 
            this._onTriggerContextMenu,
            this,
            true
        );


        /*
            Assign a "click" event handler to the trigger element(s) for
            Opera to prevent default browser behaviors.
        */

        if(this.browser == "opera") {
        
            Event.on(
                oTrigger, 
                YAHOO.widget.ContextMenu._EVENT_TYPES.CLICK, 
                this._onTriggerClick,
                this,
                true
            );

        }

    }
    else {
   
        this._removeEventHandlers();
    
    }
    
}

}); // END YAHOO.lang.extend