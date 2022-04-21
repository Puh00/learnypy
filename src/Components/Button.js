import { Button as BootstrapButton } from 'react-bootstrap';

const Button = ({ onClick, className, logo, ariaLabel, tooltip = '', disabled = false }) => {
  // set aria-label the same as the tooltip if not specified explicitly
  if (typeof ariaLabel === 'undefined') ariaLabel = tooltip;
  // if disabled is a function, call it and store the result, assuming it returns a boolean
  const _disabled = typeof disabled === 'function' ? disabled() : disabled;

  return (
    <BootstrapButton
      className={className}
      variant="light"
      onClick={onClick}
      data-toggle="tooltip"
      title={tooltip}
      aria-label={ariaLabel}
      disabled={_disabled}>
      {logo ? logo : null}
    </BootstrapButton>
  );
};

export default Button;
