import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";


const Header = props => (
  <div className="header container" style={{height: props.height}}>
    <h1 className="header title">Login to ASE BookMarket</h1>

  </div>
);

Header.propTypes = {
  height: PropTypes.string
};


export default Header;
