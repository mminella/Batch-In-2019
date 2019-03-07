///<reference path="../../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';

export class SubmenuCtrl {
  annotations: any;
  variables: any;
  dashboard: any;

  /** @ngInject */
  constructor(private $rootScope,
              private variableSrv,
              private templateSrv,
              private $location) {
    this.annotations = this.dashboard.templating.list;
    this.variables = this.variableSrv.variables;
  }

  annotationStateChanged() {
    this.$rootScope.$broadcast('refresh');
  }

  variableUpdated(variable) {
    this.variableSrv.variableUpdated(variable).then(() => {
      this.$rootScope.$emit('template-variable-value-updated');
      this.$rootScope.$broadcast('refresh');
    });
  }

  openEditView(editview) {
    var search = _.extend(this.$location.search(), {editview: editview});
    this.$location.search(search);
  }

  exitBuildMode() {
    this.dashboard.toggleEditMode();
  }
}

export function submenuDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/features/dashboard/submenu/submenu.html',
    controller: SubmenuCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      dashboard: "=",
    }
  };
}

angular.module('grafana.directives').directive('dashboardSubmenu', submenuDirective);
