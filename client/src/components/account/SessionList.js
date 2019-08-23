import React, { Fragment, useEffect } from "react";
import { Alert, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
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

  useEffect(() => {
  }, [sessions])

  const sesh = sessions;
  return loading === null ? (
    <Spinner />
  ) : sesh.length !== 0 ? (
    <Fragment>
      <ListGroup>
        <TransitionGroup className="session-list">
          {sessions.map(({ _id, name, description, date, author }) => (
            <CSSTransition key={_id} timeout={500} classNames="fade">
              <ListGroupItem style={{ marginTop: "0.5rem" }}>
                <p>{name}</p>
                <p>{description}</p>
                <p>Created on: <Moment format="DD/MM/YYYY">{date}</Moment></p>
                <Link
                  to={`/sessions/${_id}`}
                  className="btn btn-primary btn-sm"
                >
                  Join Session
                </Link>
                {author === user._id ? (
                  <Button
                    size="sm"
                    style={{ marginLeft: "0.3rem" }}
                    onClick={() => deleteSession(_id)}
                    className="btn btn-danger"
                  >
                    Delete Session
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    style={{ marginLeft: "0.3rem" }}
                    color="danger"
                    onClick={() => removeUser(user.email, _id)}
                  >
                    Leave Session
                  </Button>
                )}
              </ListGroupItem>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListGroup>
      <CreateSessionModal />
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
