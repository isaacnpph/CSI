import React from "react";
import { Container } from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const HomePage = ({ isAuthenticated }) => {
  // if user is logged in, redirect it to the account page.
  if (isAuthenticated) {
    return <Redirect to="/account" />;
  }

  return (
    <Container>
      <div>
        <p>Home Page</p>
        <Link className="btn btn-primary" to="/register">
          Create account
        </Link>
      </div>
    </Container>
  );
};

HomePage.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.authenticationReducer.isAuthenticated
});

export default connect(mapStateToProps)(HomePage);
