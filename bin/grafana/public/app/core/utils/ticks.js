/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register([],function(a,b){"use strict";function c(a,b,c){var d=Math.sqrt(50),e=Math.sqrt(10),f=Math.sqrt(2),g=Math.abs(b-a)/Math.max(0,c),h=Math.pow(10,Math.floor(Math.log(g)/Math.LN10)),i=g/h;return i>=d?h*=10:i>=e?h*=5:i>=f&&(h*=2),b<a?-h:h}b&&b.id;return a("tickStep",c),{setters:[],execute:function(){}}});