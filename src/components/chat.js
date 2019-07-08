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
import moment from "moment";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "glamor";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    marginTop: "65px",
    width: "100%",
    height: "calc(100vh - 65px)",
    flexDirection: "column",
    alignContent: "flex-end",
    height: "calc(100vh - 65px)"
  },
  listsRoot: {
    backgroundColor: theme.palette.background.paper,
    backgroundColor: "transparent",
    justifyContent: "center"
  },
  inline: {
    display: "inline"
  },
  btnRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    position: "sticky",
    bottom: 0,
    zIndex: 99999999
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
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  avatarSelf: {
    textTransform: "uppercase"
  },
  avatar: {
    textTransform: "uppercase",
    backgroundColor: "#3f51b5",
    color: "#f2f2f2"
  },
  chatTxt: {
    display: "flex",
    padding: "20px",
    borderRadius: "20px",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#504c4c",
    maxWidth: "65%"
  },
  chatTxtSelf: {
    display: "flex",
    padding: "20px",
    borderRadius: "20px",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#111",
    maxWidth: "65%"
  },
  chatItemSelf: {
    display: "flex",
    justifyContent: "flex-end"
  },
  chatItem: {
    display: "flex",
    justifyContent: "flex-start"
  },
  txt: {
    paddingTop: "10px",
    paddingBottom: "10px",
    letterSpacing: "2px",
    fontWeight: 300,
    wordBreak: "break-all"
  },
  userChat: {
    fontWeight: 500,
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase"
  },
  timeSelf: {
    fontSize: "10px",
    color: "#f2f2f2",
    textAlign: "right",
    paddingRight: "16px",
    marginBottom: "20px",
    width: "70%"
  },
  time: {
    fontSize: "10px",
    color: "#f2f2f2",
    textAlign: "right",
    paddingRight: "16px",
    marginBottom: "20px"
  }
}));

export default function Chat() {
  const dispatch = useDispatch();
  const room = useSelector(state => state.roomReducer);
  const user = useSelector(state => state.userReducer);
  const [messages, setMessages] = useState([]);
  const [msgText, setMessageTxt] = useState("");
  const msgsRef = useRef();
  const chat = useRef();
  const ROOT_CSS = css({
    height: "100vh",
    width: "100%"
  });
  msgsRef.current = messages;

  const createMessage = msgId => ({
    msgId: massageId,
    msgText,
    room: room.roomId,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    user
  });
  const messagesRefFirebase = firebase.database().ref("messages");
  const messagesRefFirebasePerRoom = messagesRefFirebase.child(room.roomId);
  const massageId = messagesRefFirebasePerRoom.push().key;

  const newMessage = createMessage(massageId);

  const addMsgs = () => {
    setMessages([]);
    messagesRefFirebasePerRoom.on(
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
  const handleKeyPress = event => {
    if (event.key === "Enter") {
      messagesRefFirebasePerRoom
        .child(massageId)
        .set(newMessage)
        .then(msg => {
          console.log(`sucess set : ${msg}`);
          setMessageTxt("");
        })
        .catch(err => console.log(err));
    }
  };
  const removeMsgs = () => {
    console.log("msg removed");
    messagesRefFirebasePerRoom.off();
  };
  useEffect(() => {
    chat.current.scrollIntoView({ block: "start" });
    addMsgs();
    console.log(messages);
    return () => removeMsgs();
  }, [room.roomId]);

  const classes = useStyles();
  return (
    <ScrollToBottom className={ROOT_CSS}>
      <div className={classes.root} alignItems="flex-end">
        <CssBaseline />
        <div style={{ flexGrow: 1 }} />
        <List className={classes.listsRoot} ref={chat}>
          {messages.map((msg, index) => (
            <React.Fragment>
              <ListItem
                key={index}
                className={
                  msg.user.userId === user.userId
                    ? classes.chatItemSelf
                    : classes.chatItem
                }
              >
                <ListItemAvatar>
                  <Avatar
                    className={
                      msg.user.userId === user.userId
                        ? classes.avatarSelf
                        : classes.avatar
                    }
                  >
                    {msg.user.user.substring(0, 1)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  className={
                    msg.user.userId === user.userId
                      ? classes.chatTxtSelf
                      : classes.chatTxt
                  }
                  primary={
                    <Typography
                      component="h5"
                      variant="body2"
                      className={classes.userChat}
                      color="textPrimary"
                    >
                      {msg.user.user}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="h5"
                        variant="body2"
                        className={classes.txt}
                        color="textPrimary"
                      >
                        {msg.msgText}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Typography
                component="h5"
                variant="body2"
                className={
                  msg.user.userId === user.userId
                    ? classes.time
                    : classes.timeSelf
                }
                color="textPrimary"
              >
                {moment(msg.timestamp).fromNow()}
              </Typography>
            </React.Fragment>
          ))}
        </List>
        <Paper className={classes.btnRoot}>
          <InputBase
            className={classes.input}
            placeholder="write your messages ..."
            onChange={event => setMessageTxt(event.target.value)}
            value={msgText}
            onKeyPress={handleKeyPress}
          />

          <Divider className={classes.divider} />
          <SendIcon
            color="primary"
            className={classes.iconButton}
            aria-label="Directions"
            onClick={() =>
              messagesRefFirebasePerRoom
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
    </ScrollToBottom>
  );
}
