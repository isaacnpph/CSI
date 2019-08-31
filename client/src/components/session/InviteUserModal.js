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
import { inviteUser } from "../../actions/sessionActions";
import { Button } from "semantic-ui-react";

const InviteUserModal = ({ session: { session }, inviteUser }) => {
  const [formData, setFormData] = useState({
    email: ""
  });

  const [modal, setModal] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    inviteUser(formData, session._id);
    setModal(false);
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onClick = e => {
    setModal(!modal);
  };

  return (
    <Fragment>
      <Button
        className="addUserButton"
        circular
        icon="add user"
        onClick={e => onClick(e)}
      />
      <Modal isOpen={modal} toggle={e => onClick(e)}>
        <ModalHeader toggle={e => onClick(e)}>
          Invite friend to your session
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={e => onSubmit(e)}>
            <FormGroup>
              <Label for="invite">User email</Label>
              <Input
                type="text"
                name="email"
                placeholder="e.g. joemon@gmail.com"
                onChange={e => onChange(e)}
                required
              />
              <Button style={{ marginTop: "2rem" }}>Add User</Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

InviteUserModal.propTypes = {
  inviteUser: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  session: state.sessionReducer
});

export default connect(
  mapStateToProps,
  { inviteUser }
)(InviteUserModal);
