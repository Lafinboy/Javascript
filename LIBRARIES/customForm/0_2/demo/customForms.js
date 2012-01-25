/*

Version: 0.2

Copyright (C) 2011 by Mitermayer Reis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---------------------------------------------------------------------------

 USE LIKE THIS:
  
  To get just some elements:
  // $('select').cstmForm();  
  // $('input[type=radio];  
  // $('input[type=radio], input[type=checkbox], select').cstmForm();
  
  Or just set it auto for every element
  // $('form').cstmForm();

*/

(function( $ ){
  "use strict";
  $.fn.cstmForm = function( options ) {
        
    var selector = this; // forms that will be affected, can be an array or a single object    
    var settings = {
    
        // box      :  the element that will be created as the custom replacement element.
        // wrapper  :  wrapper for the select box
        // forms    :  pass id of the object as #id or it will search for all forms
        'box'         : 'a',
        'wrappper'    : 'div',
        'prefix'      : 'custom-'
    }; 
    
    var checkbox = function(arr) {
    // creates an element eg : <span id="custom-email" class="customForm-checkbox" >Email</span>

        $(arr).each( function() 
        {

          var $currentElement = this, // creates a reference the input element
              newId = settings.prefix + ( $currentElement.attr('name') || $currentElement.attr('id') );  // generate id based on name or id of the elment

          // generate the custom new elements before the element
          $currentElement.before( $( "<" + settings.box +"/>", { 
                id: newId, 
                "class": settings.prefix + "checkbox", 
                click: function(e) {
                    e.preventDefault(); // in case of settings.box as an a tag, prevent it to procced
                    
                    $(this).toggleClass('checked'); 
                    var checked = $(this).hasClass('checked') ? 'checked' : ''; 
                    $currentElement.attr('checked', checked);
                }
          }));

          // in case a form was submitted to save the state of the currently checked button
          if ( $currentElement.attr('checked') ) {
            $('#' + newId).addClass('checked');
          }
          
          // hides this element
          $currentElement.addClass('customForm-hidden');
        });

    };
    
    var radio = function(arr) {
    
          var radios = arr; // create a reference to radios
          
          $(radios).each( function() { 
              var currentElement = this, // creates a reference to this element          
                  newId = settings.prefix + ( $(currentElement).attr('id') || $(currentElement).attr('name') ) + "-" + $(currentElement).attr('value');  // generate id based on name or id of the elment
                            
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
              
              $('#' + newId).addClass(settings.prefix + $(currentElement).attr('name'));
            
              // in case a form was submitted to save the state of the currently checked button
              if ( $(currentElement).attr('checked') ) {
                $('#' + newId).addClass('checked');                
              }
              
              // hides this element
              $(this).addClass('customForm-hidden');
         });
    };
    
    var file = function(arr) {        
        
        $(arr).each( function() { 
        
            var currentElement = this,
                newId = settings.prefix + ( $(currentElement).attr('id') || $(currentElement).attr('name') ),  // generate id based on name or id of the element
                containerId = '#' + newId + "-container",
                fileId = '#' + newId;
            
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
           
            $(currentElement).appendTo(containerId);
            
            $("<" + settings.box +"/>", {
              "class": settings.prefix + "file", 
              id: newId
            }).appendTo(containerId);
            
            $(fileId).html($('input[type=file]').val().split('\\').pop()); // this is where the text will be done
            
            $(this).css('position', 'absolute');
            $(this).css('top', '0px');
            $(this).css('left', '0px');
            
            $(this).change(function() {
                // this is the event to update file text
                $(fileId).html($('input[type=file]').val().split('\\').pop());
            });
        });
    };

    var select = function(arr) {        
        
        $(arr).each( function() { 
        
            var currentElement = this,
                newId = settings.prefix + ( $(currentElement).attr('id') || $(currentElement).attr('name') ),  // generate id based on name or id of the element
                containerId = '#' + newId + "-container",
                selctId = '#' + newId;
            
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
              id: newId
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
    
    var load_module = {
        'checkbox' : function(arr) { checkbox(arr); },
        'radio'    : function(arr) { radio(arr); },
        'file'     : function(arr) { file(arr); },
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
                file = [],
                select = [];
            
            if (selector.is('form')) {
                selector = $('form').find(":input");
            }            
           
            $(selector).each( function(index) {                
                if ($(this).is('input[type=checkbox]')) {
                    checkbox.push($(this));
                } else if ($(this).is('input[type=radio]')) {
                    radio.push($(this));
                } else if ($(this).is('input[type=file]')) {
                    file.push($(this));
                } else if ($(this).is('select')) {
                    select.push($(this));
                }                
            });   
           
            
            if ( checkbox.length ) {
                    load_module.checkbox( checkbox );
            }
            if ( select.length ) {
                    load_module.select( select );
            }
            if ( file.length ) {
                    load_module.file( file );               
            }
            if ( radio.length ) {
                    load_module.radio( radio );               
            }
            
                   
        } else {
            return false;
        }
    }( options, selector, load_module );

  };
})( jQuery );
