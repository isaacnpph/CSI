import React, { Fragment, useState } from "react";
import { googleSearchApi } from "../../actions/sessionActions";
import { connect } from "react-redux";
import {
  Container,
  Button,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { addQuery } from "../../actions/queryActions";
import PropTypes from "prop-types";
import SearchResults from "./SearchResults";

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
        <InputGroup>
          <Input
            type="text"
            name="query"
            onChange={e => onChange(e)}
            value={query}
            placeholder="e.g. Mango"
          />
          <InputGroupAddon addonType="append">
            <Button color="secondary" onClick={e => onClick(e)}>
              Search
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <SearchResults />
        {results.length >= 9 && (
          <div>
            <Button
              size="sm"
              style={{ marginTop: "1rem", marginLeft: "1rem" }}
              onClick={() => googleSearchApi(query, previousPage)}
            >
              Previous Page
            </Button>
            <Button
              size="sm"
              style={{ marginTop: "1rem", marginLeft: "1rem" }}
              onClick={() => googleSearchApi(query, nextPage)}
            >
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
