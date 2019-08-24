import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { createSession } from "../../actions/accountActions";

const CreateSession = ({ createSession }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [modal, setModal] = useState(false);
  const { name, description } = formData;

  const onClick = e => {
    setModal(!modal);
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createSession(formData);
    setModal(false);
  };
  return (
    <Fragment>
      <Button style={{ marginTop: "0.3rem" }} onClick={e => onClick(e)}>
        Create Session
      </Button>
      <Modal isOpen={modal} toggle={e => onClick(e)}>
        <ModalHeader toggle={e => onClick(e)}>Create Session</ModalHeader>
        <ModalBody>
          <Form onSubmit={e => onSubmit(e)}>
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                name="name"
                placeholder="Title..."
                value={name}
                onChange={e => onChange(e)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                placeholder="Description..."
                value={description}
                onChange={e => onChange(e)}
                required
              />
            </FormGroup>
            <Button style={{ marginTop: "2rem" }}>Create Session</Button>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

CreateSession.propTypes = {
  createSession: PropTypes.func.isRequired
};

export default connect(
  null,
  { createSession }
)(CreateSession);
