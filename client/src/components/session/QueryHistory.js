import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { ListGroup, ListGroupItem } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getQueriesBySessionId } from "../../actions/queryActions";
import { connect } from "react-redux";

const QueryHistory = ({
  getQueriesBySessionId,
  session: { session },
  query: { queries }
}) => {
  useEffect(() => {
    getQueriesBySessionId(session._id);
  }, [getQueriesBySessionId, session._id]);
  return (
    <Fragment>
      <p>Query History:</p>
      {queries.map(({ _id, keyword, addedBy }) => (
        <ListGroup key={_id}>
          <TransitionGroup className="session-list">
            <CSSTransition timeout={500} classNames="fade">
              <ListGroupItem>
                <p>Keyword: {keyword}</p>
                <p>Added By: {addedBy}</p>
              </ListGroupItem>
            </CSSTransition>
          </TransitionGroup>
        </ListGroup>
      ))}
    </Fragment>
  );
};

QueryHistory.propTypes = {
  getQueriesBySessionId: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  session: state.sessionReducer,
  query: state.queryReducer
});

export default connect(
  mapStateToProps,
  { getQueriesBySessionId }
)(QueryHistory);
