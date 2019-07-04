import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import App from "./App";
import Registeration from "./registeration";
import Login from "./login";
import firebase from "../logic/firebase";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreator from "../actions/actions";
import { withRouter } from "react-router-dom";
function Root({ history }) {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("allready logged in -> navigate to /");
        dispatch(
          actionCreator.user({
            user: user.displayName,
            userId: user.uid
          })
        );
        history.push("/");
      } else {
        console.log("not logged in -> navigate to /Login");
        history.push("/Login");
      }
    });
  }, []);
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/register" component={Registeration} />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}
export default withRouter(Root);
