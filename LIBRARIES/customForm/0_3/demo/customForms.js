/*

Version: 0.3

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


  textfields ( text, email, tel, password )
  data-cstText -
  data-cstPrefix -
  data-cstSuffix -
  data-cstClass -


*/
(function( $ ){
  
  $.fn.cstmForm = function( options ) 
  {
        
    var $arr = this, // forms that will be affected, can be an array or a single object   

    defaults = 
    {
    
        // box      :  the element that will be created as the custom replacement element.
        // wrapper  :  wrapper for the select box, and file
        // forms    :  pass id of the object as #id or it will search for all forms
        box            : 'a',
        wrappper       : 'div',
        prefix         : 'custom-',
        // Auto hide the styled elemtns
        autoHide       : 1,
        text: {
            prefix: 0,
            suffix: 0,
            prefix_txt: "Please enter ",
            suffix_txt: "..",
            customText: 
            {
                // example 
                // name: "Enter your name"
            },
            callback: function(){}
        }
    },

    core = 
    {
        generate_id: function( $elem )
        {
            return defaults.prefix + ( $elem.attr('name') || $elem.attr('id') ); // generate id based on name or id of the elment
        },
        hide_element: function( $elem, transparent )
        {
            // If transparent just hide with opacity else hide with normal display none
            if ( transparent )
            {
                $elem.css({ 
                     'opacity': '0',
                     'filter': 'alpha(opacity=0)',
                     '-moz-opacity': '0',
                     '-khtml-opacity': '0',
                     'position': 'absolute',
                     'top': '0px',
                     'left': '0px'
                }); 

            }
            else 
            {
                $(this).hide();
            }
        },
        convert_to_name: function( str )
        {
            // convert firstName FirstName first-name FIRST NAME to: First Name..
            // Also capitalize first letter in case of email : Email..
            // full name : Fullname..
            
            // check for capitalized letters
            // replace separators '-', '_', '.', ':'  for ' ' -> valid id, name separators
            // http://www.w3.org/TR/html401/types.html#type-cdata
            // Capitalize the first Letter
            // return string
            //var separators = /[\:._-]/g, jquery only allow '-' and '_' as separators
            
            var separators = /[\:._-]/g,
                s = str;
                
                s = str.replace( separators, " ");
                s = s.toLowerCase();
                s = s.split("");
                s[0] = s[0].toUpperCase();
                s = s.join("")

                return s;
        },
        get_alphanumeric: function( str ) 
        {
            var alphanumeric = /[^a-zA-Z_\s0-9]*/g;
            return $.trim( str.replace( alphanumeric, "") );
        },
        sort_elements: function( $arr )
        {
            var c=[], r=[], f=[], s=[], t=[];

            $($arr).each( function() 
            {                
                if ($(this).is('input[type=checkbox]')) {
                    c.push($(this));
                } else if ($(this).is('input[type=radio]')) {
                    r.push($(this));
                } else if ($(this).is('input[type=text]')) {
                    t.push($(this));
                } else if ($(this).is('input[type=file]')) {
                    f.push($(this));
                } else if ($(this).is('select')) {
                    s.push($(this));
                }                
            });   

            return { checkbox: c, radio: r, file: f, select: s, text: t };
        },
        load_modules: function( elems )
        {            
            if ( elems.checkbox.length ) {
                    checkbox( elems.checkbox );
            }
            if ( elems.select.length ) {
                    select( elems.select );
            }
            if ( elems.text.length ) {
                    text( elems.text );               
            }
            if ( elems.file.length ) {
                    file( elems.file );               
            }
            if ( elems.radio.length ) {
                    radio( elems.radio );               
            }
        }
    },

    text = function(arr)
    {
        // 1 - check for data-cstText
        // 2 - check for data-autoClear ( on click remove all data, on blur if empty restore previous )
        // 3 - if no data-cstText use the value from the input 
        // 4 - add new text with prefix and suffix 

        var _defaultVal = {}; // store all the defaults to do a quick validation

        $(arr).each( function() {  
            var $curEle = this,
                defaultVal, 
                name = $curEle.attr('name'),
                text = ( $curEle.attr('data-cstText') )
                     ? $curEle.attr('data-cstText') 
                     : name;



            // split name based on separators like '-' and '_'
            text = core.convert_to_name( text );

            // remoev weird caracters that may be on the lable like * ! or anythingg
            text = core.get_alphanumeric( text );

            // add prefix
            text = ( defaults.text.prefix ) 
                 ? defaults.text.prefix_txt + text 
                 : text;

            // add suffix
            text = ( defaults.text.suffix ) 
                 ? text + defaults.text.suffix_txt 
                 : text;

            $curEle.val( text );
            _defaultVal[name] = text;

            $curEle.focusin(
                function()
                {
                    if( $.trim( $curEle.val() ) == _defaultVal[name] )
                    {
                        $curEle.val("");
                    } 
                }
            )
            .focusout(
                function()
                {
                    if( $.trim( $curEle.val() ) == "" )
                    {
                        $curEle.val( _defaultVal[name] );
                    }
                }
            );

        });
    },
        
    checkbox = function(arr) 
    {
    // creates an element eg : <span id="custom-email" class="customForm-checkbox" >Email</span>

        $(arr).each( function() {  

          var $curEle = this, // creates a reference to this element          
              newId = core.generate_id( $curEle );
           
          // generate the custom new elements before the element
          $curEle.before( $( "<" + defaults.box +"/>", { 
                id: newId, 
                "class": defaults.prefix + "checkbox", 
                click: function(e) {
                    e.preventDefault(); // in case of defaults.box as an a tag, prevent it to procced
                    
                    $(this).toggleClass('checked'); 
                    
                    if ( $(this).hasClass('checked') ) {
                        $curEle.prop('checked', true);
                    } else {
                        $curEle.prop('checked', false);
                    }
                }
          }));

          // in case a form was submitted to save the state of the currently checked button
          if ( $curEle.prop('checked') ) {
            var newElementId = '#' + newId;
            $(newElementId).addClass('checked');
          }
          
          // hides this element
          $curEle.addClass('customForm-hidden');
        });
    },
    
    radio = function(arr) 
    {
    
          var radios = arr; // create a reference to radios
          
          $(radios).each( function() { 
              var $curEle = this, // creates a reference to this element          
                  newId = core.generate_id( $curEle ) + '-' + $curEle.val();
                            
              // generate the custom new elements before the element
              $curEle.before( $( "<" + defaults.box +"/>", { 
                    id: newId, 
                    "class": defaults.prefix + "radio", 
                    click: function(e) {
                        e.preventDefault(); // in case of defaults.box as an a tag, prevent it to procced
                        
                        $("." + defaults.prefix + "radio").removeClass('checked');
                        $(this).addClass('checked');
                        
                        // loop all and remove the 
                        $(radios).each( function() { 
                            $(this).prop('checked', false);
                        });                       
                        $curEle.prop('checked', true);
                    }
              }));
              
              $('#' + newId).addClass(defaults.prefix + $curEle.attr('name'));
            
              // in case a form was submitted to save the state of the currently checked button
              if ( $curEle.prop('checked') ) {
                $('#' + newId).addClass('checked');                
              }
              
              // hides this element
              $curEle.addClass('customForm-hidden');
         });
    },
    
    file = function(arr) {        
        
        $(arr).each( function() { 
        
            var $curEle = this,
                newId = core.generate_id( $curEle ),
                containerId = '#' + newId + "-container",
                fileId = '#' + newId;
            
            core.hide_element( $(this), true );
            
            $curEle.before( $( "<" + defaults.wrappper +"/>", { 
                    id: newId + "-container",
                    "class": defaults.prefix + 'file-container'
            }));
           
            $(containerId).css('position', 'relative');
           
            $curEle.appendTo(containerId);
            
            $("<" + defaults.box +"/>", {
              "class": defaults.prefix + "file", 
              id: newId
            }).appendTo(containerId);
            
            $(fileId).html($('input[type=file]').val().split('\\').pop()); // this is where the text will be done
            
            $curEle.change(function() {
                // this is the event to update file text
                $(fileId).html($('input[type=file]').val().split('\\').pop());
            });
        });
    },

    select = function(arr) {        
        
        $(arr).each( function() { 
        
            var $curEle = this,
                newId = core.generate_id( $curEle ),
                containerId = '#' + newId + "-container",
                selctId = '#' + newId;
            
            core.hide_element( $curEle, true );
            
            $curEle.before( $( "<" + defaults.wrappper +"/>", { 
                    id: newId + "-container",
                    "class": defaults.prefix + 'select-container'
            }));
           
            $(containerId).css('position', 'relative');
           
            $curEle.appendTo(containerId); // moves the selectbox to this container
            
            // create holding contairner
            $("<" + defaults.box +"/>", {
              "class": defaults.prefix + "select", 
              id: newId
            }).appendTo(containerId);
            
            // get starting text
            $(selctId).html($(containerId + " option:selected").text());

            // update text
            $curEle.change(function() {
                $(selctId).html($(containerId + " option:selected").text());
            });
        });
    };
    
    (function( options, $arr ) {        
        // check to for object, if it exists start the pluggin, else return
        if ( $arr.length ) 
        {
            // overwritte defaults with options 
            defaults = options ? $.extend({}, defaults, options) : defaults;

            // in case of trying the general ('form') get all form fields
            $arr = $arr.is('form') ? $('form').find(":input") : $arr; 

            //load the modules                  
            core.load_modules( core.sort_elements( $arr ) );                   
        }
    }( options, $arr ));

  };
})( jQuery );
