import React, { useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/authenticationActions";
import { Redirect } from "react-router-dom";
import register from "./register.jpg";
import { Container, Button, Grid, Image } from "semantic-ui-react";

const Register = ({ registerUser, isAuthenticated }) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { name, email, password, confirmPassword } = registerData;
  const onChange = e =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
    } else {
      registerUser({ name, email, password });
    }
  };

  // redirect to private area
  if (isAuthenticated) {
    return <Redirect to="/account" />;
  }

  return (
    <Container className="main regPage">
      <Grid columns={2} style={{ height: "80vh" }} relaxed="very" divided>
        <Grid.Column>
          <Image src={register} />
        </Grid.Column>
        <Grid.Column>
          <Form onSubmit={e => onSubmit(e)}>
            <FormGroup>
              <Label>Enter your first name and surname</Label>
              <Input
                type="text"
                name="name"
                placeholder="e.g. Patrick Smith"
                value={name}
                onChange={e => onChange(e)}
                // required
              />
            </FormGroup>
            <FormGroup>
              <Label>Enter your email address</Label>
              <Input
                type="text"
                name="email"
                placeholder="e.g. patrick.smith@gmail.com"
                value={email}
                onChange={e => onChange(e)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Enter password. It must be at least 6 characters</Label>
              <Input
                type="password"
                name="password"
                placeholder="..."
                value={password}
                onChange={e => onChange(e)}
                minLength="6"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Confirm password</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="..."
                value={confirmPassword}
                onChange={e => onChange(e)}
                minLength="6"
                required
              />
            </FormGroup>
            <Button type="submit" value="Register">
              Register
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.authenticationReducer.isAuthenticated
});

export default connect(
  mapStateToProps,
  { registerUser }
)(Register);
