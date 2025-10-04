const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  options = [],
  rows,
  ...props
}) => {
  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className={`form-control ${error ? "error" : ""}`}
          required={required}
          aria-describedby={error ? `${id}-error` : undefined}
          rows={rows}
          {...props}
        />
      );
    }

    if (type === "select") {
      return (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`form-control ${error ? "error" : ""}`}
          required={required}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? "error" : ""}`}
        required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    );
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {renderInput()}
      {error && (
        <div id={`${id}-error`} className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;
