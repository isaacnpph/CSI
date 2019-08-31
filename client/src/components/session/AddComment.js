import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup
} from "reactstrap";
import { addComment } from "../../actions/sessionActions";
import { Button } from "semantic-ui-react";

const AddComment = ({ addComment, session, searchId }) => {
  const [content, setContent] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    addComment(session._id, searchId, { content });
  };

  return (
    <Fragment>
      <Form onSubmit={e => onSubmit(e)}>
        <FormGroup>
          <InputGroup size="sm" style={{ marginTop: "0.5rem" }}>
            <Input
              name="name"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <InputGroupAddon addonType="append">
              <Button size="mini">Add Comment</Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
      </Form>
    </Fragment>
  );
};

AddComment.propTypes = {
  addComment: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  searchId: PropTypes.string.isRequired
};

export default connect(
  null,
  { addComment }
)(AddComment);
