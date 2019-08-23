import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { highlightSearch } from "../../actions/sessionActions";
import { Button, Item } from "semantic-ui-react";

const SearchResults = ({ highlightSearch, session: { session, results } }) => {
  const googleResults = (
    <Item.Group divided>
      {results.map(result => (
        <Item key={result.title}>
          <Item.Content>
            <Item.Header>{result.title}</Item.Header>
            <Item.Meta>
              <a href={result.link} target="_blank">
                {result.link}
              </a>
            </Item.Meta>
            <Item.Description>{result.snippet}</Item.Description>
            <Item.Extra>
              <Button icon="eye" href={result.link} target="_blank" />
              <Button
                icon="heart outline"
                onClick={() =>
                  highlightSearch(
                    result.title,
                    result.snippet,
                    result.link,
                    session._id
                  )
                }
              />
            </Item.Extra>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  );

  return <Fragment>{googleResults}</Fragment>;
};

SearchResults.propTypes = {
  session: PropTypes.object.isRequired,
  highlightSearch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  session: state.sessionReducer
});

export default connect(
  mapStateToProps,
  { highlightSearch }
)(SearchResults);
