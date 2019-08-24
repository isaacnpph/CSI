import React, { Fragment, useEffect } from "react";
import { Button, Item } from "semantic-ui-react";
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
  const sessionList = (
    <Item.Group divided>
      {sessions.map(session => (
        <Item key={session._id}>
          <Item.Content>
            <Item.Header>{session.name}</Item.Header>
            <Item.Meta>
              <span>
                Created: <Moment format="DD/MM/YYYY">{session.date}</Moment>
              </span>
            </Item.Meta>
            <Item.Description>{session.description}</Item.Description>
            <Item.Extra>
              <Link
                to={`/sessions/${session._id}`}
                className="ui vertical animated button"
              >
                <div className="hidden content">Enter</div>
                <div className="visible content">
                  <i className="users icon" />
                </div>
              </Link>
              {session.author === user._id ? (
                <Button
                  className="ui vertical animated button"
                  onClick={() => deleteSession(session._id)}
                >
                  <div className="hidden content">Delete</div>
                  <div className="visible content">
                    <i className="trash alternate outline icon" />
                  </div>
                </Button>
              ) : (
                <Button
                  className="ui vertical animated button"
                  onClick={() => removeUser(user.email, session._id)}
                >
                  <div className="hidden content">Leave</div>
                  <div className="visible content">
                    <i className="minus icon" />
                  </div>
                </Button>
              )}
            </Item.Extra>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  );
  const sesh = sessions;
  return loading === null ? (
    <Spinner />
  ) : sesh.length !== 0 ? (
    <Fragment>
      <CreateSessionModal />
      {sessionList}
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
