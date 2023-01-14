import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import { UserContext } from "../context/AppContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 720,
    textAlign: "left",
    padding: theme.spacing(0.7, 0, 0.7),
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

export default function CreatePost({ setCurrentMode, setModalOpen }) {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  return (
    <Card
      className={classes.root}
      /* currentMode state keeps track of whether post modal should open in editPost mode or createPost mode. 
      postToEdit stores details of post to be edited */
      onClick={() => {
        setCurrentMode((prevState) => ({
          ...prevState,
          editingPost: false,
          postToEdit: null,
        }));
        setModalOpen();
      }}
    >
      <CardHeader
        titleTypographyProps={{ variant: "h6" }}
        avatar={
          <Avatar
            alt={user?.first_name}
            aria-label="profile"
            className={user?.profile_pic_url ? null : classes.avatar}
            src={user?.profile_pic_url}
          >
            {user?.profile_pic_url ? null : user?.first_name?.charAt(0)}
          </Avatar>
        }
        title={"What's on you mind, " + user?.first_name + "?"}
      />
      <CardContent>
        <TextFieldsIcon />
        <InsertPhotoIcon style={{ marginLeft: "3%" }} />
      </CardContent>
    </Card>
  );
}

/* References:
 Material UI Demos for Ref:
 Card Component: https://material-ui.com/components/cards/
*/
