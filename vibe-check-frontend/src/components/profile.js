import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../context/AppContext";
import EditProfileModal from "./editProfileModal";
import Grid from "@material-ui/core/Grid";
import { red } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { hexToRgb, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AlertDialog from "../utilities/alertDialog";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import { colourPalette } from "../utilities/colorPalette";
import CustomAlert from "../utilities/customAlert";
import { editUserProfile } from "./newRepository";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { UploadToCloud } from "../utilities/uploadToCloud";
import { v4 as uuidv4 } from "uuid";
import { deleteUserAccount, setLoggedUser, logoutUser } from "./newRepository";

const useStyles = makeStyles((theme) => ({
  outerDiv: {
    flexGrow: 1,
    background: hexToRgb(colourPalette.primary1),
    paddingTop: theme.spacing(10),
    minHeight: "97vh",
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,

    margin: "auto",
    width: "90%",
    height: "90%",
    minHeight: "80vh",
    maxWidth: 900,
    marginBottom: "10vh",

    display: "flex",
    alignItems: "center",
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
    backgroundColor: red[500],
    fontSize: "5em",
  },
  userDetailsGrid: {
    marginTop: "5%",
    marginBottom: "4%",
  },
  backgroundColor: {
    background: hexToRgb("#afa1d4"),
  },
  profile_Button_Styling: {
    margin: theme.spacing(0, 2, 0),
    borderRadius: 17,
    backgroundColor: hexToRgb(colourPalette.primary1_2),
    color: "white",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
  delete_Button_Styling: {
    margin: theme.spacing(0, 2, 0),
    borderRadius: 17,
    backgroundColor: "#d91900",
    color: "white",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "white",
      color: "#d91900",
    },
  },
}));



const Profile = () => {
  const history = useHistory();
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [editSuccessAlert, setEditSuccessAlert] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const fileInput = useRef();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleDeleteClick = () => {
    setAlertOpen(true);
  };
  const deleteAccount = async () => {
    const delete_user_res = await deleteUserAccount(user?.username);
    if(delete_user_res.responseType == "success"){
      //remove logged user from local storage (cache)
      logoutUser();
      // Remove logged user from state
      setUser(null);
      history.push("/");
    }
  };

  /* Open and Close Alert for Post Succesfully Edited */
  const setEditSuccessAlertOpen = () => {
    setEditSuccessAlert(true);
  };

  const setEditSuccessAlertClose = () => {
    setEditSuccessAlert(false);
  };

  const onChangeProfilePic = async () => {
    const file = fileInput.current.files[0];
    if (file) {
      const fileName = fileInput.current.files[0].name;
      const fileExt = "." + fileName.split(".").pop();
      /* uuidv4 creates universally unique identifiers */
      let newFileName =
        user?.username + "_profile_pic_" + fileName + "_" + uuidv4();

      try {
        setShowLoadingSpinner(true);
        const response = await UploadToCloud(file, newFileName, fileExt);
        console.log("uplaod response: " + response);

        if (response.status === true) {
          const userUpdateData = {
            username: user?.username,
            // When changed to AWS Lambda for uploadToCloud, the img location is now at response?.data?.Location,  earlier at response?.data?.location
            profile_pic_url: response?.data?.Location,
          };

          const res = await editUserProfile(userUpdateData);
          if (res.responseType === "success") {
            setLoggedUser({ ...res.serverResponse });
          }
          setUser({
            ...user,
             // When changed to AWS Lambda for uploadToCloud, the img location is now at response?.data?.Location,  earlier at response?.data?.location
            ["profile_pic_url"]: String(response?.data?.Location),
          });
          // setProfilePictureUrl(response?.data?.location);
          
        }
      } catch (err) {
        console.log("Upload Failed" + err);
        alert("Image Couldn't be Uploaded, pleaase check your Internet correnction");
      }
      setShowLoadingSpinner(false);
    }
  };



  return (
    <div className={classes.outerDiv}>
      <Grid container>
        {alertOpen === true ? (
          <AlertDialog
            alertTitle={"Are you sure you want to Delete your User Profile?"}
            alertBody={
              "You won't be able to recover your account once deleted and will have to create a new account. \nPlease Confirm?"
            }
            open={alertOpen}
            handleClose={handleCloseAlert}
            actionOnPositive={deleteAccount}
          />
        ) : (
          <></>
        )}
      </Grid>
      <Grid container>
        <Paper className={classes.paper}>
          <Grid container spacing={2} className={classes.centeredGrid}>
            <Grid item xs={12} className={classes.centeredGrid}>
              <Avatar
                alt={user?.first_name}
                aria-label="profile picture"
                className={classes.avatar}
                src={user?.profile_pic_url}
              >
                {user?.profile_pic_url ? null : user?.first_name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs={12}>
              {showLoadingSpinner === true ? <CircularProgress /> : <></>}
            </Grid>
            <Grid item xs={12} className={classes.centeredGrid}>
              <Button
                className={classes.profile_Button_Styling}
                color="primary"
                aria-label="Select Image to Upload"
                variant="contained"
                component="label"
              >
                Change Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInput}
                  hidden
                  onChange={onChangeProfilePic}
                />
              </Button>
              <Button
                className={classes.profile_Button_Styling}
                color="primary"
                aria-label="Edit Profile"
                variant="contained"
                onClick={handleOpenModal}
              >
                Change User Details
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.userDetailsGrid}>
              <CssBaseline />
              <h3>First Name: {user?.first_name}</h3>
              <h3>Last Name: {user?.last_name}</h3>
              <h3>Username: {user?.username}</h3>
              <h3>Email: {user?.email}</h3>
              <h3>
                Date Joined: {new Date(user?.date_joined).toLocaleDateString()}
              </h3>
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.delete_Button_Styling}
                onClick={handleDeleteClick}
                color="primary"
                aria-label="Delete Account"
                variant="contained"
              >
                Delete Account
              </Button>
            </Grid>
            {openModal && (
              <EditProfileModal
                open={openModal}
                handleClose={handleCloseModal}
                openEditSuccessAlert={setEditSuccessAlertOpen}
              />
            )}
            <Grid
              item
              xs={4}
              style={{ justifyContent: "center", allignItems: "center" }}
            >
              {editSuccessAlert && (
                <CustomAlert
                  alertText="Profile Edited Successfully!"
                  alertOpen={editSuccessAlert}
                  setAlertClose={setEditSuccessAlertClose}
                  severityRating="success"
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
};

export default Profile;



/* References: 
 Material UI Demos for Ref: 
 Grids: https://material-ui.com/components/grid/   
 Alert Component (used in CustomAlert): https://material-ui.com/components/alert/
 Progress Component (to indicate uploading picture) : https://material-ui.com/components/progress/
 Paper Component: https://material-ui.com/components/paper/
 Modal: https://material-ui.com/components/modal/
 Dialog (used to confirm delete account) : https://material-ui.com/components/dialogs/ 
*/
