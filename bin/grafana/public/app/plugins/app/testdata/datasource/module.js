/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["./datasource","./query_ctrl"],function(a,b){"use strict";var c,d,e;b&&b.id;return{setters:[function(a){c=a},function(a){d=a}],execute:function(){a("TestDataDatasource",c.TestDataDatasource),a("Datasource",c.TestDataDatasource),a("QueryCtrl",d.TestDataQueryCtrl),e=function(){function a(){}return a}(),e.template="<h2>test data</h2>",a("AnnotationsQueryCtrl",e)}}});