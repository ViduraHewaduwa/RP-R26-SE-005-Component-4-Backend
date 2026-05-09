// ============================================================================
// Field Component
// ============================================================================

import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";

interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: "input";
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  selectProps: SelectHTMLAttributes<HTMLSelectElement>;
  children: ReactNode;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

type FieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export default function Field(props: FieldProps) {
  const { label, error, required, hint } = props;

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      
      {props.type === "input" && (
        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          {...props.inputProps}
        />
      )}
      
      {props.type === "select" && (
        <select
          className={`${styles.select} ${error ? styles.inputError : ""}`}
          {...props.selectProps}
        >
          {props.children}
        </select>
      )}
      
      {props.type === "textarea" && (
        <textarea
          className={`${styles.textarea} ${error ? styles.inputError : ""}`}
          {...props.textareaProps}
        />
      )}
      
      {hint && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
