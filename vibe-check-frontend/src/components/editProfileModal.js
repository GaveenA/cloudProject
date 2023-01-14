import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { UserContext } from "../context/AppContext";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { trimFieldsAndSanitize } from "../utilities/utils";
import { useFormik } from "formik";
import * as yup from "yup";
import { editUserProfile, setLoggedUser } from "./newRepository";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 4, 6),
  },
  division: {
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function EditProfileModal({
  open,
  handleClose,
  openEditSuccessAlert,
}) {
  const classes = useStyles();
  /* access user context */
  const { user, setUser } = useContext(UserContext);
  /* yup validation schema for user input */
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
    password: yup
      .string("Enter your password")
      .min(6, "Password should be of minimum 6 characters length")
      .nullable()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[,.?':;!"])(?=.*[@#$%^&*+=_~<>|])[A-Za-z\d,.?':;!"@#$%^&*+=_~<>|]{6,}$/,
        "Must Contain atleast 6 Characters and atleast One Uppercase, One Lowercase, One Number, One Punctuation and One Special-Case Character"
      ),
  });
  /* validate user inputs */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      password: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      /* trim and sanitize input fields */
      const trimmedFields = trimFieldsAndSanitize(values);
      /* Setting userData */
      const data = {
        username: user?.username,
        first_name: trimmedFields?.first_name,
        last_name: trimmedFields?.last_name,
        email: trimmedFields?.email,
        password: trimmedFields?.password,
      };
      /* Adding to Context */
      /* Only confirm change to state if following fields are not null */
      if (
        data.first_name !== null &&
        data.last_name !== null &&
        data.email !== null
      ) {
        /* call the endpoint to update user */
        const res = await editUserProfile(data);
        if (res.responseType === "success") {
          /* update relavant states with new data */
          setUser({ ...res.serverResponse });
          setLoggedUser({ ...res.serverResponse });
          /* close editProfileModal */
          handleClose();
          /* Show success alert */
          openEditSuccessAlert();
        }
      }
    },
  });

  const editProfileBody = (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{ margin: "2vh" }}>
          Edit Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="first_name"
              variant="outlined"
              required
              fullWidth
              id="first_name"
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
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={formik.handleSubmit}
        >
          Save Changes
        </Button>
      </div>
    </Container>
  );

  return (
    <div className={classes.division}>
      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {editProfileBody}
      </Modal>
    </div>
  );
}

/* References:
 Material UI Demos for Ref:
 Card Component: https://material-ui.com/components/cards/\
 Grids: https://material-ui.com/components/grid/
 Container: https://material-ui.com/components/container/
 Modal: https://material-ui.com/components/modal/

 Formik and Yup: https://material-ui.com/components/modal/
*/
