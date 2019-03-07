///<reference path="../../../../headers/common.d.ts" />

import {describe, beforeEach, it, sinon, expect, angularMocks} from '../../../../../test/lib/common';

import {DataProcessor} from '../data_processor';

describe('Graph DataProcessor', function() {
  var panel: any = {
    xaxis: {}
  };
  var processor = new DataProcessor(panel);
  var seriesList;

  describe('Given default xaxis options and query that returns docs', () => {

    beforeEach(() => {
      panel.xaxis.mode = 'time';
      panel.xaxis.name = 'hostname';
      panel.xaxis.values = [];

      seriesList = processor.getSeriesList({
        dataList: [
          {
            type: 'docs',
            datapoints: [{hostname: "server1", avg: 10}]
          }
        ]
      });
    });

    it('Should automatically set xaxis mode to field', () => {
      expect(panel.xaxis.mode).to.be('field');
    });

  });

  describe('getDataFieldNames(', () => {
    var dataList = [{
      type: 'docs', datapoints: [
        {
          hostname: "server1",
          valueField: 11,
          nested: {
            prop1: 'server2', value2: 23}
        }
      ]
    }];

    it('Should return all field names', () => {
      var fields = processor.getDataFieldNames(dataList, false);
      expect(fields).to.contain('hostname');
      expect(fields).to.contain('valueField');
      expect(fields).to.contain('nested.prop1');
      expect(fields).to.contain('nested.value2');
    });

    it('Should return all number fields', () => {
      var fields = processor.getDataFieldNames(dataList, true);
      expect(fields).to.contain('valueField');
      expect(fields).to.contain('nested.value2');
    });
  });
});

