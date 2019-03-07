/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["../core_module"],function(a,b){"use strict";var c;b&&b.id;return{setters:[function(a){c=a}],execute:function(){c.default.directive("giveFocus",function(){return function(a,b,c){b.click(function(a){a.stopPropagation()}),a.$watch(c.giveFocus,function(a){a&&setTimeout(function(){b.focus();var a=b[0];if(a.setSelectionRange){var c=2*b.val().length;a.setSelectionRange(c,c)}},200)},!0)}}),a("default",{})}}});