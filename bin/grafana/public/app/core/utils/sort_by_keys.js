/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["lodash"],function(a,b){"use strict";function c(a){if(d.default.isArray(a))return a.map(c);if(d.default.isPlainObject(a)){for(var b={},e=0,f=d.default.keys(a).sort();e<f.length;e++){var g=f[e];b[g]=c(a[g])}return b}return a}b&&b.id;a("default",c);var d;return{setters:[function(a){d=a}],execute:function(){}}});