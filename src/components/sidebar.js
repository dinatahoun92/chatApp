import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Room from "@material-ui/icons/Room";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreator from "../actions/actions";
import { flexbox } from "@material-ui/system";
import firebase from "../logic/firebase";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
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
    width: 0,
    [theme.breakpoints.up("sm")]: {
      width: 0
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
  },
  rooms: {
    display: "flex",
    flexDirection: "column"
    // paddingLeft: "80px"
  }
}));

export default function Sidebar() {
  const dispatch = useDispatch();
  const open = useSelector(state => state.burgerReducer.open);
  const user = useSelector(state => state.userReducer.user);
  const room = useSelector(state => state.roomReducer);
  const roomsRefFirebase = firebase.database().ref("rooms");
  const roomId = roomsRefFirebase.push().key;
  const [rooms, setRooms] = useState([]);
  const [chatName, setChatName] = useState("");
  const roomsRef = useRef();
  roomsRef.current = rooms;
  const [openModal, setOpenModal] = React.useState(false);

  function handleClickOpen() {
    setOpenModal(true);
  }

  function handleClose() {
    setOpenModal(false);
  }

  console.log(room);
  const classes = useStyles();
  const theme = useTheme();
  const addRoom = () => {
    const newRoom = {
      roomName: chatName,
      roomId,
      roomDesc: "room desc"
    };

    roomsRefFirebase
      .child(roomId)
      .set(newRoom)
      .then(room => {
        console.log(`sucess set : ${room}`);
      })
      .catch(err => console.log(err));
  };
  const addRoomsListner = () => {
    roomsRefFirebase.on(
      "child_added",
      function(snapshot) {
        const newRooms = [...roomsRef.current];
        newRooms.push(snapshot.val());
        setRooms(newRooms);
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  };
  const removeRooms = () => {
    console.log("room removed");
    roomsRefFirebase.off();
  };
  useEffect(() => {
    addRoomsListner();
    return () => removeRooms();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="persistent"
        anchor="left"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={() => dispatch(actionCreator.burger(false))}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary={user} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Room />
            </ListItemIcon>
            <div className={classes.rooms}>
              <ListItemText primary="Chat Rooms" />
              <ul>
                {rooms.map((room, index) => {
                  return (
                    <li
                      onClick={() => {
                        dispatch(actionCreator.room(rooms[index]));
                        dispatch(actionCreator.burger(false));
                      }}
                    >
                      {room.roomName}
                    </li>
                  );
                })}
              </ul>
              {/* <p
                onClick={() => {
                  dispatch(
                    actionCreator.room({
                      roomName: "room name 1",
                      roomId: "1",
                      roomDesc: "room 1 desc"
                    })
                  );
                  dispatch(actionCreator.burger(false));
                }}
              >
                asdsd
              </p>
              <p
                onClick={() => {
                  dispatch(
                    actionCreator.room({
                      roomName: "room name 2",
                      roomId: "2",
                      roomDesc: "room 2 desc"
                    })
                  );
                  dispatch(actionCreator.burger(false));
                }}
              >
                sdsdsd
              </p> */}
            </div>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
            >
              add room
            </Button>
          </ListItem>
        </List>
      </Drawer>
      {/* start modal */}
      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new room to this chat, please enter chat name here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="chatName"
            label="Chat Name"
            type="text"
            fullWidth
            value={chatName}
            onChange={e => setChatName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              addRoom();
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
