import React from "react";
import Grid from "@material-ui/core/Grid";
import { hexToRgb, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { colourPalette } from "../utilities/colorPalette";
import { Typography } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  outerDiv: {
    flexGrow: 1,
    background: hexToRgb(colourPalette.primary1),
    paddingTop: theme.spacing(10),
    margin: 0,
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    color: theme.palette.text.secondary,
    width: "90%",
    height: "100%",
    minHeight: "50vh",
    maxWidth: 800,
    borderRadius: 30,
    backgroundColor: colourPalette.secondary3,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredGrid: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    margin: "auto",
    height: "20vh",
    width: "20vh",
  },
  backgroundColor: {
    background: hexToRgb("#afa1d4"),
  },
  textGrid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  image: {
    width: "90%",
    height: "100%",
    minHeight: "50vh",
    maxWidth: 800,
    borderRadius: 30,
    objectFit: "cover",
  },
}));

function Home() {
  const classes = useStyles();
  return (
    <div className={classes.outerDiv}>
      <Grid container component="main" className={classes.container}>
        <CssBaseline />
        <Grid item xs={12} sm={6} className={classes.container}>
          <img alt="cover" src="home_image_1.jpeg" className={classes.image} />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.container}>
          <Paper className={classes.paper}>
            <Grid item xs={10} className={classes.textGrid}>
              <Typography variant="h3">Welcome to VibeCheck</Typography>
              <p></p>
              <p></p>
              <Typography variant="h6">
                VibeCheck provides a safe space to connect with all your friends
                and engage with the broader college community at University.
              </Typography>
              <p></p>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container className={classes.container}>
        <Grid item xs={12} sm={6} className={classes.container}>
          <Paper className={classes.paper}>
            <Grid item xs={10} className={classes.textGrid}>
              <Typography variant="h3">Why you should join?</Typography>
              <p></p>
              <Typography variant="h6">
                Here at VibeCheck you can catch up with all your friends,
                exchange lockdown stories collaborate on uni projects, all from
                the comfort of your own home and most importantly without
                violating lockdown rules.
              </Typography>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.container}>
          <img alt="cover" src="home_image_2.jpeg" className={classes.image} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;

/* References:
 Material UI :
 Grids: https://material-ui.com/components/grid/
 Container: https://material-ui.com/components/container/
 Paper Component: https://material-ui.com/components/paper/
*/
