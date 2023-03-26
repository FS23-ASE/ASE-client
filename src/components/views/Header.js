import React from "react";
import {ReactLogo} from "components/ui/ReactLogo";
import PropTypes from "prop-types";
import "styles/views/Header.scss";


const Header = props => (
  <div className="header container" style={{height: props.height}}>
    <h1 className="header title">Welcome to ASE book trading platform!</h1>
    <ReactLogo width="60px" height="60px"/>
  </div>
);

Header.propTypes = {
  height: PropTypes.string
};


export default Header;
