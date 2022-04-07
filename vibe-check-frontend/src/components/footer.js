import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { colourPalette } from "../utilities/colorPalette";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    fontSize: "20px",
    color: "white",
  },
  subTitle: {
    fontSize: "14px",
    color: "white",
  },
  navBar_ToolBar: {
    width: "100%",
    backgroundColor: colourPalette.secondary1,
  },
  toolbar_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.toolbar_container}>
        <Toolbar variant="dense" className={classes.navBar_ToolBar}>
          <div className={classes.container}>
            <Typography className={classes.title}>VibeCheck</Typography>
            <Typography className={classes.subTitle}>
              © 2021 VibeCheck. All rights reserved
            </Typography>
          </div>
        </Toolbar>
      </div>
    </div>
  );
}

/* References: 
 Material UI: 
 ToolBar : https://material-ui.com/api/toolbar/#toolbar-api
*/
