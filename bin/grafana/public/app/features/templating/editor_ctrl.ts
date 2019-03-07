///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import coreModule from 'app/core/core_module';
import {variableTypes} from './variable';

export class VariableEditorCtrl {

  /** @ngInject **/
  constructor(private $scope, private datasourceSrv, private variableSrv, templateSrv) {
    $scope.variableTypes = variableTypes;
    $scope.ctrl = {};
    $scope.namePattern = /^(?!__).*$/;

    $scope.refreshOptions = [
      {value: 0, text: "Never"},
      {value: 1, text: "On Dashboard Load"},
      {value: 2, text: "On Time Range Change"},
    ];

    $scope.sortOptions = [
      {value: 0, text: "Disabled"},
      {value: 1, text: "Alphabetical (asc)"},
      {value: 2, text: "Alphabetical (desc)"},
      {value: 3, text: "Numerical (asc)"},
      {value: 4, text: "Numerical (desc)"},
    ];

    $scope.hideOptions = [
      {value: 0, text: ""},
      {value: 1, text: "Label"},
      {value: 2, text: "Variable"},
    ];

    $scope.init = function() {
      $scope.mode = 'list';

      $scope.datasources = _.filter(datasourceSrv.getMetricSources(), function(ds) {
        return !ds.meta.mixed && ds.value !== null;
      });

      $scope.datasourceTypes = _($scope.datasources).uniqBy('meta.id').map(function(ds) {
        return {text: ds.meta.name, value: ds.meta.id};
      }).value();

      $scope.variables = variableSrv.variables;
      $scope.reset();

      $scope.$watch('mode', function(val) {
        if (val === 'new') {
          $scope.reset();
        }
      });
    };

    $scope.add = function() {
      if ($scope.isValid()) {
        $scope.variables.push($scope.current);
        $scope.update();
        $scope.dashboard.updateSubmenuVisibility();
      }
    };

    $scope.isValid = function() {
      if (!$scope.ctrl.form.$valid) {
        return;
      }

      if (!$scope.current.name.match(/^\w+$/)) {
        $scope.appEvent('alert-warning', ['Validation', 'Only word and digit characters are allowed in variable names']);
        return false;
      }

      var sameName = _.find($scope.variables, { name: $scope.current.name });
      if (sameName && sameName !== $scope.current) {
        $scope.appEvent('alert-warning', ['Validation', 'Variable with the same name already exists']);
        return false;
      }

      if ($scope.current.type === 'query' && $scope.current.query.match(new RegExp('\\$' + $scope.current.name))) {
        $scope.appEvent('alert-warning', ['Validation', 'Query cannot contain a reference to itself. Variable: $'  + $scope.current.name]);
        return false;
      }

      return true;
    };

    $scope.validate = function() {
      $scope.infoText = '';
      if ($scope.current.type === 'adhoc' && $scope.current.datasource !== null) {
        $scope.infoText = 'Adhoc filters are applied automatically to all queries that target this datasource';
        datasourceSrv.get($scope.current.datasource).then(ds => {
          if (!ds.getTagKeys) {
            $scope.infoText = 'This datasource does not support adhoc filters yet.';
          }
        });
      }
    };

    $scope.runQuery = function() {
      return variableSrv.updateOptions($scope.current).then(null, function(err) {
        if (err.data && err.data.message) { err.message = err.data.message; }
        $scope.appEvent("alert-error", ['Templating', 'Template variables could not be initialized: ' + err.message]);
      });
    };

    $scope.edit = function(variable) {
      $scope.current = variable;
      $scope.currentIsNew = false;
      $scope.mode = 'edit';
      $scope.validate();
    };

    $scope.duplicate = function(variable) {
      var clone = _.cloneDeep(variable.getSaveModel());
      $scope.current = variableSrv.createVariableFromModel(clone);
      $scope.variables.push($scope.current);
      $scope.current.name = 'copy_of_'+variable.name;
      $scope.dashboard.updateSubmenuVisibility();
    };

    $scope.update = function() {
      if ($scope.isValid()) {
        $scope.runQuery().then(function() {
          $scope.reset();
          $scope.mode = 'list';
          templateSrv.updateTemplateData();
        });
      }
    };

    $scope.reset = function() {
      $scope.currentIsNew = true;
      $scope.current = variableSrv.createVariableFromModel({type: 'query'});
    };

    $scope.typeChanged = function() {
      var old = $scope.current;
      $scope.current = variableSrv.createVariableFromModel({type: $scope.current.type});
      $scope.current.name = old.name;
      $scope.current.hide = old.hide;
      $scope.current.label = old.label;

      var oldIndex = _.indexOf(this.variables, old);
      if (oldIndex !== -1) {
        this.variables[oldIndex] = $scope.current;
      }

      $scope.validate();
    };

    $scope.removeVariable = function(variable) {
      var index = _.indexOf($scope.variables, variable);
      $scope.variables.splice(index, 1);
      $scope.dashboard.updateSubmenuVisibility();
    };
  }
}

coreModule.controller('VariableEditorCtrl', VariableEditorCtrl);

