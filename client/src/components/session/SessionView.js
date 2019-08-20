import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import { getSessionById } from "../../actions/sessionActions";
import SearchBox from "./SearchBox";
import { Container, Row, Col, Jumbotron } from "reactstrap";
// import QueryHistory from "./QueryHistory";
import HighlightedQueries from "./HighlightedQueries";
import Chat from "./Chat";
import InviteUserModal from "./InviteUserModal";
import RemoveUserModal from "./RemoveUserModal";

const SessionView = ({
  getSessionById,
  session: { session, loading },
  authentication,
  match
}) => {
  useEffect(() => {
    getSessionById(match.params.id);
  }, [getSessionById, match.params.id]);

  return (
    <Fragment>
      {session === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Container>
            <h1>{session.name}</h1>
            {authentication.isAuthenticated &&
              authentication.loading === false &&
              authentication.user._id === session.author && (
                <div>
                  <InviteUserModal />
                  <RemoveUserModal />
                </div>
              )}
            <Link
              style={{ marginBottom: "0.3rem" }}
              to="/account"
              className="btn btn-primary btn-sm"
            >
              Leave Session
            </Link>
            <Row>
              <Col xs="6">
                <Jumbotron fluid>
                  <SearchBox />
                </Jumbotron>
              </Col>
              <Col xs="6">
                <Jumbotron fluid>
                  <HighlightedQueries
                    highlightedQueries={session.highlightedQueries}
                    session={session}
                  />
                </Jumbotron>
              </Col>
            </Row>
            <Row>
              <Col>
                <Jumbotron fluid>
                  <Chat />
                </Jumbotron>
              </Col>
              {/* <Col xs="6">
                <Jumbotron fluid>
                  <QueryHistory />
                </Jumbotron>
              </Col> */}
            </Row>
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
};

SessionView.propTypes = {
  getSessionById: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  session: state.sessionReducer,
  authentication: state.authenticationReducer
});

export default connect(
  mapStateToProps,
  { getSessionById }
)(SessionView);
