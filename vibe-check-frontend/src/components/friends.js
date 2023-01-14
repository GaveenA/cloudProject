import * as React from "react";
import { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, hexToRgb } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { colourPalette } from "../utilities/colorPalette";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {
  getUserFollowing,
  getUserFollowers,
  getUsersToFollow,
} from "./newRepository";
import { UserContext } from "../context/AppContext";
import { red } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { followUser, unfollowUser, removeFollower } from "./newRepository";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(10),
    background: hexToRgb(colourPalette.primary1),
    minHeight: "97vh",
    color: "white",
  },
  outerBox: {
    width: "100%",
    typography: "h1",
  },
  innerBox: {
    borderBottom: 4,
    borderColor: "white",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  tabPanel: {
    width: "100%",
  },
  grid_container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  grid_item: {
    width: "100%",
  },
  avatar: {
    backgroundColor: red[500],
  },
  friendGrid: {
    margin: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  friendCard: {
    width: "100%",
    maxWidth: 600,
    textAlign: "left",
    padding: theme.spacing(0.7, 0, 0.7),
  },
  friendAction: {
    margin: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    textTransform: "none",
    "&:hover": {
      color: hexToRgb(colourPalette.accent1),
      backgroundColor: "white",
    },
  },
}));

function FriendCard({ user, handleClick, mode }) {
  const classes = useStyles();
  return (
    <Card className={classes.friendCard}>
      <CardHeader
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
        /* render relavant buttons based on mode state */
        /* mode = 0 => Render button to unfollow current following user*/
        /* mode = 1 => Render button to remove follwer*/
        /* mode = 2 => Render button to follow user*/
        action={
          mode === 0 ? (
            <Button
              className={classes.friendAction}
              variant="contained"
              color="secondary"
              onClick={handleClick}
            >
              Unfollow
            </Button>
          ) : mode === 1 ? (
            <Button
              className={classes.friendAction}
              variant="contained"
              color="secondary"
              onClick={handleClick}
            >
              Remove
            </Button>
          ) : mode === 2 ? (
            <Button
              className={classes.friendAction}
              variant="contained"
              color="primary"
              onClick={handleClick}
            >
              Follow
            </Button>
          ) : (
            <> </>
          )
        }
        title={user?.first_name + " " + user?.last_name}
        subheader={user?.username}
      />
    </Card>
  );
}

export default function Friends() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [following, setFollowing] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  const [toFollow, setToFollow] = React.useState([]);
  const { user } = useContext(UserContext);

  /* fetch data for following/followers and to follow */
  useEffect(() => {
    const getAll = async () => {
      await setFollowing(await getFollowing(user?.username));
      await setFollowers(await getFollowers(user?.username));
      await setToFollow(await getToFollow(user?.username));
    };
    getAll();
  }, []);

  const getFollowing = async (username) => {
    const followingServerRes = await getUserFollowing(username);
    if (followingServerRes.responseType === "success") {
      return followingServerRes?.serverResponse;
    } else {
      return [];
    }
  };

  const getFollowers = async (username) => {
    const followersServerRes = await getUserFollowers(username);
    if (followersServerRes.responseType === "success") {
      return followersServerRes?.serverResponse;
    } else {
      return [];
    }
  };

  const getToFollow = async (username) => {
    const toFollowServerRes = await getUsersToFollow(username);
    if (toFollowServerRes.responseType === "success") {
      return toFollowServerRes?.serverResponse;
    } else {
      return [];
    }
  };

  const handleUnfolllowClick = async (loggedUsername, unfollowUsername) => {
    const unfollow = await unfollowUser(loggedUsername, unfollowUsername);
    if (unfollow.responseType === "success") {
      /* update relavant state after successful database update */
      await setFollowing(await getFollowing(user?.username));
    }
  };

  const handleRemoveFollowerClick = async (
    loggedUsername,
    followerUsername
  ) => {
    const remove = await removeFollower(loggedUsername, followerUsername);
    if (remove.responseType === "success") {
      /* update relavant state after successful database update */
      await setFollowers(await getFollowers(user?.username));
    }
  };

  const handleFollowClick = async (loggedUsername, followUsername) => {
    const follow = await followUser(loggedUsername, followUsername);
    if (follow.responseType === "success") {
      /* update relavant state after successful database update */
      await setToFollow(await getToFollow(user?.username));
    }
  };
  /* when you switch between the 3 tabs, newValue represents
     the tab you are switching into */
  /* newValue = 0 => following tab */
  /* newValue = 1 => follwers tab */
  /* newValue = 0 => suggested to follow tab */
  const handleChange = async (event, newValue) => {
    if (newValue === 0) {
      const userFollowing = await getFollowing(user?.username);
      setFollowing(userFollowing);
      setValue(newValue);
    }
    if (newValue === 1) {
      const userFollowers = await getFollowers(user?.username);
      setFollowers(userFollowers);
      setValue(newValue);
    }
    if (newValue === 2) {
      const usersToFollow = await getToFollow(user?.username);

      setToFollow(usersToFollow);
      setValue(newValue);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.grid_container}>
        <Grid item className={classes.grid_item}>
          <Box className={classes.outerBox}>
            <Box className={classes.innerBox}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Following" {...a11yProps(0)} />
                <Tab label="Followers" {...a11yProps(1)} />
                <Tab label="Suggested" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0} className={classes.tabPanel}>
              {following.length !== 0 ? (
                following?.map((following_user) => (
                  <Grid
                    key={following_user?.username}
                    item
                    className={classes.friendGrid}
                    xs={12}
                  >
                    <FriendCard
                      /* Keys help React identify which items have changed, are added, 
                                        or are removed. */
                      user={following_user}
                      mode={0}
                      handleClick={() => {
                        handleUnfolllowClick(
                          user?.username,
                          following_user?.username
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item className={classes.friendGrid} xs={12}>
                  <h3> No Following </h3>
                </Grid>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {followers.length !== 0 ? (
                followers?.map((follower_user) => (
                  <Grid
                    key={follower_user?.username}
                    item
                    className={classes.friendGrid}
                    xs={12}
                  >
                    <FriendCard
                      /* Keys help React identify which items have changed, are added, 
                                      or are removed. */
                      user={follower_user}
                      mode={1}
                      handleClick={() => {
                        handleRemoveFollowerClick(
                          user?.username,
                          follower_user?.username
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item className={classes.friendGrid} xs={12}>
                  <h3> No Followers</h3>
                </Grid>
              )}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {toFollow.length !== 0 ? (
                toFollow?.map((toFollow_user) => (
                  <Grid
                    key={toFollow_user?.username}
                    item
                    className={classes.friendGrid}
                    xs={12}
                  >
                    <FriendCard
                      /* Keys help React identify which items have changed, are added, 
                                      or are removed. */
                      user={toFollow_user}
                      mode={2}
                      handleClick={() => {
                        handleFollowClick(
                          user?.username,
                          toFollow_user?.username
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item className={classes.friendGrid} xs={12}>
                  <h3> No Suggested Users to Follow</h3>
                </Grid>
              )}
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

/* References: 
 Material UI Demos for Ref: 
    Card Component (used in Friend Card): https://material-ui.com/components/cards/\
    Grids: https://material-ui.com/components/grid/   
    Tabs: https://material-ui.com/components/tabs
 React:
    Key Props: https://reactjs.org/docs/lists-and-keys.html
    useMemo: https://reactjs.org/docs/hooks-reference.html
*/
