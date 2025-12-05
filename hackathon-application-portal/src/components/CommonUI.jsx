import React from "react";
import "./CommonUI.css";

const getSize = (dimension) => {
  if (!dimension) return {};
  if (typeof dimension === "string") {
    switch (dimension) {
      case "sm": return { width: 80, height: 40 };
      case "md": return { width: 120, height: 40 };
      case "lg": return { width: 230, height: 80 };
      default: return {};
    }
  }
  return dimension;
};

const getIconClass = (dimension) => {
  if (typeof dimension === "string") {
    switch (dimension) {
      case "sm": return "small-icon";
      case "md": return "medium-icon";
      case "lg": return "big-icon";
      default: return "";
    }
  }
  return "";
};

export const ForwardBtn = ({ onClickFn, dimension }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
  >
    <img 
      src="/btn-icons/forward-arrow.svg" 
      alt="Forward"
      className={getIconClass(dimension)}
    />
  </button>
);

export const BackwardBtn = ({ onClickFn, dimension }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
  >
    <img 
      src="/btn-icons/arrow-back.svg" 
      alt="Back"
      className={getIconClass(dimension)}
    />
  </button>
);

export const ConfirmBtn = ({ onClickFn, dimension, disabled }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
    disabled={disabled}
  >
    <img 
      src="/btn-icons/check.svg" 
      alt="Confirm"
      className={getIconClass(dimension)}
    />
  </button>
);

export const UploadBtn = ({ onClickFn, dimension }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
  >
    <img 
      src="/btn-icons/upload.svg" 
      alt="Upload"
      className={getIconClass(dimension)}
    />
    <div className="upload-text">Upload</div>
    
  </button>
);

export const DropDown = ({ list = [], onChangeFn, dimension, value }) => (
  <select
    value={value}
    onChange={(e) => onChangeFn(e.target.value)}
    style={getSize(dimension)}
    className="common-btn dropdown"
  >
    {list.map((item, i) => (
      <option key={i} value={item.value ?? item}>
        {item.label ?? item}
      </option>
    ))}
  </select>
);

export const CheckBox = ({ label, checked, required = false, onChangeFn }) => (
  <label className="custom-checkbox">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChangeFn(e.target.checked)} 
    />
    <span className="checkbox-icon" />
    <span className={required ? "required" : ""}>{label}</span>
  </label>
);