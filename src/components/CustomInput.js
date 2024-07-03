"use client";
import React from "react";
import styles from "../styles/forms.module.css";

const CustomInput = ({
  typeInput,
  nameInput,
  valueInput,
  onChange,
  onMouseUp,
  nameLabel,
  placeholder,
  disabled,
  required,
  maxlength,
  buttonEsp,
  onClickSearch,
  readonly,
  isChecked,
  step,
}) => {
  return (
    <>
      {typeInput !== "checkbox" ? (
        <span className={styles["input-container"]}>
          <input
            type={typeInput}
            name={nameInput}
            onChange={onChange}
            onMouseUp={onMouseUp}
            defaultValue={valueInput}
            placeholder={placeholder}
            maxLength={maxlength}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            step={step}
          />
          <label
            className={
              placeholder !== undefined
                ? styles["activate-label-position"]
                : valueInput !== undefined &&
                  (valueInput.length > 0 || typeof valueInput === "number")
                ? styles["activate-label-position"]
                : typeInput === "date"
                ? styles["activate-label-position"]
                : ""
            }
          >
            {required && <b>*</b>}
            {nameLabel}
          </label>

          {buttonEsp && (
            <button
              className="icons"
              id="searchRuc"
              onClick={onClickSearch}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </span>
      ) : (
        <span className={styles["input-containerCheckbox"]}>
          <label>
            {required && <b>*</b>}
            {nameLabel}
          </label>
          <input
            type={typeInput}
            name={nameInput}
            onChange={onChange}
            onMouseUp={onMouseUp}
            defaultValue={valueInput}
            placeholder={placeholder}
            maxLength={maxlength}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            checked={isChecked}
          />
        </span>
      )}
    </>
  );
};

export default CustomInput;
