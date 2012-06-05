/*

Version: 0.4

Copyright (C) 2012 by Mitermayer Reis

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

*/
(function( $ ){
/*
 *
 * Class: cstmForm
 * *Custom Forms* is a _Jquery___Pluggin_ that will make easier to customize form fields by creating flexible custom form elements.
 *
 * FORM FIELDS SUPPORT:
 * - Select 
 * - Checkbox
 * - Radio
 * - File uploader
 *
 *  USAGE:
 *
 *  *All Form elements:* 
 *  >   $('form').cstmForm() 
 *  *Select:* 
 *  >   $('select').cstmForm() 
 *  *Upload:* 
 *   >   $('input[type=file]').cstmForm()
 *  *Radio:* 
 *   >   $('input[type=radio]').cstmForm()
 *  *Radio, checkbox, select:* 
 *   >    $('input[type=radio], input[type=checkbox], select').cstmForm()
 *
 * DEFAULTS:
 *    settings - Default options 
 * >  settings = 
 * >  {
 * >      customEle      : 'a',
 * >      containerEle   : 'div',
 * >      classPrefix    : 'custom-',
 * >      autoHide       : 1, // Auto hide the stylized elements
 * >      active         : 0, // Load all custom form modules
 * >      select: {
 * >          active: 1,
 * >      },
 * >      radio: {
 * >          active: 1,
 * >      },
 * >      checkbox: {
 * >          active: 1,
 * >      },
 * >      file: {
 * >          active: 1,
 * >      },
 * >      text: {
 * >          active: 1,
 * >          prefix: 0,
 * >          suffix: 0,
 * >          prefix_txt: "Please enter ",
 * >          suffix_txt: "..",
 * >      }
 * >  }
 *
 * PARAMETERS:
 *
 *    options - object will overwrite default 
 *    - *Example* :
 * > $('form').cstmForm({ customEle: 'span' });
 *       
 */
  $.fn.cstmForm = function( options ) 
  {
        
    var $arr = this, // forms that will be affected, can be an array or a single object   

    settings = 
    {
        customEle      : 'a',
        containerEle   : 'div',
        classPrefix    : 'custom-',
        autoHide       : 1, // Auto hide the stylized elements
        active         : 0, // Load all custom form modules
        select: {
            active: 1
        },
        radio: {
            active: 1
        },
        checkbox: {
            active: 1
        },
        file: {
            active: 1
        },
        text: {
            active: 1,
            blur_color: "#777"
        }
    },

 /*
  *
  * Function: core  
  *
  * _Collection_ of *Helper functions*
  *
  * METHODS:
  *
  *   generate_id - Returns a new ID base on the name of the input 
  *   convert_to_name - String formating convert firstName FirstName first-name FIRST NAME to: First Name
  *   get_alphanumeric - Removes any weird caracters  
  *   sort_elements - Sort all form elements into their groups and returns an associative array of elements array. 
  *   load_modules - Load modules with their respective arrays as parameters 
  *
  */
    core = 
    {
        generate_id: function( $elem )
        {
            return settings.classPrefix + $elem.attr('name'); 
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
        sort_elements: function( $arr )
        {
            var c=[], r=[], f=[], s=[], t=[];

            $($arr).each( function() 
            {                
                if ($(this).is('input[type=checkbox]')) {
                    c.push($(this));
                } else if ($(this).is('input[type=radio]')) {
                    r.push($(this));
                } else if ( $(this).is('input[type=text]') || $(this).is('textarea') ) {
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
        if( settings.text.active || settings.active ) 
        {
            // Check support for placeholder
            var support_placeholder = ('placeholder' in document.createElement('input')),
                _defaultVal = {}; // store all the settings to do a quick validation

            $(arr).each( function() {  
                var $curEle = this,
                    text = $curEle.attr('placeholder');

                if( !support_placeholder && text )
                {
                    var name = $curEle.attr('name'),
                        _color = $curEle.css('color');

                    $curEle.val( text );
                    _defaultVal[name] = text;

                    var color = ( $.trim( $curEle.val() ) === _defaultVal[name] ||
                                $.trim( $curEle.val() ) === "" ) ? settings.text.blur_color : _color;

                    $curEle.css("color", color);

                    $curEle.focusin(
                        function()
                        {
                            if( $.trim( $curEle.val() ) === _defaultVal[name] )
                            {
                                $curEle.val("");
                            } 
                        }
                    )
                    .focusout(
                        function()
                        {
                            if( $.trim( $curEle.val() ) === "" )
                            {
                                $curEle.val( _defaultVal[name] );
                            }
                        }
                    );
                }
            });
        }
    },
        
 /*
  *
  * Function: checkbox
  *
  * Create custom checkboxes elements
  *
  *
  */
    checkbox = function(arr) 
    {
    // creates an element eg : <span id="custom-email" class="customForm-checkbox" >Email</span>
        if( settings.checkbox.active || settings.active )
        {

            $(arr).each( function() {  

              var $curEle = this, // creates a reference to this element          
                  newId = core.generate_id( $curEle );
               
              // generate the custom new elements before the element
              $curEle.before( $( "<" + settings.customEle +"/>", { 
                    id: newId, 
                    "class": settings.classPrefix + "checkbox", 
                    click: function(e) {
                        e.preventDefault(); // in case of settings.customEle as an a tag, prevent it to procced
                        
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

        }
    },
    
 /*
  *
  * Function: radio
  *
  * Create custom radio elements
  *
  *
  */
    radio = function(arr) 
    {
        if( settings.radio.active || settings.active )
        {

            var radios = arr; // create a reference to radios

            $(radios).each( function() { 
              var $curEle = this, // creates a reference to this element          
                  newId = core.generate_id( $curEle ) + '-' + $curEle.val();
                            
              // generate the custom new elements before the element
              $curEle.before( $( "<" + settings.customEle +"/>", { 
                    id: newId, 
                    "class": settings.classPrefix + "radio", 
                    click: function(e) {
                        e.preventDefault(); // in case of settings.customEle as an a tag, prevent it to procced
                        
                        $("." + settings.classPrefix + $curEle.attr('name')).removeClass('checked');
                        $(this).addClass('checked');
                        
                        // loop all and remove the 
                        $(radios).each( function() { 
                            $(this).hasClass(settings.classPrefix + $curEle.attr('name')).prop('checked', false);
                        });                       
                        $curEle.prop('checked', true);
                    }
              }));
              
              $('#' + newId).addClass(settings.classPrefix + $curEle.attr('name'));

              // in case a form was submitted to save the state of the currently checked button
              if ( $curEle.prop('checked') ) {
                $('#' + newId).addClass('checked');                
              }
              
              // hides this element
              $curEle.addClass('customForm-hidden');
            });

        }
    },
    
 /*
  *
  * Function: file
  *
  * Create custom upload file elements
  *
  *
  */
    file = function(arr) {        
        if( settings.file.active || settings.active )
        {
        
            $(arr).each( function() { 
            
                var $curEle = this,
                    newId = core.generate_id( $curEle ),
                    containerId = '#' + newId + "-container",
                    fileId = '#' + newId;
                
                core.hide_element( $(this), true );
                
                $curEle.before( $( "<" + settings.containerEle +"/>", { 
                        id: newId + "-container",
                        "class": settings.classPrefix + 'file-container'
                }));
               
                $(containerId).css('position', 'relative');
               
                $curEle.appendTo(containerId);
                
                $("<" + settings.customEle +"/>", {
                  "class": settings.classPrefix + "file", 
                  id: newId
                }).appendTo(containerId);
                
                $(fileId).html($('input[type=file]').val().split('\\').pop()); // this is where the text will be done
                
                $curEle.change(function() {
                    // this is the event to update file text
                    $(fileId).html($('input[type=file]').val().split('\\').pop());
                });
            });
        }
    },

 /*
  *
  * Function: select
  *
  * Create custom select elements
  *
  *
  */
    select = function(arr) {        

        if( settings.select.active || settings.active )
        {
            $(arr).each( function() { 
            
                var $curEle = this,
                    newId = core.generate_id( $curEle ),
                    containerId = '#' + newId + "-container",
                    selctId = '#' + newId;
                
                core.hide_element( $curEle, true );

                
                // Fix for mac to be able to change the height of select box
                $curEle.css({
                    '-webkit-appearance': 'none',
                    '-moz-appearance': 'none'
                });
                
                $curEle.before( $( "<" + settings.containerEle +"/>", { 
                        id: newId + "-container",
                        "class": settings.classPrefix + 'select-container'
                }));
               
                $(containerId).css('position', 'relative');
               
                $curEle.appendTo(containerId); // moves the selectbox to this container
                
                // create holding contairner
                $("<" + settings.customEle +"/>", {
                  "class": settings.classPrefix + "select", 
                  id: newId
                }).appendTo(containerId);
                
                // get starting text
                $(selctId).html($(containerId + " option:selected").text());

                // update text
                $curEle.change(function() {
                    $(selctId).html($(containerId + " option:selected").text());
                });
            });
        }

    },
    
 /*
  *
  * Function: init
  *
  * Auto loads Custom Forms
  *
  * PARAMETERS:
  * options - Associative array of options to overwritte default settings 
  * $arr - Array of elements
  *
  */
    init = function( options, $arr ) {        
        // check to for object, if it exists start the pluggin, else return
        if ( $arr.length ) 
        {
            // overwritte settings with options 
            settings = options ? $.extend({}, settings, options) : settings;

            // in case of trying the general ('form') get all form fields
            $arr = $arr.is('form') ? $('form').find(":input") : $arr; 

            //load the modules                  
            core.load_modules( core.sort_elements( $arr ) );                   
        }
    }( options, $arr );

  };
})( jQuery );
