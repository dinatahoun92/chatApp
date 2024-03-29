import React, { useContext, useState, useEffect, useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import firebase from "../logic/firebase";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreator from "../actions/actions";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Registeration({ history }) {
  const classes = useStyles();
  const [displayName, setUserName] = useState("");
  const [displayNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [disable, setDisable] = useState(false);
  const user = useSelector(state => state.userReducer.user);

  const [firebaseError, setFirebaseError] = useState("");

  const dispatch = useDispatch();
  const userError = displayName => {
    if (!displayName.length) {
      setUserNameError("User name mustn't be empty");
      setDisable(true);
    } else {
      setUserNameError("");
      setDisable(false);
    }
  };
  // useEffect(() => {
  //   userError(displayName);
  // }, []);
  const register = e => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(createNewUser => {
        createNewUser.user.updateProfile({ displayName }).then(() => {
          dispatch(
            actionCreator.user({
              user: displayName,
              userId: createNewUser.user.uid
            })
          );
          history.push("/");
        });
      })
      .catch(err => {
        console.log(err);
        setFirebaseError(err.message);
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                autoComplete="lname"
                value={displayName}
                onChange={e => {
                  setUserName(e.target.value);
                  userError(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Grid>
            <FormControl className={classes.formControl} error>
              <FormHelperText id="component-error-text">
                {firebaseError}
              </FormHelperText>
              <FormHelperText id="component-error-text">
                {displayNameError}
              </FormHelperText>
            </FormControl>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          {!displayName.length || !password.length || !email.length ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={register}
              disabled
            >
              Sign Up
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={register}
              disabled={disable}
            >
              Sign Up
            </Button>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5} />
    </Container>
  );
}
