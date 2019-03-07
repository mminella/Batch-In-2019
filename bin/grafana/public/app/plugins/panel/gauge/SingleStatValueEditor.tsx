// Libraries
import React, { PureComponent } from 'react';

// Components
import UnitPicker from 'app/core/components/Select/UnitPicker';
import { FormField, FormLabel, PanelOptionsGroup, Select } from '@grafana/ui';

// Types
import { SingleStatValueOptions } from './types';

const statOptions = [
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'avg', label: 'Average' },
  { value: 'current', label: 'Current' },
  { value: 'total', label: 'Total' },
  { value: 'name', label: 'Name' },
  { value: 'first', label: 'First' },
  { value: 'delta', label: 'Delta' },
  { value: 'diff', label: 'Difference' },
  { value: 'range', label: 'Range' },
  { value: 'last_time', label: 'Time of last point' },
];

const labelWidth = 6;

export interface Props {
  options: SingleStatValueOptions;
  onChange: (valueOptions: SingleStatValueOptions) => void;
}

export class SingleStatValueEditor extends PureComponent<Props> {
  onUnitChange = unit => this.props.onChange({ ...this.props.options, unit: unit.value });
  onStatChange = stat => this.props.onChange({ ...this.props.options, stat: stat.value });

  onDecimalChange = event => {
    if (!isNaN(event.target.value)) {
      this.props.onChange({
        ...this.props.options,
        decimals: parseInt(event.target.value, 10),
      });
    } else {
      this.props.onChange({
        ...this.props.options,
        decimals: null,
      });
    }
  };

  onPrefixChange = event => this.props.onChange({ ...this.props.options, prefix: event.target.value });
  onSuffixChange = event => this.props.onChange({ ...this.props.options, suffix: event.target.value });

  render() {
    const { stat, unit, decimals, prefix, suffix } = this.props.options;

    let decimalsString = '';
    if (Number.isFinite(decimals)) {
      decimalsString = decimals.toString();
    }

    return (
      <PanelOptionsGroup title="Value">
        <div className="gf-form">
          <FormLabel width={labelWidth}>Stat</FormLabel>
          <Select
            width={12}
            options={statOptions}
            onChange={this.onStatChange}
            value={statOptions.find(option => option.value === stat)}
          />
        </div>
        <div className="gf-form">
          <FormLabel width={labelWidth}>Unit</FormLabel>
          <UnitPicker defaultValue={unit} onChange={this.onUnitChange} />
        </div>
        <FormField
          label="Decimals"
          labelWidth={labelWidth}
          placeholder="auto"
          onChange={this.onDecimalChange}
          value={decimalsString}
          type="number"
        />
        <FormField label="Prefix" labelWidth={labelWidth} onChange={this.onPrefixChange} value={prefix || ''} />
        <FormField label="Suffix" labelWidth={labelWidth} onChange={this.onSuffixChange} value={suffix || ''} />
      </PanelOptionsGroup>
    );
  }
}
