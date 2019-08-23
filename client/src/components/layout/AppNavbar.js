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
    <div className="right menu primary">
      <Link className="item" to="/account">
        <i className="user circle outline icon" />
        My Account
      </Link>
      <a className="item" onClick={logout} href="#!">
        <i> </i>
        <i className="sign out alternate icon" />
        Sign out
      </a>
    </div>
  );

  const publicLinks = (
    <div className="right menu primary">
      <Link to="/about" className="item">
        <i className="globe icon" />
        About CSI
      </Link>
      <Link className="item" to="/contact">
        <i className="edit outline icon" />
        Contact Us
      </Link>
      <Link className="item" to="/login">
        <i className="sign in alternate icon" />
        Sign in
      </Link>
    </div>
  );

  return (
    <Fragment>
      <div className="ui top fixed large menu main">
        <Link className="item" to="/">
          LOGO
        </Link>
        {!loading && (
          <Fragment>{isAuthenticated ? privateLinks : publicLinks}</Fragment>
        )}
      </div>
    </Fragment>
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
