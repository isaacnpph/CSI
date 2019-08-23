import React, { Fragment, useState } from "react";
import { Collapse, CardBody, Card, CardText } from "reactstrap";
import PropTypes from "prop-types";
import { removeComment } from "../../actions/sessionActions";
import { connect } from "react-redux";
import AddComment from "./AddComment";
import Moment from "react-moment";
import { Button } from "semantic-ui-react";

const CommentSection = ({
  authentication,
  removeComment,
  session,
  searchId,
  searchComments
}) => {
  const [collapse, setCollapse] = useState(false);

  const toggle = e => {
    setCollapse(!collapse);
  };

  const searchComms = searchComments.map(comment => (
    <Card key={comment._id} style={{ marginTop: "0.5rem" }}>
      <CardBody>
        <CardText>
          <strong>{comment.name}: </strong> {comment.content}
          <br />
          Posted on: <Moment format="DD/MM/YYYY">{comment.date}</Moment>
        </CardText>
        {!authentication.loading &&
          comment.user === authentication.user._id && (
            <Button
              icon="trash alternate outline"
              onClick={() => removeComment(session._id, searchId, comment._id)}
            />
          )}
      </CardBody>
    </Card>
  ));
  return (
    <Fragment>
      <Button icon="comments" onClick={e => toggle(e)} />
      <Collapse isOpen={collapse}>
        {searchComms.length === 0 && (
          <Card style={{ marginTop: "0.5rem" }}>
            <CardBody>
              <CardText>Write first comment</CardText>
            </CardBody>
          </Card>
        )}
        {searchComms}
        <AddComment session={session} searchId={searchId} />
      </Collapse>
    </Fragment>
  );
};

CommentSection.propTypes = {
  removeComment: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  searchId: PropTypes.string.isRequired,
  searchComments: PropTypes.array.isRequired,
  authentication: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authentication: state.authenticationReducer
});

export default connect(
  mapStateToProps,
  { removeComment }
)(CommentSection);
