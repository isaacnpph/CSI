import React, { useState } from "react";
import {
  Container,
  Grid,
  Header,
  Message,
  Segment,
  Button
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Form, FormGroup, Input } from "reactstrap";
import PropTypes from "prop-types";
import { loginUser } from "../../actions/authenticationActions";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

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
    <Container className="main container">
      <Grid
        textAlign="center"
        style={{ height: "75vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header textAlign="center">Sign in to your account</Header>
          <Form onSubmit={e => onSubmit(e)}>
            <Segment>
              <FormGroup>
                <Input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => onChange(e)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => onChange(e)}
                  required
                />
              </FormGroup>
              <Button fluid size="large" type="submit" value="Login">
                Sign in
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <Link to="/register">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
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
