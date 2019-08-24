import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addLike,
  removeLike,
  removeHighlightedSearch
} from "../../actions/sessionActions";
import CommentSection from "./CommentSection";
import Moment from "react-moment";
import { Container, Button, Item, Header } from "semantic-ui-react";

const HighlightedQueries = ({
  removeHighlightedSearch,
  highlightedQueries,
  addLike,
  removeLike,
  session,
  authentication
}) => {
  const highlightedSearches = (
    <Item.Group divided>
      {highlightedQueries.map(link => (
        <Item key={link._id}>
          <Item.Content>
            <Item.Header>{link.title}</Item.Header>
            <Item.Meta>
              <a href={link.link} target="_blank">
                {link.link}
              </a>
            </Item.Meta>
            <Item.Description>{link.snippet}</Item.Description>
            <Item.Extra>
              <Button
                icon="eye"
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
              />
              <Button
                icon="thumbs up outline"
                onClick={() => addLike(session._id, link._id)}
              />
              <Button
                icon="thumbs down outline"
                onClick={() => removeLike(session._id, link._id)}
              />
              {!authentication.loading &&
                link.user === authentication.user._id && (
                  <Button
                    icon="trash alternate outline"
                    onClick={() =>
                      removeHighlightedSearch(session._id, link._id)
                    }
                  />
                )}
              <CommentSection
                key={link._id}
                session={session}
                searchId={link._id}
                searchComments={link.comments}
              />
            </Item.Extra>
            <Item.Meta>
              Comments: {link.comments.length}
              <br />
              Likes: {link.likes.length}
              <br />
              Added on: <Moment format="DD/MM/YYYY">{link.date}</Moment>
              <br />
              Added by: {link.user}
            </Item.Meta>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  );

  return (
    <Fragment>
      <Container>
        <Header dividing>Highlighted Searches</Header>
        {highlightedSearches}
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
