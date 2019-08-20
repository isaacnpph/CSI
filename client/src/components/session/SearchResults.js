import React, { Fragment } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardText,
  CardFooter
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { highlightSearch } from "../../actions/sessionActions";

const SearchResults = ({ highlightSearch, session: { session, results } }) => {
  return (
    <Fragment>
      {results.map(result => (
        <Card style={{ marginTop: "0.5rem" }} key={result.title}>
          <CardHeader>
            <strong>{result.title}</strong>
          </CardHeader>
          <CardBody>
            <CardText>{result.snippet}</CardText>
            {result.displayLink}
          </CardBody>
          <CardFooter>
            <Button size="sm" href={result.link} target="_blank">
              Visit
            </Button>
            <Button
              size="sm"
              style={{ marginLeft: "1rem" }}
              onClick={() =>
                highlightSearch(
                  result.title,
                  result.snippet,
                  result.link,
                  session._id
                )
              }
            >
              Add
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Fragment>
  );
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
