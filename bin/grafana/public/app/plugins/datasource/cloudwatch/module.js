/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["./query_parameter_ctrl","./datasource","./query_ctrl","./config_ctrl"],function(a,b){"use strict";var c,d,e,f;b&&b.id;return{setters:[function(a){},function(a){c=a},function(a){d=a},function(a){e=a}],execute:function(){a("Datasource",c.CloudWatchDatasource),a("QueryCtrl",d.CloudWatchQueryCtrl),a("ConfigCtrl",e.CloudWatchConfigCtrl),f=function(){function a(){}return a}(),f.templateUrl="partials/annotations.editor.html",a("AnnotationsQueryCtrl",f)}}});