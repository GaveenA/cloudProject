import React, { useState, useMemo, useEffect, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import { hexToRgb, makeStyles } from "@material-ui/core/styles";
import PopupErrorDialog from "../utilities/popupErrorDialog";
import Post from "./post";
import PostModal from "./postModal";
import CreatePost from "./createPost";
import { EditPostContext } from "../context/AppContext";
import { colourPalette } from "../utilities/colorPalette";
import { getAllPostsInDb } from "./newRepository";
import { UserContext } from "../context/AppContext";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(10),
    background: hexToRgb(colourPalette.primary1),
    minHeight: "97vh",
  },
  post: {
    margin: theme.spacing(4),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  grid_container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function Forum() {
  const { user } = useContext(UserContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [deletePostFailAlert, setDeletePostFailAlert] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

  /* currentMode state keeps track of whether post modal should open in editPost mode or createPost mode. 
    postToEdit stores details of post to be edited */
  const [currentMode, setCurrentMode] = useState({
    editingPost: false,
    postToEdit: null,
    posts: null,
  });

  useEffect(() => {
    /* set state to true to show loading spinner until
       backend returns data */
    setShowLoadingSpinner(true);
    getAllPostsInDb(user).then((res) => {
      if (res.responseType === "success") {
        setCurrentMode((prevState) => ({
          ...prevState,
          posts: res.serverResponse,
        }));
        /* set state to false to hide loading spinner after data is returned */
        setShowLoadingSpinner(false);
      }
    });
  }, [user]);
  /* set state to open post modal */
  const setModalOpen = () => {
    setOpen(true);
  };
  /* set state to close post modal */
  const setModalClose = () => {
    setOpen(false);
  };
  /* useMemo helps improve performance by only returning the value if any of the
    mentioned dependencies change */
  const provider = useMemo(
    () => ({ currentMode, setCurrentMode }),
    [currentMode, setCurrentMode]
  );

  return (
    /* Make EditPostContext available */
    <EditPostContext.Provider value={provider}>
      <div className={classes.root}>
        {open === true ? (
          <PostModal
            editingPost={currentMode?.editingPost}
            modalOpen={open}
            post={currentMode?.postToEdit}
            setModalClose={setModalClose}
          />
        ) : (
          <></>
        )}
        <Grid container>
          <Grid item className={classes.post} xs={12}>
            <CreatePost
              setCurrentMode={setCurrentMode}
              setModalOpen={setModalOpen}
            />
          </Grid>
          {/* The posts array is reversed to show most recent posts at the top of
                    the forum. The function .slice() returns a copy of the array, which is 
                    then reversed */}
          {showLoadingSpinner && (
            <Grid item className={classes.grid_container} xs={12}>
              <CircularProgress />
            </Grid>
          )}
          {currentMode.posts
            ?.slice(0)
            ?.reverse()
            ?.map((post) => (
              <Grid item className={classes.post} xs={12}>
                <Post
                  /* Keys help React identify which items have changed, are added, 
                                or are removed. */
                  key={post.id + post.image_url + post.content_body}
                  postData={post}
                  setModalOpen={setModalOpen}
                  setDeletePostFailAlert={setDeletePostFailAlert}
                  deletePostFailAlert={deletePostFailAlert}
                />
              </Grid>
            ))}
          {currentMode?.posts?.length === 0 ? (
            <Grid item className={classes.grid_container} xs={12}>
              <h2 style={{ color: "white" }}>No Posts to Display</h2>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        {/* if the post could not be deleted, show the error dialog */}
        {deletePostFailAlert === true ? (
          <PopupErrorDialog
            alertTitle={"Error: Could Not Delete Post"}
            alertBody={"Unfortunately the post could not be deleted"}
            open={deletePostFailAlert}
            handleClose={setDeletePostFailAlert}
          />
        ) : (
          <></>
        )}
      </div>
    </EditPostContext.Provider>
  );
}

export default Forum;

/* References: 
 Material UI Demos for Ref: 
    Card Component (used in Post): https://material-ui.com/components/cards/\
    Grids: https://material-ui.com/components/grid/   
    Modal (used in postModal): https://material-ui.com/components/modal/
 React:
    Key Props: https://reactjs.org/docs/lists-and-keys.html
    useMemo: https://reactjs.org/docs/hooks-reference.html
*/
