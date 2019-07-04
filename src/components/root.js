import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "./App";
import Registeration from "./registeration";
import Login from "../login";

export default function Root() {
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/register" component={Registeration} />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}
