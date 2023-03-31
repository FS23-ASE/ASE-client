import "styles/ui/Button.scss";

export const SmallButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`small-button ${props.className}`}>
    {props.children}
  </button>
);
