import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Button, Form, FormGroup, Label, Input } from "reactstrap";
import {
  getCurrentUser,
  editPersonalDetails
} from "../../actions/accountActions";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

const EditPersonalDetails = ({
  account: { loading, user },
  editPersonalDetails,
  history
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    setFormData({
      name: loading || !user.name ? "" : user.name,
      email: loading || !user.email ? "" : user.email
    });
  }, [loading, user]);

  const { name, email } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    editPersonalDetails(formData, history);
  };
  return (
    <Container>
      <Form onSubmit={e => onSubmit(e)}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Enter name"
            value={name}
            onChange={e => onChange(e)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="text"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={e => onChange(e)}
          />
        </FormGroup>
        <Button size="sm" type="submit" value="EditPersonalDetails">
          Edit Personal Details
        </Button>
        <Link
          to="/account"
          style={{ marginLeft: "0.3rem" }}
          className="btn btn-secondary btn-sm"
        >
          Go Back To Account
        </Link>
      </Form>
    </Container>
  );
};

EditPersonalDetails.propTypes = {
  getCurrentUser: PropTypes.func.isRequired,
  editPersonalDetails: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  account: state.accountReducer
});

export default connect(
  mapStateToProps,
  { getCurrentUser, editPersonalDetails }
)(withRouter(EditPersonalDetails));
