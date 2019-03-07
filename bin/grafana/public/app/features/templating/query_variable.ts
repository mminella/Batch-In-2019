///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import {Variable, containsVariable, assignModelProperties, variableTypes} from './variable';
import {VariableSrv} from './variable_srv';

function getNoneOption() {
  return { text: 'None', value: '', isNone: true };
}

export class QueryVariable implements Variable {
  datasource: any;
  query: any;
  regex: any;
  sort: any;
  options: any;
  current: any;
  refresh: number;
  hide: number;
  name: string;
  multi: boolean;
  includeAll: boolean;
  useTags: boolean;
  tagsQuery: string;
  tagValuesQuery: string;
  tags: any[];

  defaults = {
    type: 'query',
    label: null,
    query: '',
    regex: '',
    sort: 0,
    datasource: null,
    refresh: 0,
    hide: 0,
    name: '',
    multi: false,
    includeAll: false,
    allValue: null,
    options: [],
    current: {},
    tags: [],
    useTags: false,
    tagsQuery: "",
    tagValuesQuery: "",
  };

  /** @ngInject **/
  constructor(private model, private datasourceSrv, private templateSrv, private variableSrv, private $q)  {
    // copy model properties to this instance
    assignModelProperties(this, model, this.defaults);
  }

  getSaveModel() {
    // copy back model properties to model
    assignModelProperties(this.model, this, this.defaults);

    // remove options
    if (this.refresh !== 0) {
      this.model.options = [];
    }

    return this.model;
  }

  setValue(option){
    return this.variableSrv.setOptionAsCurrent(this, option);
  }

  setValueFromUrl(urlValue) {
    return this.variableSrv.setOptionFromUrl(this, urlValue);
  }

  getValueForUrl() {
    if (this.current.text === 'All') {
      return 'All';
    }
    return this.current.value;
  }

  updateOptions() {
    return this.datasourceSrv.get(this.datasource)
    .then(this.updateOptionsFromMetricFindQuery.bind(this))
    .then(this.updateTags.bind(this))
    .then(this.variableSrv.validateVariableSelectionState.bind(this.variableSrv, this));
  }

  updateTags(datasource) {
    if (this.useTags) {
      return datasource.metricFindQuery(this.tagsQuery).then(results => {
        this.tags = [];
        for (var i = 0; i < results.length; i++) {
          this.tags.push(results[i].text);
        }
        return datasource;
      });
    } else {
      delete this.tags;
    }

    return datasource;
  }

  getValuesForTag(tagKey) {
    return this.datasourceSrv.get(this.datasource).then(datasource => {
      var query = this.tagValuesQuery.replace('$tag', tagKey);
      return datasource.metricFindQuery(query).then(function (results) {
        return _.map(results, function(value) {
          return value.text;
        });
      });
    });
  }

  updateOptionsFromMetricFindQuery(datasource) {
    return datasource.metricFindQuery(this.query).then(results => {
      this.options = this.metricNamesToVariableValues(results);
      if (this.includeAll) {
        this.addAllOption();
      }
      if (!this.options.length) {
        this.options.push(getNoneOption());
      }
      return datasource;
    });
  }

  addAllOption() {
    this.options.unshift({text: 'All', value: "$__all"});
  }

  metricNamesToVariableValues(metricNames) {
    var regex, options, i, matches;
    options = [];

    if (this.regex) {
      regex = kbn.stringToJsRegex(this.templateSrv.replace(this.regex, {}, 'regex'));
    }
    for (i = 0; i < metricNames.length; i++) {
      var item = metricNames[i];
      var text = item.text === undefined || item.text === null
        ? item.value
        : item.text;

      var value = item.value === undefined || item.value === null
        ? item.text
        : item.value;

      if (_.isNumber(value)) {
        value = value.toString();
      }

      if (_.isNumber(text)) {
        text = text.toString();
      }

      if (regex) {
        matches = regex.exec(value);
        if (!matches) { continue; }
        if (matches.length > 1) {
          value = matches[1];
          text = matches[1];
        }
      }

      options.push({text: text, value: value});
    }

    options = _.uniqBy(options, 'value');
    return this.sortVariableValues(options, this.sort);
  }

  sortVariableValues(options, sortOrder) {
    if (sortOrder === 0) {
      return options;
    }

    var sortType = Math.ceil(sortOrder / 2);
    var reverseSort = (sortOrder % 2 === 0);

    if (sortType === 1) {
      options = _.sortBy(options, 'text');
    } else if (sortType === 2) {
      options = _.sortBy(options, (opt) => {
        var matches = opt.text.match(/.*?(\d+).*/);
        if (!matches || matches.length < 2) {
          return -1;
        } else {
          return parseInt(matches[1], 10);
        }
      });
    }

    if (reverseSort) {
      options = options.reverse();
    }

    return options;
  }

  dependsOn(variable) {
    return containsVariable(this.query, this.datasource, variable.name);
  }
}

variableTypes['query'] = {
  name: 'Query',
  ctor: QueryVariable,
  description: 'Variable values are fetched from a datasource query',
  supportsMulti: true,
};
