import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import TopMenu from "./topMenu";
import SideBar from "./sidebar";
import Chat from "./chat";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  }
}));

export default function App() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopMenu />
      <SideBar />
      <Chat />
    </div>
  );
}
