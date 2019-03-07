/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["test/lib/common","app/app"],function(a,b){"use strict";var c,d;b&&b.id;return{setters:[function(a){c=a},function(a){d=a}],execute:function(){c.describe("GrafanaApp",function(){var a=new d.GrafanaApp;c.it("can call inits",function(){c.expect(a).to.not.be(null)})})}}});