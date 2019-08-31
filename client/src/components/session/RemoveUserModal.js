import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
  Form,
  FormGroup
} from "reactstrap";
import { connect } from "react-redux";
import { removeUser } from "../../actions/sessionActions";
import { Button } from "semantic-ui-react";

const RemoveUserModal = ({ session: { session }, removeUser }) => {
  const [formData, setFormData] = useState("");

  const [modal, setModal] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    removeUser(formData, session._id);
    setModal(false);
  };

  const onClick = e => {
    setModal(!modal);
  };

  return (
    <Fragment>
      <Button
        className="removeUserButton"
        circular
        icon="remove user"
        onClick={e => onClick(e)}
      />
      <Modal isOpen={modal} toggle={e => onClick(e)}>
        <ModalHeader toggle={e => onClick(e)}>
          Remove user from the session
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={e => onSubmit(e)}>
            <FormGroup>
              <Label for="invite">User email</Label>
              <Input
                type="text"
                name="email"
                placeholder="e.g. joemon@gmail.com"
                onChange={e => setFormData(e.target.value)}
                required
              />
              <Button style={{ marginTop: "2rem" }}>Remove User</Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

RemoveUserModal.propTypes = {
  removeUser: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  session: state.sessionReducer
});

export default connect(
  mapStateToProps,
  { removeUser }
)(RemoveUserModal);
