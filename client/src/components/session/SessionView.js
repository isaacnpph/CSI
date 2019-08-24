import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { withRouter } from "react-router-dom";
import { getSessionById } from "../../actions/sessionActions";
import SearchBox from "./SearchBox";
import { Container, Segment, Grid, Header } from "semantic-ui-react";
import HighlightedQueries from "./HighlightedQueries";
// import QueryHistory from "./QueryHistory";
import Chat from "./Chat";
import InviteUserModal from "./InviteUserModal";
import RemoveUserModal from "./RemoveUserModal";
import {
  highlightSearchUpdate,
  removeHighlightedSearchUpdate,
  addLikeUpdate,
  removeLikeUpdate,
  addCommentUpdate,
  removeCommentUpdate,
  removeUserUpdate
} from "../../actions/sessionActions";

const SessionView = ({
  getSessionById,
  session: { session, loading },
  authentication,
  highlightSearchUpdate,
  addLikeUpdate,
  match,
  removeHighlightedSearchUpdate,
  removeLikeUpdate,
  removeCommentUpdate,
  addCommentUpdate,
  socketState: { socket }
}) => {
  if (socket === undefined) {
    window.location.href = "/";
  }

  useEffect(() => {
    if (socket === null) {
      window.location.href = "/account";
    }
    socket.on("removedFromSession", async function(data) {
      window.location.href = "/account";
    });

    socket.on("highlightSearchUpdate", function(data) {
      highlightSearchUpdate(data);
    });

    socket.on("removedHighlightSearchUpdate", function(data) {
      removeHighlightedSearchUpdate(data);
    });

    socket.on("HighlightSearchLikeUpdate", function(data) {
      addLikeUpdate(data);
    });

    socket.on("HighlightSearchUnlikeUpdate", function(data) {
      removeLikeUpdate(data);
    });

    socket.on("HighlightSearchAddCommentUpdate", function(data) {
      addCommentUpdate(data);
    });

    socket.on("HighlightSearchRemoveCommentUpdate", function(data) {
      removeCommentUpdate(data);
    });

    getSessionById(match.params.id);
  }, [
    getSessionById,
    addCommentUpdate,
    addLikeUpdate,
    highlightSearchUpdate,
    removeCommentUpdate,
    removeLikeUpdate,
    socket,
    removeHighlightedSearchUpdate,
    match.params.id
  ]);

  return (
    <Fragment>
      {session === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Container className="main container">
            <Header>
              Session name: {session.name}
              {authentication.isAuthenticated &&
                authentication.loading === false &&
                authentication.user._id === session.author && (
                  <div>
                    <InviteUserModal />
                    <RemoveUserModal />
                  </div>
                )}
            </Header>
            <Grid columns={3} style={{ height: "80vh" }} divided>
              <Grid.Row stretched>
                <Grid.Column>
                  <Segment style={{ overflow: "auto", maxHeight: "80vh" }}>
                    <SearchBox />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment
                    style={{
                      overflow: "auto",
                      height: "80vh",
                      maxHeight: "80vh"
                    }}
                  >
                    <HighlightedQueries
                      highlightedQueries={session.highlightedQueries}
                      session={session}
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment style={{ overflow: "auto", maxHeight: "80vh" }}>
                    <Chat />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
  authentication: state.authenticationReducer,
  socketState: state.socketReducer
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      getSessionById,
      highlightSearchUpdate,
      removeHighlightedSearchUpdate,
      addLikeUpdate,
      removeLikeUpdate,
      removeUserUpdate,
      addCommentUpdate,
      removeCommentUpdate
    }
  )(SessionView)
);
