import React, { Fragment, useState } from "react";
import { googleSearchApi } from "../../actions/sessionActions";
import { connect } from "react-redux";
import { addQuery } from "../../actions/queryActions";
import PropTypes from "prop-types";
import SearchResults from "./SearchResults";
import { Container, Button, Input, Icon } from "semantic-ui-react";

const SearchBox = ({
  addQuery,
  session: { session, results, nextPage, previousPage },
  googleSearchApi
}) => {
  const [formData, setFormData] = useState({
    query: ""
  });

  const { query } = formData;

  var page = 1;
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onClick = e => {
    e.preventDefault();
    addQuery(query, session._id);
    googleSearchApi(query, page);
  };

  return (
    <Fragment>
      <Container>
        <Input
          fluid
          icon={
            <Icon
              name="search"
              inverted
              circular
              link
              onClick={e => onClick(e)}
            />
          }
          placeholder="Search..."
          type="text"
          name="query"
          onChange={e => onChange(e)}
          value={query}
        />
        <SearchResults />
        {results.length >= 9 && (
          <div>
            <Button onClick={() => googleSearchApi(query, previousPage)}>
              Previous Page
            </Button>
            <Button onClick={() => googleSearchApi(query, nextPage)}>
              Next Page
            </Button>
          </div>
        )}
      </Container>
    </Fragment>
  );
};

SearchBox.propTypes = {
  session: PropTypes.object.isRequired,
  addQuery: PropTypes.func.isRequired,
  googleSearchApi: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  session: state.sessionReducer
});

export default connect(
  mapStateToProps,
  { googleSearchApi, addQuery }
)(SearchBox);
