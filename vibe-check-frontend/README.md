# Cloud Computing Project - Assignment 1 
# By: Hewa Gaveen Amarapala - s3766914


# Directions to Start Applicaion: 
1. Change directory to vibe-check-frontend (run command - cd vibe-check-frontend)
2. Run npm install
3. Run npm start
4. Ensure '.env' file is available in the 'vibe-check-frontend' directory - 
        This is essential to support the uplaod Image functionality as discussed below

# Important - Please Note: 
# This applicaiton does Image uplaod to Amazon S3, - Please ensure required '.env' file is available when running applcation
All images including in User Avatar and images posted by users are uploaded and fetched from Amazon S3
Please make sure the required env file contains the required Access Keys and Access ID's are available for Image Upload to work
This 'env' file has not been comitted it Git, but has been included in the zip folder uploaded to Cavas.




# Available Functionality
1. Sign Up - Allow user to sign up, email must be unique. 
2. Login - Allow user to sign in with credentials 
3. Forum - Allow Signed in users to make posts and view post made by other users 
4. Posts - The forum page allows user to create new posts and edit their own posts: 
    4.1 - Create a post 
          To Create a new post, opne the forum page and select on the card saying 'Whats on your mind' 
          This will open the Create post Modal
          You can make a post with just a text Body or also include an Image with your post
          You may also upload just a Picture if you wish, however a post may not be empty (Body or Image needed)
    
    4.2 - Delete a post: 
          To Delete a post, open the forum page, identify a post made by you (the logged in user)
          This post, made by yourself, will have a 'options' button on the top right of the post (denoted by 3 dots )
          The Options button is only visible on posts made by the logged in user
          Click this button and select the 'Delete Post' option
   
    4.3 - Edit a Post
          To Edit a post, open the forum page, identify a post made by you (the logged in user)
          This post, made by yourself, will have a 'options' button on the top right of the post (denoted by 3 dots )
          The Options button is only visible on posts made by the logged in user
          Click this button and select the 'Edit Post' option
          This will open the Edit post Modal
          This will open a Modal similar to the create post modal, but already pre-filled with the content of the post to be edited
          Make the changes needed (Change post body or image) and click 'Update'
          Note the same restrictions on Empty posts still apply, read 4.1

5. Comments - Logged in Users can comment on their Own Posts or on Posts by other users (on the Forum Page)

6. Profile - Allow the logged in user to modify thier User Profile Details (Click the Profile button on the Nav bar)
    5.1 - Change Profile Picture - Allows user to change the image displayed on their Avatar 
                                   Any change to users Avatar will be applied globally to all of their previous posts and comments
    5.2 - Change User Details - On Click Opens a Modal allowing user to change their profile Details
                                User can ONLY change First Name, Last Name and Password. - Email is immutable
    5.3 - Delete Account - On Click opens a Dialog asking the user to confirm that they want to delete their account
                           If the user Confirms by clicking 'Yes' the account is deleted and the user is logged out directed to Home page
                           When the Account is deleted - All the users Posts and Comments are deleted
    


References are detailed in the bottom of all files based on usage in the file

All References Used (Summation): 

https://material-ui.com/getting-started/templates/
https://formik.org/docs/guides/validation
https://formik.org/docs/examples/with-material-ui
https://material-ui.com/components/modal/
https://material-ui.com/components/cards/
https://material-ui.com/components/app-bar/
https://material-ui.com/components/lists/ - 
https://material-ui.com/components/alert/
https://material-ui.com/components/dialogs/
https://material-ui.com/components/menus/#simple-menu
https://material-ui.com/components/progress/
https://medium.com/@steven_creates/uploading-files-to-s3-using-react-js-hooks-react-aws-s3-c4c0684f38b3


Unsplash Images Used:

https://unsplash.com/photos/zdSoe8za6Hs
https://unsplash.com/photos/Sj0iMtq_Z4w
https://unsplash.com/photos/96DW4Pow3qI
https://unsplash.com/photos/Cecb0_8Hx-o










# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
