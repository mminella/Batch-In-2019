/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

define(["lodash-src"],function(){"use strict";var a=window._;return a.mixin({move:function(a,b,c){return a.splice(c,0,a.splice(b,1)[0]),a},toggle:function(a,b,c){return a===b?c:b},toggleInOut:function(b,c){return a.includes(b,c)?b=a.without(b,c):b.push(c),b}}),a});