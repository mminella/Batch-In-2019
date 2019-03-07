/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["angular"],function(a,b){"use strict";function c(a){return a.create({scope:{ctrl:"=",editorTab:"=",index:"="},directive:function(a){var b=a.ctrl.pluginId,c=a.index;return Promise.resolve({name:"panel-editor-tab-"+b+c,fn:a.editorTab.directiveFn})}})}c.$inject=["dynamicDirectiveSrv"];var d,e;b&&b.id;return{setters:[function(a){d=a}],execute:function(){e=d.default.module("grafana.directives"),e.directive("panelEditorTab",c)}}});