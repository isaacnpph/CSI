import React, { Fragment, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/layout/AppNavbar";
import AppNavbar from "./components/layout/AppNavbar";
import HomePage from "./components/layout/HomePage";
import AboutUs from "./components/layout/AboutUs";
import ContactUs from "./components/layout/ContactUs";
import EditPersonalDetails from "./components/account/EditPersonalDetails";
import SessionList from "./components/account/SessionList";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AccountBoard from "./components/account/AccountBoard";
import SessionView from "./components/session/SessionView";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authenticationActions";
import setAuthToken from "./utilities/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <AppNavbar />
          <section className="container">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/about" component={AboutUs} />
              <Route exact path="/contact" component={ContactUs} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/account" component={AccountBoard} />
              <PrivateRoute
                exact
                path="/edit-personal-details"
                component={EditPersonalDetails}
              />
              <PrivateRoute
                exact
                path="/user-sessions"
                component={SessionList}
              />
              <PrivateRoute
                exact
                path="/sessions/:id"
                component={SessionView}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
