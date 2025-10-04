const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn--${variant}`;
  const sizeClass = size !== "medium" ? `btn--${size}` : "";
  const fullWidthClass = fullWidth ? "btn--full-width" : "";

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
