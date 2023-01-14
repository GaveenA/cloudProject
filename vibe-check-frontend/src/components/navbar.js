import React, { useContext } from "react";
import { hexToRgb, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { UserContext } from "../context/AppContext";
import { useHistory } from "react-router-dom";
import { logoutUser } from "./newRepository";
import { colourPalette } from "../utilities/colorPalette";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: colourPalette.accent1,
    fontSize: "30px",
  },
  navbar_Button_Styling: {
    margin: theme.spacing(0, 2, 0),
    borderRadius: 17,
    color: hexToRgb(colourPalette.accent1),
    textTransform: "none",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  navBar_Button_text: {
    fontWeight: 500,
  },
  navBar_ToolBar: {
    width: "85%",
  },
  toolbar_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    /* navigate to login page after successful logout */
    history.push("/login");
  };

  return (
    <div className={classes.root}>
      <AppBar
        style={{
          position: "sticky",
          top: "0",
          position: "-webkit-sticky",
          display: "block",
          background: hexToRgb(colourPalette.primary1),
          boxShadow: "none",
        }}
      >
        <div className={classes.toolbar_container}>
          <Toolbar variant="regular" className={classes.navBar_ToolBar}>
            <Typography variant="h4" className={classes.title}>
              VibeCheck
            </Typography>
            <Button
              className={classes.navbar_Button_Styling}
              onClick={() => {
                history.push("./");
              }}
            >
              <Typography variant="h6" className={classes.navBar_Button_text}>
                Home
              </Typography>
            </Button>
            {user ? (
              <>
                <Button
                  className={classes.navbar_Button_Styling}
                  onClick={() => {
                    history.push("./forum");
                  }}
                >
                  <Typography
                    variant="h6"
                    className={classes.navBar_Button_text}
                  >
                    Forum
                  </Typography>
                </Button>

                <Button
                  className={classes.navbar_Button_Styling}
                  onClick={() => {
                    history.push("./profile");
                  }}
                >
                  <Typography
                    variant="h6"
                    className={classes.navBar_Button_text}
                  >
                    Profile
                  </Typography>
                </Button>

                <Button
                  className={classes.navbar_Button_Styling}
                  onClick={() => {
                    history.push("./friends");
                  }}
                >
                  <Typography
                    variant="h6"
                    className={classes.navBar_Button_text}
                  >
                    Friends
                  </Typography>
                </Button>

                <Button
                  className={classes.navbar_Button_Styling}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <Typography
                    variant="h6"
                    className={classes.navBar_Button_text}
                  >
                    Logout
                  </Typography>
                </Button>
              </>
            ) : (
              <>
                <Button
                  className={classes.navbar_Button_Styling}
                  onClick={() => {
                    history.push("/signup");
                  }}
                >
                  <Typography
                    variant="h6"
                    className={classes.navBar_Button_text}
                  >
                    Sign Up
                  </Typography>
                </Button>

                <Button
                  className={classes.navbar_Button_Styling}
                  onClick={() => {
                    history.push("/login");
                  }}
                >
                  <Typography
                    variant="h6"
                    className={classes.navBar_Button_text}
                  >
                    Login
                  </Typography>
                </Button>
              </>
            )}
          </Toolbar>
        </div>
      </AppBar>
    </div>
  );
}

/* References: 
 Material UI Demos for Ref: 
 AppBar Component: https://material-ui.com/components/app-bar/ 
*/
