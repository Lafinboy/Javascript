/*

Version: 0.3

Jquery 1.6 +

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
  // $('input[type=file];  
  // $('input[type=radio], input[type=checkbox], select').cstmForm();
  
  Or just set it auto for every element
  // $('form').cstmForm();
  //
  Support for File, Select, Checkbox and Radio buttons, cross browser placeholder

*/
(function(a){a.fn.cstmForm=function(h){var c={customEle:"a",containerEle:"div",classPrefix:"custom-",autoHide:1,active:0,select:{active:1},radio:{active:1},checkbox:{active:1},file:{active:1},text:{active:1,blur_color:"#777"}},g={generate_id:function(a){return c.classPrefix+a.attr("name")},hide_element:function(c,b){b?c.css({opacity:"0",filter:"alpha(opacity=0)","-moz-opacity":"0","-khtml-opacity":"0",position:"absolute",top:"0px",left:"0px"}):a(this).hide()},sort_elements:function(c){var b=[],d= [],e=[],g=[],i=[];a(c).each(function(){a(this).is("input[type=checkbox]")?b.push(a(this)):a(this).is("input[type=radio]")?d.push(a(this)):a(this).is("input[type=text]")?i.push(a(this)):a(this).is("input[type=file]")?e.push(a(this)):a(this).is("select")&&g.push(a(this))});return{checkbox:b,radio:d,file:e,select:g,text:i}},load_modules:function(a){a.checkbox.length&&j(a.checkbox);a.select.length&&k(a.select);a.text.length&&l(a.text);a.file.length&&m(a.file);a.radio.length&&n(a.radio)}},l=function(f){if(c.text.active|| c.active){var b="placeholder"in document.createElement("input"),d={};a(f).each(function(){var e=this,f=e.attr("placeholder");if(!b&&f){var g=e.attr("name"),h=e.css("color");e.val(f);d[g]=f;f=a.trim(e.val())===d[g]||""===a.trim(e.val())?c.text.blur_color:h;e.css("color",f);e.focusin(function(){a.trim(e.val())===d[g]&&e.val("")}).focusout(function(){""===a.trim(e.val())&&e.val(d[g])})}})}},j=function(f){(c.checkbox.active||c.active)&&a(f).each(function(){var b=this,d=g.generate_id(b);b.before(a("<"+ c.customEle+"/>",{id:d,"class":c.classPrefix+"checkbox",click:function(c){c.preventDefault();a(this).toggleClass("checked");a(this).hasClass("checked")?b.prop("checked",!0):b.prop("checked",!1)}}));b.prop("checked")&&a("#"+d).addClass("checked");b.addClass("customForm-hidden")})},n=function(f){(c.radio.active||c.active)&&a(f).each(function(){var b=this,d=g.generate_id(b)+"-"+b.val();b.before(a("<"+c.customEle+"/>",{id:d,"class":c.classPrefix+"radio",click:function(d){d.preventDefault();a("."+c.classPrefix+ "radio").removeClass("checked");a(this).addClass("checked");a(f).each(function(){a(this).prop("checked",!1)});b.prop("checked",!0)}}));a("#"+d).addClass(c.classPrefix+b.attr("name"));b.prop("checked")&&a("#"+d).addClass("checked");b.addClass("customForm-hidden")})},m=function(f){(c.file.active||c.active)&&a(f).each(function(){var b=g.generate_id(this),d="#"+b+"-container",e="#"+b;g.hide_element(a(this),!0);this.before(a("<"+c.containerEle+"/>",{id:b+"-container","class":c.classPrefix+"file-container"})); a(d).css("position","relative");this.appendTo(d);a("<"+c.customEle+"/>",{"class":c.classPrefix+"file",id:b}).appendTo(d);a(e).html(a("input[type=file]").val().split("\\").pop());this.change(function(){a(e).html(a("input[type=file]").val().split("\\").pop())})})},k=function(f){(c.select.active||c.active)&&a(f).each(function(){var b=g.generate_id(this),d="#"+b+"-container",e="#"+b;g.hide_element(this,!0);this.css({"-webkit-appearance":"none","-moz-appearance":"none"});this.before(a("<"+c.containerEle+ "/>",{id:b+"-container","class":c.classPrefix+"select-container"}));a(d).css("position","relative");this.appendTo(d);a("<"+c.customEle+"/>",{"class":c.classPrefix+"select",id:b}).appendTo(d);a(e).html(a(d+" option:selected").text());this.change(function(){a(e).html(a(d+" option:selected").text())})})};(function(f,b){b.length&&(c=f?a.extend({},c,f):c,b=b.is("form")?a("form").find(":input"):b,g.load_modules(g.sort_elements(b)))})(h,this)}})(jQuery);
