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
  // $('input[type=file];  
  // $('input[type=radio], input[type=checkbox], select').cstmForm();
  
  Or just set it auto for every element
  // $('form').cstmForm();
  //
  Support for File, Select, Checkbox and Radio buttons

*/
(function(a){a.fn.cstmForm=function(g){var c={box:"a",wrappper:"div",prefix:"custom-"},f={generate_id:function(a){return c.prefix+(a.attr("name")||a.attr("id"))},hide_element:function(d,b){b?d.css({opacity:"0",filter:"alpha(opacity=0)","-moz-opacity":"0","-khtml-opacity":"0",position:"absolute",top:"0px",left:"0px"}):a(this).hide()},sort_elements:function(d){var b=[],e=[],c=[],f=[];a(d).each(function(){a(this).is("input[type=checkbox]")?b.push(a(this)):a(this).is("input[type=radio]")?e.push(a(this)): a(this).is("input[type=file]")?c.push(a(this)):a(this).is("select")&&f.push(a(this))});return{checkbox:b,radio:e,file:c,select:f}},load_modules:function(a){a.checkbox.length&&h(a.checkbox);a.select.length&&i(a.select);a.file.length&&j(a.file);a.radio.length&&k(a.radio)}},h=function(d){a(d).each(function(){var b=this,e=f.generate_id(b);b.before(a("<"+c.box+"/>",{id:e,"class":c.prefix+"checkbox",click:function(c){c.preventDefault();a(this).toggleClass("checked");a(this).hasClass("checked")?b.prop("checked", !0):b.prop("checked",!1)}}));b.prop("checked")&&a("#"+e).addClass("checked");b.addClass("customForm-hidden")})},k=function(d){a(d).each(function(){var b=this,e=f.generate_id(b)+"-"+b.val();b.before(a("<"+c.box+"/>",{id:e,"class":c.prefix+"radio",click:function(e){e.preventDefault();a("."+c.prefix+"radio").removeClass("checked");a(this).addClass("checked");a(d).each(function(){a(this).prop("checked",!1)});b.prop("checked",!0)}}));a("#"+e).addClass(c.prefix+b.attr("name"));b.prop("checked")&&a("#"+ e).addClass("checked");b.addClass("customForm-hidden")})},j=function(d){a(d).each(function(){var b=f.generate_id(this),e="#"+b+"-container",d="#"+b;f.hide_element(a(this),!0);this.before(a("<"+c.wrappper+"/>",{id:b+"-container","class":c.prefix+"file-container"}));a(e).css("position","relative");this.appendTo(e);a("<"+c.box+"/>",{"class":c.prefix+"file",id:b}).appendTo(e);a(d).html(a("input[type=file]").val().split("\\").pop());this.change(function(){a(d).html(a("input[type=file]").val().split("\\").pop())})})}, i=function(d){a(d).each(function(){var b=f.generate_id(this),e="#"+b+"-container",d="#"+b;f.hide_element(a(this),!0);this.before(a("<"+c.wrappper+"/>",{id:b+"-container","class":c.prefix+"select-container"}));a(e).css("position","relative");this.appendTo(e);a("<"+c.box+"/>",{"class":c.prefix+"select",id:b}).appendTo(e);a(d).html(a(e+" option:selected").text());this.change(function(){a(d).html(a(e+" option:selected").text())})})};(function(d,b){b.length&&(c=d?a.extend({},c,d):c,b=b.is("form")?a("form").find(":input"): b,f.load_modules(f.sort_elements(b)))})(g,this)}})(jQuery);
