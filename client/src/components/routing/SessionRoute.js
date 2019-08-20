import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSessionById } from "../../actions/sessionActions";

const SessionRoute = ({
  getSessionById,
  component: Component,
  authentication: { user },
  session: { author },
  ...rest
}) => {
  // useEffect(() => {
  //   getSessionById();
  // }, [getSessionById]);

  // const getInvitedUser = invitedUsers.find(
  //   invitedUser => invitedUser._id === user.id
  // );
  return (
    <Route
      {...rest}
      render={props =>
        user._id === author ? (
          <Component {...props} />
        ) : (
          <Redirect to="/account" />
        )
      }
    />
  );
};

SessionRoute.propTypes = {
  getSessionById: PropTypes.func.isRequired,
  authentication: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authentication: state.authenticationReducer,
  session: state.sessionReducer
});
export default connect(
  mapStateToProps,
  { getSessionById }
)(SessionRoute);
