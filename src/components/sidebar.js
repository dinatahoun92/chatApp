import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreator from "../actions/actions";
import firebase from "../logic/firebase";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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
  },
  fab: {
    margin: theme.spacing(1),
    width: "45px",
    height: "45px"
  },
  roomsTitle: {
    padding: "20px",
    fontSize: "20px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  roomsLi: {
    listStyle: "none",
    cursor: "pointer",
    padding: "10px 0"
  },
  activeRoom: {
    borderRight: "4px solid #303f9f",
    backgroundColor: "#333"
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
  console.log(room);
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
        <Typography
          variant="h3"
          display="inline"
          gutterBottom
          className={classes.roomsTitle}
        >
          Rooms
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.fab}
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
        </Typography>
        <List component="nav" aria-label="Secondary mailbox folders">
          {rooms.map((roomItem, index) => {
            return room && roomItem.roomId !== room.roomId ? (
              <ListItem
                button
                onClick={() => {
                  dispatch(actionCreator.room(rooms[index]));
                }}
              >
                <ListItemText primary={"# " + roomItem.roomName} />
              </ListItem>
            ) : (
              <ListItem
                className={classes.activeRoom}
                button
                onClick={() => {
                  dispatch(actionCreator.room(rooms[index]));
                }}
              >
                <ListItemText primary={"# " + roomItem.roomName} />
              </ListItem>
            );
          })}
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
