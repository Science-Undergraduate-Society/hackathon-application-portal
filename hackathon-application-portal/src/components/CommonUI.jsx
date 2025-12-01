import React from "react";
import "./CommonUI.css";

const getSize = (dimension) => {
  if (!dimension) return {};
  if (typeof dimension === "string") {
    switch (dimension) {
      case "sm": return { width: 80, height: 40 };
      case "md": return { width: 60, height: 60 };
      case "lg": return { width: 80, height: 80 };
      default: return {};
    }
  }
  return dimension;
};

export const ForwardBtn = ({ onClickFn, dimension }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
  >
    <img src="/btn-icons/forward-arrow.svg" alt="Forward" />
  </button>
);

export const BackwardBtn = ({ onClickFn, dimension }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
  >
    <img src="/btn-icons/arrow-back.svg" alt="Back" />
  </button>
);

export const ConfirmBtn = ({ onClickFn, dimension }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
  >
    <img src="/btn-icons/check.svg" alt="Confirm" />
  </button>
);

export const UploadBtn = ({ onClickFn, dimension }) => (
  <button
    onClick={onClickFn}
    style={getSize(dimension)}
    className="common-btn"
  >
    <img src="/btn-icons/upload.svg" alt="Upload" />
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

export const CheckBox = ({ label, checked, onChangeFn }) => (
  <label className="common-btn checkbox">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChangeFn(e.target.checked)}
    />
    <span className="checkbox-icon" />
    {label}
  </label>
);
