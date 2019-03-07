/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register([],function(a,b){"use strict";function c(a,b){function c(a,h){Object.keys(a).forEach(function(i){var j=a[i],k=b.safe&&Array.isArray(j),l=Object.prototype.toString.call(j),m="[object Object]"===l,n=h?h+d+i:i;return b.maxDepth||(e=f+1),!k&&m&&Object.keys(j).length&&f<e?(++f,c(j,n)):void(g[n]=j)})}b=b||{};var d=b.delimiter||".",e=b.maxDepth||3,f=1,g={};return c(a,null),g}b&&b.id;return a("default",c),{setters:[],execute:function(){}}});