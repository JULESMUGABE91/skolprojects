import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";

const CSelect = (props) => (
  <div className={"form-group"}>
    {props.label && <label>{props.label}</label>}{" "}
    {props.required && <span className="required">*</span>}
    {props.async ? (
      <AsyncSelect
        defaultOptions={props.defaultOptions}
        defaultValue={props.defaultValue}
        cacheOptions
        classNamePrefix={"selector"}
        isLoading={props.isLoading}
        onMenuScrollToBottom={props.onScrollBottom}
        className={`${props.error && "is-invalid"}`}
        loadOptions={props.loadOptions}
        name={props.name}
        placeholder={props.placeholder}
        isDisabled={props.isDisabled}
        onChange={props.onChange}
        inputValue={props.inputValue}
        onInputChange={props.onInputChange}
        value={props.value}
        onFocus={props.onFocus}
        // value={props.options.filter(function (option) {
        //   return option.value === props.value;
        // })}
        isMulti={props.isMulti}
      />
    ) : (
      <Select
        defaultValue={props.defaultValue ? props.defaultValue : props.value}
        isDisabled={props.isDisabled}
        isLoading={props.isLoading}
        onMenuScrollToBottom={props.onScrollBottom}
        className={`${props.error && "is-invalid"}`}
        isClearable={props.isClearable}
        isSearchable={props.isSearchable}
        value={props.value}
        // value={props.options.filter(function (option) {
        //   return option.value === props.value;
        // })}
        onChange={props.onChange}
        name={props.name}
        options={props.options}
        isMulti={props.isMulti}
        onFocus={props.onFocus}
      />
    )}
    {props.error && <div className="text-danger">{props.error}</div>}
  </div>
);

export default CSelect;
