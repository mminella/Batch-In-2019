/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register([],function(a,b){"use strict";var c;b&&b.id;return{setters:[],execute:function(){c=function(){function a(){this.columns=[],this.rows=[],this.type="table"}return a.prototype.sort=function(a){null===a.col||this.columns.length<=a.col||(this.rows.sort(function(b,c){return b=b[a.col],c=c[a.col],b<c?-1:b>c?1:0}),this.columns[a.col].sort=!0,a.desc?(this.rows.reverse(),this.columns[a.col].desc=!0):this.columns[a.col].desc=!1)},a}(),a("default",c)}}});