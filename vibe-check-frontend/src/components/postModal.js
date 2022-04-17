import React, { useState, useContext, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { UserContext } from "../context/AppContext";
import { v4 as uuidv4 } from "uuid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { UploadToCloud } from "../utilities/uploadToCloud";
import { EditPostContext } from "../context/AppContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import CustomAlert from "../utilities/customAlert";
import { addPostToDb, updatePostInDb, getAllPostsInDb } from "./newRepository";
import { trimFieldsAndSanitize} from "../utilities/utils";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  modalContentContainer: {
    outline: "none",
  },
  division: {
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  postRoot: {
    maxWidth: "100%",
    padding: theme.spacing(2, 3, 2),
    outline: "none",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9 aspect ratio
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function PostModal({
  editingPost,
  post,
  modalOpen,
  setModalClose,
}) {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(post?.image_url || null);
  const [imageChanged, setImageChanged] = useState(false);

  const [body, setBody] = useState(post?.content_body || null);
  const fileInput = useRef();
  /* currentMode state keeps track of whether post modal should open in editPost mode or createPost mode. 
      postToEdit stores details of post to be edited */
  const { currentMode, setCurrentMode } = useContext(EditPostContext);
  const [alert, setAlert] = useState(false);
  const [postModalErrorMessage, setPostModalErrorMessage] = useState("")

  let time;
  if (post != null) {
    time = new Date(post?.date).toLocaleString();
  } else {
    time = new Date().toLocaleString();
  }

  /* Setting Alerts for Comments */
  const setAlertOpen = () => {
    setAlert(true);
  };

  const setAlertClose = () => {
    setAlert(false);
  };
  /* handle close of post modal */
  const handleClose = () => {
    if (editingPost === true) {
      setCurrentMode((prevState) => ({
        ...prevState,
        editingPost: false,
        postToEdit: null,
      }));
    }
    setBody("");
    setPreviewUrl("");
    setModalClose();
  };

  const handleTextChange = (e) => {
    if(e.target.value.length < 601){
      setAlertClose();
      setBody(e.target.value);
    }
    else{
      setPostModalErrorMessage("Post body cannot exceed 600 characters")
      setAlertOpen();
    }
  };

  const handleSubmit = async () => {
    let postObj;

    if (editingPost) {
      postObj = {
        id: post?.id,
        username: user.username,
        // date: new Date().toLocaleDateString(),
        date: new Date(),
        image_url: previewUrl,
        content_body: body,
        deleted_by_admin: false,
      };
    } else {
      postObj = {
        /* uuidv4 creates universally unique identifiers */
        username: user.username,
        // date: new Date().toLocaleDateString(),
        date: new Date(),
        image_url: previewUrl,
        content_body: body,
        deleted_by_admin: false,
      };
    }
    /* trim and sanitise user inputs of create/edit post */
    postObj = trimFieldsAndSanitize(postObj)
    console.log("trimmed post", postObj);
    const file = fileInput.current.files[0];
    if (file && imageChanged) {
      const fileName = fileInput.current.files[0].name;
      const fileExt = "." + fileName.split(".").pop();
      let newFileName = user?.username + "_post_" + fileName + "_" + uuidv4();
      try {
        setShowLoadingSpinner(true);
        const response = await UploadToCloud(file, newFileName, fileExt);
        console.log("uplaod response: " + response);
        console.log(response);

        if (response.status === true) {
          postObj.image_url = response?.data?.Location;
        }
      } catch (err) {
        console.log("Upload Failed" + err);
      }
      setShowLoadingSpinner(false);
    }

    /* Post is Valid if Post Body is not Empty or if Post Image is not 
            null - if condition fails, error is shown */
    if (
      (postObj?.content_body && postObj?.content_body?.length !== 0) ||
      postObj?.image_url
    ) {
      setAlertClose();
      if (editingPost === true) {
        await updatePostInDb(postObj).then(async (res) => {
          if (res.responseType === "success") {
            const postsCopySliced = currentMode.posts.slice();
            const indexV2 = postsCopySliced.findIndex(
              (selectedPost) => selectedPost.id === post?.id
            );
            if (indexV2 > -1) {
              postsCopySliced[indexV2] = {
                ...res.serverResponse[0]
              };
              setCurrentMode({
                ...currentMode,
                posts: [...postsCopySliced]
              });
            }
            console.log(currentMode);
          } else {
            console.log(res);
          }
        });
      } else {
        await addPostToDb(postObj).then(async (res) => {
          if (res.responseType === "success") {
            setCurrentMode((prevState) => ({
              ...prevState,
              posts: [...prevState.posts, res.serverResponse[0]],
            }));
          } else {
            console.log(res);
          }
        });
      }
      handleClose();
    } else {
        setPostModalErrorMessage("Post must contain Text Body or Image")
        setAlertOpen();
    }
  };

  const onChangePicture = () => {
    const file = fileInput.current.files[0];
    if (file) {
      setImageChanged(true);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreviewUrl(reader.result);
      });
      reader.readAsDataURL(file);
    }
  };

  const postContent = (
    <Container
      component="main"
      maxWidth="sm"
      className={classes.modalContentContainer}
    >
      <CssBaseline />
      <Card className={classes.postRoot}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {user?.first_name?.charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={user?.first_name + " " + user?.last_name}
          subheader={time}
        />
        {previewUrl && (
          <CardMedia
            className={classes.media}
            image={previewUrl}
            title="Image"
          />
        )}
        <CardContent>
          <TextField
            id="outlined-multiline-static"
            label="Body"
            multiline
            fullWidth
            rows={7}
            value={body}
            onChange={handleTextChange}
            hintText="Enter the post text"
            variant="outlined"
          />
        </CardContent>
        <CustomAlert
          alertText={postModalErrorMessage}
          alertOpen={alert}
          setAlertClose={setAlertClose}
        />
        <CardActions disableSpacing>
          <IconButton
            color="primary"
            aria-label="Select Image to Upload"
            variant="contained"
            component="label"
          >
            <InsertPhotoIcon fontSize="large" />
            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              hidden
              onChange={onChangePicture}
            />
          </IconButton>
        </CardActions>
        <Grid container>
          <Grid item xs={10}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              {editingPost === true ? "Update" : "Post"}
            </Button>
          </Grid>
          <Grid item xs={2}>
            {showLoadingSpinner && <CircularProgress />}
          </Grid>
        </Grid>
      </Card>
    </Container>
  );

  return (
    <div className={classes.division}>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {postContent}
      </Modal>
    </div>
  );
}

/* References:
 Material UI Demos for Ref:
 Card Component: https://material-ui.com/components/cards/\
 Grids: https://material-ui.com/components/grid/
 Container: https://material-ui.com/components/container/
 Alert Component (used in CustomAlert): https://material-ui.com/components/alert/
 Modal: https://material-ui.com/components/modal/
 Progress Component (to indicate uploading picture) : https://material-ui.com/components/progress/
*/
