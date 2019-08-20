import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Card,
  CardHeader,
  CardBody,
  CardText,
  CardFooter
} from "reactstrap";
import {
  addLike,
  removeLike,
  removeHighlightedSearch
} from "../../actions/sessionActions";
import CommentSection from "./CommentSection";
import Moment from "react-moment";

const HighlightedQueries = ({
  removeHighlightedSearch,
  highlightedQueries,
  addLike,
  removeLike,
  session,
  authentication
}) => {
  const highlightedSearches = highlightedQueries.map(link => (
    <Card style={{ marginTop: "0.5rem" }} key={link._id}>
      <CardHeader>
        <strong>{link.title}</strong>
      </CardHeader>
      <CardBody>
        <CardText>{link.snippet}</CardText>
        {link.link}
        <br />
        Added on: <Moment format="DD/MM/YYYY">{link.date}</Moment>
      </CardBody>
      <CardFooter>
        <Button size="sm" href={link.link} target="_blank">
          Visit
        </Button>
        <Button
          size="sm"
          style={{ marginLeft: "0.3rem" }}
          onClick={() => addLike(session._id, link._id)}
        >
          Like {link.likes.length > 0 && link.likes.length}
        </Button>
        <Button
          size="sm"
          style={{ marginLeft: "0.3rem" }}
          onClick={() => removeLike(session._id, link._id)}
        >
          Unlike
        </Button>
        {!authentication.loading && link.user === authentication.user._id && (
          <Button
            size="sm"
            style={{ marginLeft: "0.3rem" }}
            onClick={() => removeHighlightedSearch(session._id, link._id)}
          >
            Remove Search
          </Button>
        )}
        <CommentSection
          key={link._id}
          session={session}
          searchId={link._id}
          searchComments={link.comments}
        />
      </CardFooter>
    </Card>
  ));
  return (
    <Fragment>
      <Container>
        <div>
          <p> Highlighted Links </p>
          <div>{highlightedSearches}</div>
        </div>
      </Container>
    </Fragment>
  );
};

HighlightedQueries.propTypes = {
  removeHighlightedSearch: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  highlightedQueries: PropTypes.array.isRequired,
  authentication: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authentication: state.authenticationReducer
});

export default connect(
  mapStateToProps,
  { addLike, removeLike, removeHighlightedSearch }
)(HighlightedQueries);
