///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from 'app/core/core_module';
import {Variable, variableTypes} from './variable';

export class VariableSrv {
  dashboard: any;
  variables: any;

  /** @ngInject */
  constructor(private $rootScope, private $q, private $location, private $injector, private templateSrv) {
    // update time variant variables
    $rootScope.$on('refresh', this.onDashboardRefresh.bind(this), $rootScope);
    $rootScope.$on('template-variable-value-updated', this.updateUrlParamsWithCurrentVariables.bind(this), $rootScope);
  }

  init(dashboard) {
    this.dashboard = dashboard;

    // create working class models representing variables
    this.variables = dashboard.templating.list = dashboard.templating.list.map(this.createVariableFromModel.bind(this));
    this.templateSrv.init(this.variables);

    // init variables
    for (let variable of this.variables) {
      variable.initLock = this.$q.defer();
    }

    var queryParams = this.$location.search();
    return this.$q.all(this.variables.map(variable => {
      return this.processVariable(variable, queryParams);
    })).then(() => {
      this.templateSrv.updateTemplateData();
    });
  }

  onDashboardRefresh() {
    var promises = this.variables
    .filter(variable => variable.refresh === 2)
    .map(variable => {
      var previousOptions = variable.options.slice();

      return variable.updateOptions()
      .then(this.variableUpdated.bind(this, variable))
      .then(() => {
        if (angular.toJson(previousOptions) !== angular.toJson(variable.options)) {
          this.$rootScope.$emit('template-variable-value-updated');
        }
      });
    });

    return this.$q.all(promises);
  }

  processVariable(variable, queryParams) {
    var dependencies = [];

    for (let otherVariable of this.variables) {
      if (variable.dependsOn(otherVariable)) {
        dependencies.push(otherVariable.initLock.promise);
      }
    }

    return this.$q.all(dependencies).then(() => {
      var urlValue = queryParams['var-' + variable.name];
      if (urlValue !== void 0) {
        return variable.setValueFromUrl(urlValue).then(variable.initLock.resolve);
      }

      if (variable.refresh === 1 || variable.refresh === 2) {
        return variable.updateOptions().then(variable.initLock.resolve);
      }

      variable.initLock.resolve();
    }).finally(() => {
      this.templateSrv.variableInitialized(variable);
      delete variable.initLock;
    });
  }

  createVariableFromModel(model) {
    var ctor = variableTypes[model.type].ctor;
    if (!ctor) {
      throw "Unable to find variable constructor for " + model.type;
    }

    var variable = this.$injector.instantiate(ctor, {model: model});
    return variable;
  }

  addVariable(model) {
    var variable = this.createVariableFromModel(model);
    this.variables.push(variable);
    return variable;
  }

  updateOptions(variable) {
    return variable.updateOptions();
  }

  variableUpdated(variable) {
    // if there is a variable lock ignore cascading update because we are in a boot up scenario
    if (variable.initLock) {
      return this.$q.when();
    }

    // cascade updates to variables that use this variable
    var promises = _.map(this.variables, otherVariable => {
      if (otherVariable === variable) {
        return;
      }

      if (otherVariable.dependsOn(variable)) {
        return this.updateOptions(otherVariable);
      }
    });

    return this.$q.all(promises);
  }

  selectOptionsForCurrentValue(variable) {
    var i, y, value, option;
    var selected: any = [];

    for (i = 0; i < variable.options.length; i++) {
      option = variable.options[i];
      option.selected = false;
      if (_.isArray(variable.current.value)) {
        for (y = 0; y < variable.current.value.length; y++) {
          value = variable.current.value[y];
          if (option.value === value) {
            option.selected = true;
            selected.push(option);
          }
        }
      } else if (option.value === variable.current.value) {
        option.selected = true;
        selected.push(option);
      }
    }

    return selected;
  }

  validateVariableSelectionState(variable) {
    if (!variable.current) {
      variable.current = {};
    }

    if (_.isArray(variable.current.value)) {
      var selected = this.selectOptionsForCurrentValue(variable);

      // if none pick first
      if (selected.length === 0) {
        selected = variable.options[0];
      } else {
        selected = {
          value: _.map(selected, function(val) {return val.value;}),
          text: _.map(selected, function(val) {return val.text;}).join(' + '),
        };
      }

      return variable.setValue(selected);
    } else {
      var currentOption = _.find(variable.options, {text: variable.current.text});
      if (currentOption) {
        return variable.setValue(currentOption);
      } else {
        if (!variable.options.length) { return Promise.resolve(); }
        return variable.setValue(variable.options[0]);
      }
    }
  }

  setOptionFromUrl(variable, urlValue) {
    var promise = this.$q.when();

    if (variable.refresh) {
      promise = variable.updateOptions();
    }

    return promise.then(() => {
      var option = _.find(variable.options, op => {
        return op.text === urlValue || op.value === urlValue;
      });

      option = option || {text: urlValue, value: urlValue};
      return variable.setValue(option);
    });
  }

  setOptionAsCurrent(variable, option) {
    variable.current = _.cloneDeep(option);

    if (_.isArray(variable.current.text)) {
      variable.current.text = variable.current.text.join(' + ');
    }

    this.selectOptionsForCurrentValue(variable);
    return this.variableUpdated(variable);
  }

  updateUrlParamsWithCurrentVariables() {
    // update url
    var params = this.$location.search();

    // remove variable params
    _.each(params, function(value, key) {
      if (key.indexOf('var-') === 0) {
        delete params[key];
      }
    });

    // add new values
    this.templateSrv.fillVariableValuesForUrl(params);
    // update url
    this.$location.search(params);
  }
}

coreModule.service('variableSrv', VariableSrv);
