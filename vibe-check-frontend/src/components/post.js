import React, { useState, useContext, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CommentIcon from "@material-ui/icons/Comment";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SendIcon from "@material-ui/icons/Send";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { UserContext } from "../context/AppContext";
import CustomAlert from "../utilities/customAlert";
import { EditPostContext } from "../context/AppContext";
import {
  deletePost,
  addPostToDb,
  addInteractionToContent,
  deleteInteractionToContent,
  updateInteractionToContent,
} from "./newRepository";
import { trimFieldsAndSanitize } from "../utilities/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 720,
    textAlign: "left",
    padding: theme.spacing(0.7, 0, 0.7),
  },
  media: {
    height: 0,
    paddingTop: "56.25%" /* 16:9 aspect ratio */,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  commentButton: {
    marginLeft: "auto",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },

  commentRoot: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 180,
  },
  inline: {
    display: "inline",
  },
  centerItems: {
    display: "flex",
    justifyContent: "center",
    allignItems: "center",
  },
}));

export default function Post({
  postData,
  setModalOpen,
  setDeletePostFailAlert,
  deletePostFailAlert,
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [commentEmptyAlert, setCommentEmptyAlert] = useState(false);
  const [post, setPost] = useState(postData);
  const { user } = useContext(UserContext);
  const [commentErrorMessage, setcommentErrorMessage] = useState("");
  const { currentMode, setCurrentMode } = useContext(EditPostContext);

  /* Expand Comments section (when Comment Icon clicked)*/
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // handles comment input change.
  const handleTextChange = (e) => {
    // ensures that the user is only able to type upto 600 characters for comment
    if (e.target.value.length < 601) {
      setCommentEmptyAlert(false);
      setCommentBody(e.target.value);
    } else {
      setcommentErrorMessage("Comment cannot exceed 600 characters");
      setCommentEmptyAlert(true);
    }
  };

  /* Configure scroll for comments section */
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block:
        "nearest" /* Keeps current post in view and only scrolls comments section */,
      inline: "nearest",
    });
  };
  /* auto scroll to bottom of comments when click on comments icon */
  useEffect(() => {
    if (expanded === true) {
      scrollToBottom();
    }
  }, [expanded]);

  /* Set 'More Options' menu into view - contains Edit and Delete Options */
  const [anchorMoreOptions, setAnchorMoreOptions] = useState(null);

  const handleMoreOptionsClick = (event) => {
    setAnchorMoreOptions(event.currentTarget);
  };

  const handleMoreOptionsClose = () => {
    setAnchorMoreOptions(null);
  };

  /* Handle Edit Post Modal*/
  const handleOpenPostEditModal = () => {
    /* currentMode state keeps track of whether post modal should open in editPost mode or createPost mode. 
    postToEdit stores details of post to be edited */
    setCurrentMode((prevState) => ({
      ...prevState,
      editingPost: true,
      postToEdit: post,
    }));
    handleMoreOptionsClose();
    setModalOpen();
  };

  /* Handle Delete Post*/
  const handleDeletePost = async () => {
    const prevPosts = currentMode.posts;
    const updatedPosts = currentMode.posts.filter(
      (postItem) => postItem.id !== post.id
    );
    setCurrentMode((prevState) => ({ ...prevState, posts: updatedPosts }));
    const res = await deletePost(post.id);
    if (res.responseType !== "success") {
      setCurrentMode((prevState) => ({ ...prevState, posts: prevPosts }));
      setDeletePostFailAlert(true);
    }
    handleMoreOptionsClose();
  };

  /* Handle New Comment Submit */
  const handleCommentSubmit = async () => {
    //create content from new repository
    let comment = {
      parent_id: post?.id,
      username: user.username,
      date: new Date(),
      content_body: commentBody,
      image_url: null,
      deleted_by_admin: false,
    };
    comment = trimFieldsAndSanitize(comment);
    if (commentBody?.length !== 0) {
      await addPostToDb(comment).then(async (res) => {
        if (res.responseType === "success") {
          const newComment = res.serverResponse[0];

          setPost((prevState) => ({
            ...prevState,
            comments: [...prevState.comments, newComment],
          }));
        }
      });
      setCommentBody("");
      scrollToBottom();
      setCommentEmptyAlert(false);
    } else {
      setcommentErrorMessage("Comment cannot be empty");
      setCommentEmptyAlert(true);
    }
  };

  const handlePostInteraction = async (interactionValue) => {
    // if the post has been already liked/disliked, remove record
    const prevCurrUserInteraction = post.currUserInteraction;
    const prevLikeCount = post.likes_count;
    const prevDislikeCount = post.dislikes_count;
    if (post.currUserInteraction === interactionValue) {
      if (interactionValue === 1) {
        setPost((prevState) => ({
          ...prevState,
          currUserInteraction: null,
          likes_count: prevLikeCount - 1,
        }));
      } else if (interactionValue === 0) {
        setPost((prevState) => ({
          ...prevState,
          currUserInteraction: null,
          dislikes_count: prevDislikeCount - 1,
        }));
      }
      await deleteInteractionToContent(post?.id, user?.username).then(
        async (res) => {
          if (res.responseType === "success") {
          } else {
            if (interactionValue === 1) {
              setPost((prevState) => ({
                ...prevState,
                currUserInteraction: prevCurrUserInteraction,
                likes_count: prevLikeCount + 1,
              }));
            } else if (interactionValue === 0) {
              setPost((prevState) => ({
                ...prevState,
                currUserInteraction: prevCurrUserInteraction,
                dislikes_count: prevDislikeCount + 1,
              }));
            }
          }
        }
      );
      // update interaction
    } else if (
      post.currUserInteraction !== interactionValue &&
      post.currUserInteraction !== null
    ) {
      if (interactionValue === 1) {
        setPost((prevState) => ({
          ...prevState,
          currUserInteraction: interactionValue,
          likes_count: prevLikeCount + 1,
          dislikes_count: prevDislikeCount - 1,
        }));
      } else if (interactionValue === 0) {
        setPost((prevState) => ({
          ...prevState,
          currUserInteraction: interactionValue,
          likes_count: prevLikeCount - 1,
          dislikes_count: prevDislikeCount + 1,
        }));
      }
      await updateInteractionToContent(
        post?.id,
        user?.username,
        interactionValue
      ).then(async (res) => {
        if (res.responseType === "success") {
        } else {
          if (interactionValue === 1) {
            setPost((prevState) => ({
              ...prevState,
              currUserInteraction: prevCurrUserInteraction,
              likes_count: prevLikeCount - 1,
              dislikes_count: prevDislikeCount + 1,
            }));
          } else if (interactionValue === 0) {
            setPost((prevState) => ({
              ...prevState,
              currUserInteraction: prevCurrUserInteraction,
              likes_count: prevLikeCount + 1,
              dislikes_count: prevDislikeCount - 1,
            }));
          }
        }
      });
      // create interaction
    } else if (post.currUserInteraction === null) {
      if (interactionValue === 1) {
        setPost((prevState) => ({
          ...prevState,
          currUserInteraction: interactionValue,
          likes_count: prevLikeCount + 1,
        }));
      } else if (interactionValue === 0) {
        setPost((prevState) => ({
          ...prevState,
          currUserInteraction: interactionValue,
          dislikes_count: prevDislikeCount + 1,
        }));
      }
      await addInteractionToContent(
        post?.id,
        user?.username,
        interactionValue
      ).then(async (res) => {
        if (res.responseType === "success") {
        } else {
          if (interactionValue === 1) {
            setPost((prevState) => ({
              ...prevState,
              currUserInteraction: prevCurrUserInteraction,
              likes_count: prevLikeCount - 1,
            }));
          } else if (interactionValue === 0) {
            setPost((prevState) => ({
              ...prevState,
              currUserInteraction: prevCurrUserInteraction,
              dislikes_count: prevDislikeCount - 1,
            }));
          }
        }
      });
    }
  };

  const handleCommentInteraction = async (id, interactionValue) => {
    // if the post has been already liked/disliked, remove record
    const index = post.comments.findIndex((comment) => comment.id === id);
    const prevCurrUserInteraction = post.comments[index].currUserInteraction;
    const prevLikeCount = post.comments[index].likes_count;
    const prevDislikeCount = post.comments[index].dislikes_count;
    if (index !== -1) {
      if (post.comments[index].currUserInteraction === interactionValue) {
        const updatedComments = [...post.comments];
        updatedComments[index].currUserInteraction = null;
        if (interactionValue === 1) {
          updatedComments[index].likes_count = prevLikeCount - 1;
        } else if (interactionValue === 0) {
          updatedComments[index].dislikes_count = prevDislikeCount - 1;
        }
        setPost((prevState) => ({
          ...prevState,
          comments: updatedComments,
        }));
        await deleteInteractionToContent(id, user?.username).then(
          async (res) => {
            if (res.responseType === "success") {
            } else {
              const updatedComments = [...post.comments];
              updatedComments[index].currUserInteraction =
                prevCurrUserInteraction;
              if (interactionValue === 1) {
                updatedComments[index].likes_count = prevLikeCount + 1;
              } else if (interactionValue === 0) {
                updatedComments[index].dislikes_count = prevDislikeCount + 1;
              }
              setPost({ ...post, comments: updatedComments });
            }
          }
        );
        // update interaction
      } else if (
        post.comments[index].currUserInteraction !== interactionValue &&
        post.comments[index].currUserInteraction !== null
      ) {
        const updatedComments = [...post.comments];
        updatedComments[index].currUserInteraction = interactionValue;
        if (interactionValue === 1) {
          updatedComments[index].likes_count = prevLikeCount + 1;
          updatedComments[index].dislikes_count = prevDislikeCount - 1;
        } else if (interactionValue === 0) {
          updatedComments[index].likes_count = prevLikeCount - 1;
          updatedComments[index].dislikes_count = prevDislikeCount + 1;
        }
        setPost({ ...post, comments: updatedComments });
        await updateInteractionToContent(
          id,
          user?.username,
          interactionValue
        ).then(async (res) => {
          if (res.responseType === "success") {
          } else {
            const updatedComments = [post.comments];
            updatedComments[index].currUserInteraction =
              prevCurrUserInteraction;
            if (interactionValue === 1) {
              updatedComments[index].likes_count = prevLikeCount - 1;
              updatedComments[index].dislikes_count = prevDislikeCount + 1;
            } else if (interactionValue === 0) {
              updatedComments[index].likes_count = prevLikeCount + 1;
              updatedComments[index].dislikes_count = prevDislikeCount - 1;
            }
            setPost({ ...post, comments: updatedComments });
          }
        });
        // create interaction
      } else if (post.comments[index].currUserInteraction === null) {
        const updatedComments = [...post.comments];
        updatedComments[index].currUserInteraction = interactionValue;
        if (interactionValue === 1) {
          updatedComments[index].likes_count = prevLikeCount + 1;
        } else if (interactionValue === 0) {
          updatedComments[index].dislikes_count = prevDislikeCount + 1;
        }
        setPost({ ...post, comments: updatedComments });
        await addInteractionToContent(
          id,
          user?.username,
          interactionValue
        ).then(async (res) => {
          if (res.responseType === "success") {
          } else {
            const updatedComments = [...post.comments];
            updatedComments[index].currUserInteraction =
              prevCurrUserInteraction;
            if (interactionValue === 1) {
              updatedComments[index].likes_count = prevLikeCount - 1;
            } else if (interactionValue === 0) {
              updatedComments[index].dislikes_count = prevDislikeCount - 1;
            }
            setPost({ ...post, comments: updatedComments });
          }
        });
      }
    }
  };

  if (post.deleted_by_admin) {
    return (
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar
              alt={post?.author?.first_name}
              aria-label="profile"
              className={post?.author?.profile_pic_url ? null : classes.avatar}
              src={post?.author?.profile_pic_url}
            >
              {post?.author?.profile_pic_url
                ? null
                : post?.author?.first_name?.charAt(0)}
            </Avatar>
          }
          title={post?.author?.first_name + " " + post?.author?.last_name}
          subheader={new Date(post?.date).toLocaleDateString()}
        />
        <CardContent className={classes.centerItems}>
          <Typography variant="subtitle1" color="textPrimary" component="p">
            [**** This post has been deleted by the admin ***]
          </Typography>
        </CardContent>
      </Card>
    );
  }

  /* Render Comments Section */
  const comment = (
    <List
      className={classes.commentRoot}
      style={{ "overflow-y": "scroll", "overflow-x": "hidden" }}
    >
      {post?.comments.length !== 0 ? (
        post?.comments?.map((comment) => (
          <div key={comment.content_body}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={comment?.author?.username}
                  aria-label="profile"
                  className={
                    comment?.author?.profile_pic_url ? null : classes.avatar
                  }
                  src={comment?.author?.profile_pic_url}
                >
                  {comment?.author?.profile_pic_url
                    ? null
                    : comment?.author?.first_name?.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  comment.author.first_name + " " + comment.author.last_name
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      style={{ wordWrap: "break-word" }}
                      paragraph
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {comment.content_body}
                    </Typography>
                  </React.Fragment>
                }
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IconButton
                  aria-label="like post"
                  onClick={() => {
                    handleCommentInteraction(comment.id, 1);
                  }}
                >
                  <ThumbUpIcon
                    color={`${
                      comment.currUserInteraction === 1 ? `primary` : ``
                    }`}
                  />
                </IconButton>
                <h5
                  style={{
                    textAlign: "center",
                    marginTop: "0px",
                  }}
                >
                  {comment.likes_count}
                </h5>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IconButton
                  aria-label="dislike post"
                  onClick={() => {
                    handleCommentInteraction(comment.id, 0);
                  }}
                >
                  <ThumbDownIcon
                    color={`${
                      comment.currUserInteraction === 0 ? `secondary` : ``
                    }`}
                  />
                  {}
                </IconButton>
                <h5
                  style={{
                    textAlign: "center",
                    marginTop: "0px",
                  }}
                >
                  {comment.dislikes_count}
                </h5>
              </div>
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))
      ) : (
        <ListItem style={{ display: "flex", justifyContent: "center" }}>
          <h3>No Comments</h3>
        </ListItem>
      )}
      <div ref={messagesEndRef} />
    </List>
  );

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            alt={post?.author?.first_name}
            aria-label="profile"
            className={post?.author?.profile_pic_url ? null : classes.avatar}
            src={post?.author?.profile_pic_url}
          >
            {post?.author?.profile_pic_url
              ? null
              : post?.author?.first_name?.charAt(0)}
          </Avatar>
        }
        action={
          user?.email === post?.author?.email && (
            <IconButton aria-label="settings" onClick={handleMoreOptionsClick}>
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={post?.author?.first_name + " " + post?.author?.last_name}
        subheader={new Date(post?.date).toLocaleDateString()}
      />

      {/* More Options Menu - Edit and Delete Post */}
      <Menu
        id="simple-menu"
        anchorEl={anchorMoreOptions}
        keepMounted
        open={Boolean(anchorMoreOptions)}
        onClose={handleMoreOptionsClose}
      >
        <MenuItem onClick={handleOpenPostEditModal}>Edit Post</MenuItem>
        <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
      </Menu>

      {/* Card Image */}
      {post?.image_url && (
        <CardMedia
          className={classes.media}
          image={post?.image_url}
          title="Paella dish"
        />
      )}

      {/* Card Text Body */}
      <CardContent>
        <Typography
          style={{ wordWrap: "break-word" }}
          paragraph
          component="span"
          variant="subtitle1"
          color="textPrimary"
        >
          {post?.content_body}
        </Typography>
      </CardContent>

      {/* Card Actions - Comments */}
      <CardActions
        disableSpacing
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <IconButton
              aria-label="like post"
              onClick={() => handlePostInteraction(1)}
            >
              <ThumbUpIcon
                color={`${post.currUserInteraction === 1 ? `primary` : ``}`}
              />
            </IconButton>
            <h5
              style={{
                textAlign: "center",
                marginTop: "0px",
              }}
            >
              {post.likes_count}
            </h5>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <IconButton
              aria-label="dislike post"
              onClick={() => handlePostInteraction(0)}
            >
              <ThumbDownIcon
                color={`${post.currUserInteraction === 0 ? `secondary` : ``}`}
              />
            </IconButton>
            <h5
              style={{
                textAlign: "center",
                marginTop: "0px",
              }}
            >
              {post.dislikes_count}
            </h5>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <IconButton
            className={classes.commentButton}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <CommentIcon color={`${expanded ? `primary` : ``}`} />
          </IconButton>
          <h5
            style={{
              textAlign: "center",
              marginTop: "0px",
            }}
          >
            {post.comments.length}
          </h5>
        </div>
      </CardActions>

      {/* Comments are rendered here and Section for Typing and adding new comments */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{comment}</CardContent>
        <CustomAlert
          alertText={commentErrorMessage}
          alertOpen={commentEmptyAlert}
          setAlertClose={() => setCommentEmptyAlert(false)}
        />
        <CardContent>
          <div className={classes.margin}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={2}>
                <Avatar
                  alt={user?.first_name}
                  aria-label="profile"
                  className={user?.profile_pic_url ? null : classes.avatar}
                  src={user?.profile_pic_url}
                  style={{ marginLeft: "15.5%" }}
                >
                  {user?.profile_pic_url ? null : user?.first_name?.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs={8} className={classes.centerItems}>
                <TextField
                  id="comemnt-with-avatar"
                  label="Comment"
                  multiline
                  maxRows={3}
                  fullWidth
                  value={commentBody}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={2} className={classes.centerItems}>
                <IconButton
                  onClick={() => {
                    handleCommentSubmit();
                  }}
                >
                  <SendIcon color="secondary" fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Collapse>
      {/* <CustomAlert
        alertText="Post could not be deleted"
        alertOpen={deletePostFailAlert}
        setAlertClose={() => setDeletePostFailAlert(false)}
      /> */}
    </Card>
  );
}

/* References: 
 Material UI Demos for Ref: 
 Card Component: https://material-ui.com/components/cards/\
 Grids: https://material-ui.com/components/grid/   
 Container: https://material-ui.com/components/container/
 Alert Component (used in CustomAlert): https://material-ui.com/components/alert/
 Menu Component (Used to Show Edit and Delete post options)  : https://material-ui.com/components/menus/#simple-menu
 List Component (used in Comments) : https://material-ui.com/components/lists/ 
*/
