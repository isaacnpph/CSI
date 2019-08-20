import React, { Fragment, useState } from "react";
import { Collapse, Button, CardBody, Card, CardText } from "reactstrap";
import PropTypes from "prop-types";
import { removeComment } from "../../actions/sessionActions";
import { connect } from "react-redux";
import AddComment from "./AddComment";
import Moment from "react-moment";

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
          {comment.name}: {comment.content}
          <br />
          Posted on: <Moment format="DD/MM/YYYY">{comment.date}</Moment>
        </CardText>
        {!authentication.loading && comment.user === authentication.user._id && (
          <Button
            size="sm"
            color="danger"
            onClick={() => removeComment(session._id, searchId, comment._id)}
          >
            Remove Comment
          </Button>
        )}
      </CardBody>
    </Card>
  ));
  return (
    <Fragment>
      <Button
        size="sm"
        color="primary"
        style={{ marginLeft: "0.3rem" }}
        onClick={e => toggle(e)}
      >
        Comments {searchComments.length > 0 && searchComments.length}
      </Button>
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
