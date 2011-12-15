(function( $ ){

  $.fn.cstmForm = function( options ) {
        
    var selector = this; // forms that will be affected, can be an array or a single object    
    var settings = {
    
        // box      :  the element that will be created as the custom replacement element.
        // wrapper  :  wrapper for the select box
        // forms    :  pass id of the object as #id or it will search for all forms
        'box'         : 'a',
        'wrappper'    : 'span',
        'prefix'      : 'custom-'
    }; 
    
    var checkbox = function(arr) {
    // creates an element eg : <span id="custom-email" class="customForm-checkbox" >Email</span>

        $(arr).each( function() {  

          var currentElement = this; // creates a reference to this element          
          var newId = settings.prefix + ( $(currentElement).attr('name') || $(currentElement).attr('id') );  // generate id based on name or id of the elment
           
          // generate the custom new elements before the element
          $(this).before( $( "<" + settings.box +"/>", { 
                id: newId, 
                "class": settings.prefix + "checkbox", 
                click: function(e) {
                    e.preventDefault(); // in case of settings.box as an a tag, prevent it to procced
                    
                    $(this).toggleClass('checked'); 
                    
                    if ( $(this).hasClass('checked') ) {
                        $(currentElement).attr('checked', 'checked');
                    } else {
                        $(currentElement).attr('checked', '');
                    }
                }
          }));

          // in case a form was submitted to save the state of the currently checked button
          if ( $(currentElement).attr('checked') ) {
            var newElementId = '#' + newId;
            $(newElementId).addClass('checked');
          }
          
          // hides this element
          $(this).addClass('customForm-hidden');
        });
    };
    
    var radio = function(arr) {
    
          var radios = arr; // create a reference to radios
          
          $(radios).each( function() { 
              var currentElement = this; // creates a reference to this element          
              var newId = settings.prefix + ( $(currentElement).attr('name') || $(currentElement).attr('id') ) + "-" + $(currentElement).attr('value') ;  // generate id based on name or id of the elment
                            
              // generate the custom new elements before the element
              $(this).before( $( "<" + settings.box +"/>", { 
                    id: newId, 
                    "class": settings.prefix + "radio", 
                    click: function(e) {
                        e.preventDefault(); // in case of settings.box as an a tag, prevent it to procced
                        
                        $("." + settings.prefix + "radio").removeClass('checked');
                        $(this).addClass('checked');
                        
                        // loop all and remove the 
                        $(radios).each( function() { 
                            $(this).attr('checked', '');
                        });                       
                        $(currentElement).attr('checked', 'checked');
                    }
              }));
              
              var newElementId = '#' + newId;
              $(newElementId).addClass(settings.prefix + $(currentElement).attr('name'));
            
              // in case a form was submitted to save the state of the currently checked button
              if ( $(currentElement).attr('checked') ) {
                var newElementId = '#' + newId;
                $(newElementId).addClass('checked');                
              }
              
              // hides this element
              $(this).addClass('customForm-hidden');
         });
    };
    
    var select = function(arr) {        
        
        $(arr).each( function() { 
        
            var currentElement = this;
            var newId = settings.prefix + ( $(currentElement).attr('name') || $(currentElement).attr('id') );  // generate id based on name or id of the element
            var containerId = '#' + newId + "-container";
            var selctId = '#' + newId;
            
            // hides the select box
            $(this).css({ 
                 'opacity': '0',
                 'filter': 'alpha(opacity=0)',
                 '-moz-opacity': '0',
                 '-khtml-opacity': '0'
            }); 
            
            $(this).before( $( "<" + settings.wrappper +"/>", { 
                    id: newId + "-container"
            }));
           
            $(containerId).css('position', 'relative');
           
            $(currentElement).appendTo(containerId); // moves the selectbox to this container
            
            $("<" + settings.box +"/>", {
              "class": settings.prefix + "select", 
              id: newId,
              text: 'teste'
            }).appendTo(containerId);
            
            $(selctId).html($(containerId + " option:selected").text());
            
            $(this).css('position', 'absolute');
            $(this).css('top', '0px');
            $(this).css('left', '0px');
            
            $(this).change(function() {
                $(selctId).html($(containerId + " option:selected").text());
            });
        });
    };
    
    var module = {
        'checkbox' : function(arr) { checkbox(arr); },
        'radio'    : function(arr) { radio(arr); },
        'select'   : function(arr) { select(arr); }
    };
    
    var init = function( options, selector, module ) {
        
        // check to for object, if it exists start the pluggin, else return
        if ( selector.length ) {

            if ( options ) {
               $.extend( settings, options ); // if options are passed, overlap the settings with the new options
            }
            
            // the elements will be stored in here
            var checkbox = [],
                radio = [],
                select = [];
            
            if (selector.is('form')) {
                selector = $('form').find(":input");
            }            
           
            $(selector).each( function(index) {                
                if ($(this).is('input[type=checkbox]')) {
                    checkbox.push($(this));
                } else if ($(this).is('input[type=radio]')) {
                    radio.push($(this));
                } else if ($(this).is('select')) {
                    select.push($(this));
                }                
            });   
           
            
            if ( checkbox.length ) {
                    module.checkbox( checkbox );
            }
            if ( select.length ) {
                    module.select( select );
            }
            if ( radio.length ) {
                    module.radio( radio );               
            }
            
                   
        } else {
            return false;
        }
    }( options, selector, module );

  };
})( jQuery );
