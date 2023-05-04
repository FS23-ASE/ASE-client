import "styles/ui/Button.scss";

export const RightButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`right-button ${props.className}`}>
    {props.children}
  </button>
);
