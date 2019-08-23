import React, { Fragment, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { Alert } from "reactstrap";
// import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import { deleteSession } from "../../actions/accountActions";
import { removeUser } from "../../actions/sessionActions";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import CreateSessionModal from "./CreateSessionModal";
import Moment from "react-moment";

const SessionList = ({
  sessions,
  deleteSession,
  removeUser,
  user,
  loading
}) => {
  useEffect(() => {}, [sessions]);

  const sesh = sessions;
  return loading === null ? (
    <Spinner />
  ) : sesh.length !== 0 ? (
    <Fragment>
      <CreateSessionModal />
      {sessions.map(({ _id, name, description, date, author }) => (
        <div className="ui segment" key={_id}>
          <p>{name}</p>
          <p>{description}</p>
          <p>
            Created on: <Moment format="DD/MM/YYYY">{date}</Moment>
          </p>
          <Link to={`/sessions/${_id}`} className="ui vertical animated button">
            <div className="hidden content">Enter</div>
            <div className="visible content">
              <i className="edit outline icon" />
            </div>
          </Link>
          {author === user._id ? (
            <Button
              className="ui vertical animated button"
              tabindex="0"
              onClick={() => deleteSession(_id)}
            >
              <div className="hidden content">Delete</div>
              <div className="visible content">
                <i className="trash alternate outline icon" />
              </div>
            </Button>
          ) : (
            <Button
              className="ui vertical animated button"
              onClick={() => removeUser(user.email, _id)}
            >
              <div className="hidden content">Leave</div>
              <div className="visible content">
                <i className="minus icon" />
              </div>
            </Button>
          )}
        </div>
      ))}
    </Fragment>
  ) : (
    <Fragment>
      <Alert color="info">You have not created any sessions. </Alert>
      <CreateSessionModal />
    </Fragment>
  );
};

SessionList.propTypes = {
  deleteSession: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  removeUser: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteSession, removeUser }
)(SessionList);
