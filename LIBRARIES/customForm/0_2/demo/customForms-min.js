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
(function(a){a.fn.cstmForm=function(j){var d={box:"a",wrappper:"div",prefix:"custom-"},k=function(e){a(e).each(function(){var b=this,c=d.prefix+(a(b).attr("name")||a(b).attr("id"));a(this).before(a("<"+d.box+"/>",{id:c,"class":d.prefix+"checkbox",click:function(c){c.preventDefault();a(this).toggleClass("checked");a(this).hasClass("checked")?a(b).attr("checked","checked"):a(b).attr("checked","")}}));a(b).attr("checked")&&a("#"+c).addClass("checked");a(this).addClass("customForm-hidden")})},l=function(e){a(e).each(function(){var b= this,c=d.prefix+(a(b).attr("id")||a(b).attr("name"))+"-"+a(b).attr("value");a(this).before(a("<"+d.box+"/>",{id:c,"class":d.prefix+"radio",click:function(c){c.preventDefault();a("."+d.prefix+"radio").removeClass("checked");a(this).addClass("checked");a(e).each(function(){a(this).attr("checked","")});a(b).attr("checked","checked")}}));a("#"+c).addClass(d.prefix+a(b).attr("name"));a(b).attr("checked")&&a("#"+c).addClass("checked");a(this).addClass("customForm-hidden")})},m=function(e){a(e).each(function(){var b= d.prefix+(a(this).attr("id")||a(this).attr("name")),c="#"+b+"-container",e="#"+b;a(this).css({opacity:"0",filter:"alpha(opacity=0)","-moz-opacity":"0","-khtml-opacity":"0"});a(this).before(a("<"+d.wrappper+"/>",{id:b+"-container"}));a(c).css("position","relative");a(this).appendTo(c);a("<"+d.box+"/>",{"class":d.prefix+"file",id:b}).appendTo(c);a(e).html(a("input[type=file]").val().split("\\").pop());a(this).css("position","absolute");a(this).css("top","0px");a(this).css("left","0px");a(this).change(function(){a(e).html(a("input[type=file]").val().split("\\").pop())})})}, n=function(e){a(e).each(function(){var b=d.prefix+(a(this).attr("id")||a(this).attr("name")),c="#"+b+"-container",e="#"+b;a(this).css({opacity:"0",filter:"alpha(opacity=0)","-moz-opacity":"0","-khtml-opacity":"0"});a(this).before(a("<"+d.wrappper+"/>",{id:b+"-container"}));a(c).css("position","relative");a(this).appendTo(c);a("<"+d.box+"/>",{"class":d.prefix+"select",id:b}).appendTo(c);a(e).html(a(c+" option:selected").text());a(this).css("position","absolute");a(this).css("top","0px");a(this).css("left", "0px");a(this).change(function(){a(e).html(a(c+" option:selected").text())})})},f={checkbox:function(a){k(a)},radio:function(a){l(a)},file:function(a){m(a)},select:function(a){n(a)}};(function(e,b){if(b.length){e&&a.extend(d,e);var c=[],g=[],h=[],i=[];b.is("form")&&(b=a("form").find(":input"));a(b).each(function(){a(this).is("input[type=checkbox]")?c.push(a(this)):a(this).is("input[type=radio]")?g.push(a(this)):a(this).is("input[type=file]")?h.push(a(this)):a(this).is("select")&&i.push(a(this))}); c.length&&f.checkbox(c);i.length&&f.select(i);h.length&&f.file(h);g.length&&f.radio(g)}else return!1})(j,this,f)}})(jQuery);
