import React, { FC, ChangeEvent } from 'react';
import { FormLabel } from '@grafana/ui';

interface Props {
  label: string;
  placeholder?: string;
  name: string;
  value: string;
  onBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  tooltipInfo?: any;
}

export const DataSourceOption: FC<Props> = ({ label, placeholder, name, value, onBlur, onChange, tooltipInfo }) => {
  return (
    <div className="gf-form gf-form--flex-end">
      <FormLabel tooltip={tooltipInfo}>{label}</FormLabel>
      <input
        type="text"
        className="gf-form-input width-6"
        placeholder={placeholder}
        name={name}
        spellCheck={false}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
