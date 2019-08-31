import React from "react";
import { Container, Grid, Header, Image, Divider } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import homePagePic from "./home_page_pic.jpg";

const HomePage = ({ isAuthenticated }) => {
  // if user is logged in, redirect it to the account page.
  if (isAuthenticated) {
    return <Redirect to="/account" />;
  }

  return (
    <Container className="main container">
      <Grid columns={2} style={{ height: "90vh" }} relaxed="very">
        <Grid.Column>
          <Header as="h2" color="teal" textAlign="center">
            Welcome to Collaborative Search Interface
          </Header>
          <Image src={homePagePic} />
        </Grid.Column>
        <Grid.Column>
          <Link className="ui button" to="/register">
            Let's get started!
          </Link>
        </Grid.Column>
      </Grid>
      <Divider vertical>></Divider>
    </Container>
  );
};

HomePage.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.authenticationReducer.isAuthenticated
});

export default connect(mapStateToProps)(HomePage);
