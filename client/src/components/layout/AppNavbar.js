import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/authenticationActions";

const AppNavbar = ({
  authentication: { isAuthenticated, loading },
  logout
}) => {
  const privateLinks = (
    <ul>
      <Link style={{ marginLeft: "0.5rem" }} to="/account">
        Account
      </Link>
      <a onClick={logout} href="#!">
        <i> </i>
        Logout
      </a>
    </ul>
  );

  const publicLinks = (
    <ul>
      <Link style={{ marginLeft: "0.5rem" }} to="/">
        Home
      </Link>
      <Link style={{ marginLeft: "0.5rem" }} to="/about">
        About Us
      </Link>
      <Link style={{ marginLeft: "0.5rem" }} to="/contact">
        Contact Us
      </Link>
      <Link style={{ marginLeft: "0.5rem" }} to="/login">
        Login
      </Link>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">CSI</Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? privateLinks : publicLinks}</Fragment>
      )}
    </nav>
  );
};

AppNavbar.propTypes = {
  logout: PropTypes.func.isRequired,
  authentication: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authentication: state.authenticationReducer
});

export default connect(
  mapStateToProps,
  { logout }
)(AppNavbar);
