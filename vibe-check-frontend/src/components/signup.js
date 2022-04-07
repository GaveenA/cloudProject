import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../context/AppContext";
import { useHistory } from "react-router-dom";
import { submitSignup, setLoggedUser } from "./newRepository";
import PopupErrorDialog from "../utilities/popupErrorDialog"
import { trimFieldsAndSanitize} from "../utilities/utils";
import { addUserLoginDetail } from "./newRepository";

const validationSchema = yup.object({
  first_name: yup
    .string("Enter your First Name")
    .required("First Name is required"),
  last_name: yup
    .string("Enter your Last Name")
    .required("Last Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  username: yup
    .string("Enter a Username")
    .min(3, "Username should be of minimum 3 characters length")
    .required("Username is required")
    .matches(
      /^[a-zA-Z0-9_.-]{3,}$/,
      "Must Contain only Letters and Numbers - Atleast 3 characters long"
    ),
  password: yup
    .string("Enter your password")
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[,.?':;!"])(?=.*[@#$%^&*+=_~<>|])[A-Za-z\d,.?':;!"@#$%^&*+=_~<>|]{6,}$/,
      "Must Contain atleast 6 Characters and atleast One Uppercase, One Lowercase, One Number, One Punctuation and One Special-Case Character"
    ),
});

const useStyles = makeStyles((theme) => ({
  outerDiv: {
    minHeight: "97vh",
    display: "flex",
    allignItems: "center",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: "5vh",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const history = useHistory();
  const { setUser } = useContext(UserContext);
  const classes = useStyles();
  const [signupFailAlert, setSignupFailAlert] = useState(false);
  const [signupAlertText, setSignupAlertText] = useState("")

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      /* trim and sanitise user inputs when signing up */
      const trimmedFields = trimFieldsAndSanitize(values);
      //Setting userData
      const data = {
        first_name: trimmedFields?.first_name,
        last_name: trimmedFields?.last_name,
        email: trimmedFields?.email,
        username: trimmedFields?.username,
        password: trimmedFields?.password,
        date_joined: new Date().toLocaleDateString(),
        profile_pic_url: null,
        blocked: false,
      };

        const res = await submitSignup(data)
        console.log("awaiting signup res ion frontend")
        console.log(res);
        if(res.responseType == "success"){
          await addUserLoginDetail({ username: res?.serverResponse?.username, date: Date.now()});
          console.log(res.serverResponse);
          setLoggedUser(res.serverResponse);
          setUser(res.serverResponse);
          history.push("/profile");
        }
        else if(res.responseType == "errorCode"){
          if(res.serverResponse == "Invalid Email"){
            setSignupAlertText("Invalid Email - user already exists with this email")
            setSignupFailAlert(true);
          }
          else if(res.serverResponse == "Invalid Username"){
            setSignupAlertText("Invalid Username - user already exists with this username")
            setSignupFailAlert(true);
          }
        }
        else if(res.responseType == "failed"){
          console.log(res.error);
          setSignupAlertText("System Error - Check details and try again")
          setSignupFailAlert(true);
        }
    },
  });

  return (
    <div className={classes.outerDiv}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{ margin: "2vh" }}>
            Sign up
          </Typography>
          <Grid container spacing={2} className={classes.form}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first_name"
                variant="outlined"
                required
                fullWidth
                id="first_name"
                label="First Name"
                autoFocus
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.first_name && Boolean(formik.errors.first_name)
                }
                helperText={formik.touched.first_name && formik.errors.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="lname"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.last_name && Boolean(formik.errors.last_name)
                }
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                name="username"
                autoComplete="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={formik.handleSubmit}
          >
            Sign Up
          </Button>
        </div>
      </Container>
      {signupFailAlert === true ? (
          <PopupErrorDialog
            alertTitle={"Signup Failed"}
            alertBody={
              signupAlertText
            }
            open={signupFailAlert}
            handleClose={setSignupFailAlert}
          />
        ) : (
          <></>
        )}
    </div>
  );
}

/* References: 
 Material UI Demos for Ref: 
 Grids: https://material-ui.com/components/grid/   
 Signup: https://material-ui.com/getting-started/templates/
 Formik and Yup: https://material-ui.com/components/modal/
*/
