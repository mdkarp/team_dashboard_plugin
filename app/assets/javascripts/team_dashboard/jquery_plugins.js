(function($, _) {
  "use strict";


  // var selectableMethods = {
  //   init : function(options) {
  //     var defaults = {};
  //     options = $.extend(defaults, options);

  //     var $result = $(this);
  //     var $container = null;
  //     var list = null;

  //     $result.hide();

  //     cleanupControls();
  //     createControls();

  //     var $input     = $result.parent().find(".selectable-input"),
  //         $list      = $result.parent().find(".selectable-list"),
  //         $remove    = $result.parent().find(".remove"),
  //         // $add       = $result.parent().find(".add"),
  //         $browse    = $result.parent().find(".browse");

  //     populate();
  //     hideListIfEmpty();

  //     function cleanupControls() {
  //       $result.parent().find(".selectable-container").remove();
  //     }

  //     function hideListIfEmpty() {
  //       if ($result.val().length === 0) {
  //         $list.hide();
  //       }
  //     }

  //     function createControls() {
  //       var input        = "<input class='selectable-input' type='text' size='16' placeholder='Enter target to add'></input>",
  //           browseButton = "<button class='btn browse' type='button'><i class='icon-search icon-white'></i></button>",
  //           addButton    = "<button class='btn add' type='button'><i class='icon-plus icon-white'></i></button>",
  //           inputAppend  = "<div class='input-append'>" + input + browseButton + "</div>",
  //           list         = "<ul class='selectable-list input-large list'></ul>",
  //           container    = "<div class='selectable-container'>" + inputAppend + list + "</div>";
  //       $container = $(container);
  //       $result.after($container);
  //     }

  //     function populate() {
  //       var values = $result.val().split(";");
  //       values = _.map(values, function(value) {
  //         return { name: value };
  //       });
  //       var listOptions = {
  //         item: template()
  //       };

  //       list = new List($container[0], listOptions, values);
  //     }

  //     function addItem() {
  //       $list.show();

  //       var value = $input.val();
  //       list.add({ name: value});
  //       updateResult();
  //       $input.val("");
  //     }

  //     function template() {
  //       var iconEdit = "<span class='edit icon-wrench'></span>",
  //           iconRemove = "<span class='remove icon-remove'></span>",
  //           icons, text, li = null;

  //       icons = "<span class='actions'>";
  //       if (options.editCallback) {
  //         icons += iconEdit;
  //       }
  //       icons += iconRemove + "</span>";

  //       text  = "<span class='text name'></span>",
  //       li    = "<li>"+ text + icons +"</li>";

  //       return li;
  //     }

  //     function updateResult() {
  //       var listValues = _.map(list.items, function(el) {
  //           return el.values().name;
  //       }).join(";");
  //       $result.val(listValues);
  //       hideListIfEmpty();
  //     }

  //     function handleKeyboardAdd(event) {
  //       if (event.keyCode == 13 && $input.val().length > 0) {
  //         addItem();
  //       }
  //     }

  //     function handleRemove(event) {
  //       var selectedValue = $(event.currentTarget).closest("li").find(".name").text();
  //       list.remove("name", selectedValue);
  //       updateResult();
  //     }

  //     function handleEdit(event) {
  //       var selectedValue = $(event.currentTarget).closest("li").find(".name").text();
  //       if (options.editCallback) {
  //         options.editCallback(selectedValue, event);
  //       }
  //     }

  //     function handleButtonAdd(event) {
  //       if ($input.val().length > 0) {
  //         addItem();
  //       }
  //     }

  //     function handleButtonBrowse(event) {
  //       if (options.browseCallback) {
  //         options.browseCallback(event);
  //       }
  //     }

  //     $input.keyup(handleKeyboardAdd);
  //     $result.parent().on("click", "li > .actions .remove", handleRemove);
  //     $result.parent().on("click", "li > .actions .edit", handleEdit);
  //     // $add.on("click", handleButtonAdd);
  //     $browse.on("click", handleButtonBrowse);
  //   },

  //   disable : function() {
  //     var $result = $(this);
  //     $result.show();
  //     $result.parent().find(".selectable-container").remove();
  //   },

  //   // update selected list entry
  //   update: function(before, after) {
  //     var $result = $(this);
  //     var $list   = $result.parent().find(".selectable-list");

  //     var listValues = $list.find("li>span.text").map(function(i, n) {
  //         return $(n).clone().children().remove().end().text();
  //     }).get();

  //     var index = _.indexOf(listValues, before);
  //     listValues[index] = after;

  //     $result.val(listValues.join(';'));

  //     var $li = $list.find("li:nth-child("+(index+1)+")");
  //     $li.find("span.text").text(after);
  //   }
  // };

  // $.fn.selectable = function(method) {
  //   if ( selectableMethods[method] ) {
  //     return selectableMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
  //   } else if ( typeof method === 'object' || ! method ) {
  //     return selectableMethods.init.apply( this, arguments );
  //   } else {
  //     $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
  //   }
  // };

  $.fn.insertAtCaret = function(myValue) {
    return this.each(function(i) {
      if (document.selection) {
        //For browsers like Internet Explorer
        this.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      } else if (this.selectionStart || this.selectionStart == '0') {
        //For browsers like Firefox and Webkit based
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    });
  };

})($, _);