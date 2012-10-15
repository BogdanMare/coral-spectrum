(function($) {
  CUI.DropdownList = new Class(/** @lends CUI.DropdownList# */{
    toString: 'DropdownList',
    extend: CUI.Widget,
    
    /**
      @extends CUI.Widget
      @classdesc A dropdown list widget
      
      
      @desc Creates a dropdown list appended to any DOM element
      @constructs
      
      @param {Object}   options                               Component options
      @param {Array}   options.options                Array of options in the list
      @param {Array}   options.optionRenderer                Callback function to render one option
      
    */
    construct: function(options) {
        this.selectedIndices = []; // Initialise fresh array
        this.$element.on('change:options', this._changeOptions.bind(this));
        
        // Listen to events 
        this.$element.on("keydown", "", this._keyPressed.bind(this));
        
        var hideTimeout = null; // Hacky: Remove hide timeout if element is focussed right after blur!
        this.$element.on("blur", "", function() {
            hideTimeout = this.hide(200);
        }.bind(this));
        this.$element.on("focus", "", function() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        }.bind(this)); 
       
    },
    
    defaults: {
        optionRenderer: null,
        options: ["Apples", "Pears", "Bananas", "Strawberries"],
        placeholder: "Select me"
    },
    
    listElement: null,
    currentIndex: -1,
        
    show: function() {
        // Hide old list (if any!)
        this._unrender();
        this.currentIndex = -1;
        this.$element.focus();
        this._render();
    },
    
    hide: function(delay) {
        if (delay > 0) {
            return setTimeout(this._unrender.bind(this), delay);
        } else {
            this._unrender();
        }
        return null;
    },
    
    toggle: function() {
      if (this.listElement) {
          this.hide();
      } else {
          this.show();
      }
    },
    
    update: function() {
        this._unrender();
        this._render();
    },
    
    _changeOptions: function() {
        this.selectedIndex = -1;
        this.selectedIndices = [];
        this._render();
    },
    
    _keyPressed: function(event) {        
        var key = event.keyCode;
        
        // Only listen to keys if there is an autocomplete box right now
        if (!this.listElement) {
            return;
        }

        var currentIndex = this.currentIndex;
        
        if (key === 38) { // up
            event.preventDefault();
            if (currentIndex > 0) currentIndex--;
        }
        
        if (key === 40) { // down
            event.preventDefault();
            if (currentIndex < (this.listElement.children().length - 1)) currentIndex++;
        }
        
        if (key === 27) { // escape
            event.preventDefault();
            this.hide();
            return;
        }
        
        if (key === 13 || key === 20) { // return or space
           event.preventDefault();
           if (currentIndex >= 0) {
                this._triggerSelect(currentIndex);
                return;
           }
        }
        
        this.currentIndex = currentIndex;

        // Set new css classes
        this.listElement.children().removeClass("selected");
        if (currentIndex >= 0) $(this.listElement.children().get(currentIndex)).addClass("selected");
        
        return;
    },
    _unrender: function() {
        if (this.listElement) {
            this.listElement.remove();
            this.listElement = null;        
        }
    },
    _render: function() {
        var options = this.options.options;
        if (options.length === 0) return;
               
        var list = $("<ul class=\"dropdown-list\">");
        list.width(this.$element.outerWidth());
        
        $.each(options, function(index, value) {
            var el = (this.options.optionRenderer) ? this.options.optionRenderer(index, value) : $("<span>" + value + "</span>");
            var li = $("<li data-id=\"" + index + "\">");
            if (index === this.currentIndex) li.addClass("selected");
            li.append(el);
            list.append(li);
        }.bind(this));
        
        list.on("click", "li", function(event) {
           this._triggerSelect($(event.target).closest("li").attr("data-id"));
        }.bind(this));
        
        // Calculate correct position and size on screen
        var el = this.$element;
        var left = el.position().left + parseFloat(el.css("margin-left"));
        var top = el.position().top + el.outerHeight(true) - parseFloat(el.css("margin-bottom"));
        var width = el.outerWidth(false);
        
        list.css({position: "absolute",
                  left: left + "px", 
                  top: top + "px", 
                  width: width + "px"});

        this.listElement = list;
        this.$element.after(list);

    },
    
    _triggerSelect: function(index) {
    // Trigger a change event
        this.$element.focus();
        var e = $.Event('dropdown-list:select', {
          selectedIndex: index
        });
        this.$element.trigger(e);    
    }
    
  });

  CUI.util.plugClass(CUI.DropdownList);
}(window.jQuery));
