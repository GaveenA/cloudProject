import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { API_URL } from '../utilities/utils';
import axios from 'axios';
import * as yup from "yup";
import { UserContext } from "../context/AppContext";
import { useHistory } from "react-router-dom";
import PopupErrorDialog from "../utilities/popupErrorDialog";
import { submitLogin, addUserLoginDetail, setLoggedUser } from "../components/newRepository";
import { trimFieldsAndSanitize } from "../utilities/utils";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string("Enter your password").required("Password is required"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(sign_in_page_background.jpeg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const [loginFailAlert, setLoginFailAlert] = useState(false)
  const [loginFailText, setLoginFailText] = useState("")

const getConfig = (email, password) => {
  const config = {
    method: "get",
    url: API_URL + `/api/users/login?email=${email}&password=${password}`,
    timeout: 10000,
    headers: { }
  };
  return config;
}
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const trimmedFields = trimFieldsAndSanitize(values);
      console.log(trimmedFields)
      const data = {
        email: trimmedFields?.email,
        password: trimmedFields?.password,
      };

      const submit_login_res = await submitLogin(data.email, data.password)
      console.log(submit_login_res);
      if(submit_login_res.responseType === "success"){
        const userObj = submit_login_res.serverResponse;
        if(userObj?.blocked === false || userObj?.blocked === 0 ){
          await addUserLoginDetail({ username: userObj.username, date: Date.now()});
          setLoggedUser(userObj)
          setUser(userObj);
          history.push("/profile");
        }
        else{
          setLoginFailText("Sorry your account has been blocked, please contact admin")
          setLoginFailAlert(true)
        }
      }
      else{
        setLoginFailText("Invalid Credentials")
        setLoginFailAlert(true)
      }
    },
  });

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <div className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={formik.handleSubmit}
            >
              Sign In
            </Button>
          </div>
        </div>
      </Grid>
      {loginFailAlert === true ? (
          <PopupErrorDialog
            alertTitle={"Error: Login Failed"}
            alertBody={
              loginFailText
            }
            open={loginFailAlert}
            handleClose={setLoginFailAlert}
          />
        ) : (
          <></>
        )}
    </Grid>
  );
}



/* References: 
 Material UI Demos for Ref: 
 Grids: https://material-ui.com/components/grid/   
 Signin: https://material-ui.com/getting-started/templates/
 Formik and Yup: https://material-ui.com/components/modal/
*/
