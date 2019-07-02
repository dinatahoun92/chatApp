import React, { useState, useEffect, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import firebase from "../logic/firebase";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import { fontSize } from "@material-ui/system";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    marginTop: "65px",
    width: "100%",
    height: "calc(100vh - 65px)",
    alignItems: "flex-end",
    flexDirection: "column",
    alignContent: "flex-end",
    height: "calc(100vh - 65px)"
  },
  listsRoot: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  },
  btnRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  paper: {
    width: "100%",
    display: "flex"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10,
    fontSize: "50px"
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default function Chat() {
  const dispatch = useDispatch();
  const roomId = useSelector(state => state.roomReducer.roomId);
  const user = useSelector(state => state.userReducer.user);
  const [messages, setMessages] = useState([]);
  const [msgText, setMessageTxt] = useState("");
  const msgsRef = useRef();
  msgsRef.current = messages;

  const createMessage = msgId => ({
    msgId: massageId,
    msgText,
    roomId,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    user
  });
  const messagesRefFirebase = firebase.database().ref("messages");
  const massageId = messagesRefFirebase.push().key;

  const newMessage = createMessage(massageId);

  const addMsgs = () => {
    messagesRefFirebase.on(
      "child_added",
      function(snapshot) {
        const newMsgs = [...msgsRef.current];
        newMsgs.push(snapshot.val());
        setMessages(newMsgs);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  };
  const removeMsgs = () => {
    console.log("msg removed");
    messagesRefFirebase.off();
  };
  useEffect(() => {
    addMsgs();
    console.log(messages);
    return () => removeMsgs();
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.root} alignItems="flex-end">
      <CssBaseline />
      <div style={{ flexGrow: 1 }} />
      <List className={classes.listsRoot}>
        {messages.map((msg, index) => (
          <ListItem key={index} alignItems="flex-end">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    Ali Connors
                  </Typography>
                  {msg.msgText}
                </React.Fragment>
              }
            />
            <Divider variant="inset" component="li" />
          </ListItem>
        ))}
      </List>
      <Paper className={classes.btnRoot}>
        <InputBase
          className={classes.input}
          placeholder="write your messages ..."
          onChange={event => setMessageTxt(event.target.value)}
          value={msgText}
        />

        <Divider className={classes.divider} />
        <SendIcon
          color="secondary"
          className={classes.iconButton}
          aria-label="Directions"
          onClick={() =>
            messagesRefFirebase
              .child(massageId)
              .set(newMessage)
              .then(msg => {
                console.log(`sucess set : ${msg}`);
                setMessageTxt("");
              })
              .catch(err => console.log(err))
          }
        />
      </Paper>
    </div>
  );
}
