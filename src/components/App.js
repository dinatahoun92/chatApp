import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import TopMenu from "./topMenu";
import SideBar from "./sidebar";
import Chat from "./chat";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  }
}));

export default function App() {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <TopMenu />
        <SideBar />
        <Chat />
      </div>
    </MuiThemeProvider>
  );
}
