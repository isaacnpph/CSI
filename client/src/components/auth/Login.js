import React, { useState } from "react";
import { Container, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginUser } from "../../actions/authenticationActions";
import { Redirect } from "react-router-dom";

const Login = ({ loginUser, isAuthenticated }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const { email, password } = loginData;
  const onChange = e =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    loginUser(email, password);
  };

  // redirect to private area
  if (isAuthenticated) {
    return <Redirect to="/account" />;
  }

  return (
    <Container>
      <Form onSubmit={e => onSubmit(e)}>
        <FormGroup>
          <Label>Enter email</Label>
          <Input
            type="text"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Enter password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </FormGroup>
        <Button type="submit" value="Login">
          Log in
        </Button>
      </Form>
    </Container>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.authenticationReducer.isAuthenticated
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
