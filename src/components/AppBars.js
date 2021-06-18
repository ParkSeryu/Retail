import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";
import axios from "axios";
import CloseIcon from "@material-ui/icons/Close";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw", // Fix IE 11 issue.
    marginTop: theme.spacing(8),
  },

  AppBar: {
    zIndex: 3,
    backgroundColor: "#DADCE0",
    color: "#000000",
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  menuInform: {
    position: "fixed",
    zIndex: 2,
    backgroundColor: "rgba(52, 73, 94, 1)",
    width: "65vw",
  },

  line: {
    marginBottom: "125px",
  },

  primaryText: {
    color: "#FFFFFF",
    marginTop: "15px",
  },

  secondaryText: {
    color: "#FFFFFF",
  },

  backIcon: { flaot: "right", color: "#FFFFFF" },

  closeIcon: {
    position: "absolute",
    right: "5px",
    top: "5px",
    color: "#FFFFFF",
  },

  logOutIcon: { float: "right", color: "#FFFFFF", marginRight: "1px" },

  logOut: {
    float: "right",
    color: "#FFFFFF",
  },

  title: {
    flexGrow: 1,
    fontFamily: "NanumGothic",
  },

  menuItem: {
    zIndex: 1,
    fontFamily: "NanumGothic",
    width: "65vw",
  },

  searchIcon: {
    marginTop: theme.spacing(0.5),
  },

  searchInform: {
    width: "100vw",
  },

  span: { lineHeight: "40px" },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 5px",
    marginLeft: "-10px",
  },

  button: {
    textAlign: "center",
    marginTop: "1.5vh",
    marginLeft: "2vw",
  },

  clearIcon: {
    position: "relative",
    float: "right",
    top: "-43px",
    left: "-1px",
    marginBottom: "-50px",
    zIndex: 2,
  },

  clearButton: {
    borderRadius: "5em",
    marginRight: "2vw",
    width: "30%",
    fontFamily: "NanumGothic",
    fontSize: "16px",
    backgroundColor: "#6E7277",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#6E7277",
    },
  },

  retrieveButton: {
    borderRadius: "5em",
    fontFamily: "NanumGothic",
    width: "30%",
    fontSize: "16px",
    backgroundColor: "#67B7D9",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#67B7D9",
    },
  },

  datePicker: {
    visibility: "hidden",
  },
}));

function AppBars({ history, programName }) {
  window.addEventListener("checkBackFlag", funCheckFlag, {
    once: true,
  });

  function funCheckFlag() {
    let count = 0;
    if (count === 0)
      if (toggle) {
        setToggle(false);
        console.log("toggle");
        count = count + 1;
      }

    window.sessionStorage.setItem("closeFlag", count);
  }

  const list = JSON.parse(window.sessionStorage.getItem("program_list"));
  const classes = useStyles();
  const [toggle, setToggle] = useState(false);

  const logOut = () => {
    if (window.sessionStorage.getItem("userAgent") === "android") {
      let token = window.BRIDGE.connectAndroid();
      let form = new FormData();

      form.append("token", token);
      axios
        .post(
          "http://121.165.242.72:5050/retail/developer/index.php/login/logout",
          form
        )
        .then(() => {
          history.replace({
            pathname: "/",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  return (
    <div>
      <AppBar className={classes.AppBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setToggle(!toggle)}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            {programName}
          </Typography>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        open={toggle}
        onClose={() => setToggle(!toggle)}
        onOpen={() => setToggle(!toggle)}
      >
        <ListItem className={classes.menuInform}>
          <ListItemText
            primary={
              <Typography type="body2" className={classes.primaryText}>
                {window.sessionStorage.getItem("branch_name")}
              </Typography>
            }
            secondary={
              <>
                <Typography
                  type="body2"
                  gutterBottom
                  className={classes.secondaryText}
                >
                  {window.sessionStorage.getItem("user_name")}
                </Typography>
                <span
                  onClick={() => {
                    setToggle(!toggle);
                    logOut();
                  }}
                >
                  <Typography type="body2" className={classes.logOut}>
                    로그아웃
                  </Typography>
                  <ExitToAppIcon className={classes.logOutIcon} />
                </span>
              </>
            }
          />
          <CloseIcon
            onClick={() => setToggle(!toggle)}
            className={classes.closeIcon}
          />
        </ListItem>

        <Divider className={classes.line} />
        {list.map((listData) => {
          return (
            <div key={listData.PROGRAM_ID}>
              <MenuItem
                className={classes.menuItem}
                onClick={() => {
                  if (programName !== listData.PROGRAM_NAME) {
                    history.replace({
                      pathname: "/" + listData.PROGRAM_ID,
                    });
                  }
                }}
              >
                {listData.PROGRAM_NAME}
              </MenuItem>
              <Divider />
            </div>
          );
        })}
      </SwipeableDrawer>
    </div>
  );
}

export default withRouter(AppBars);
