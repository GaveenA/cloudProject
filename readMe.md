# Cloud Project - Assignment 1
# By: Hewa Gaveen Amarapala - s3766914




# Important - Please Note: 
# The Vibe Check Application (end user application) does Image uplaod to Amazon S3, - Please ensure required '.env' file is available when running applcation - This is a hidden file in the 'vibe-check-frontend' directory (visible on VS code)

All images including in User Avatar and images posted by users are uploaded and fetched from Amazon S3
Please make sure the required env file containg required Access Keys and Access ID's are available for Image Upload to work

If using a AWS academy lab session, ensure to copy in the Access ID, Access Key and Session Token, as its essential for s3 to work. 

This 'env' file has not been comitted it Git, but has been included in the zip folder uploaded to Cavas.
The '.env' file shoud be present in the 'vibe-check-frontend' directory as a Hidden File



# The Vibecheck Application require conneciton to MySQL database.  - Please ensure required config.js file is available when running backend of VibeCheck applcation and Admin Dashboard application (running either locally or on EC2)

The config files for conneting to the Database on project backend folder have not been uploaded to GIT for privacy, but have been submitted in final submission to Canvas , please ensure config files are present in project backends for VibeCheck applicaiton to function correctly. 





# Directions to Start VibeCheck Application:

AWS Cli and EB cli must be installed - check Cloud computng - Tutorial 1 

File requirements
The AWS './credientials' file must contain the Access ID, Access Key and Session Token (session token should be used if using AWS academy lab session)
The AWS './config' file must contain the Region data
These files can be located on mac at ~/.aws  
   -  Access by going to Finder > Go To Folder (toolbar) > ~/.aws 

The .env file in vibe-check-frontend must contain the Access ID, Acess Key and Session token values

To start VibeCheck Application Backend on  EC2
1. ssh into the Ec2, using the PEM file and the elastic IP Address
    - Command is: 
    - ssh -i (PEM file directory, drag and drop into mac terminal and it autofulls - no enclosing brakets)  ubuntu@ELASTIC_IP_ADDRESS
2. Change directory to vibe-check-backend (run command - cd vibe-check-backend)
3. Run npm install
4. Run npm start or node server.js
5. Ensure config.js file is available in the 'vibe-check-backend/src/database/config.js' directory 
    - This is essential to connect to MySQL database
    - The config file must contain the corect RDS database details


        
To start VibeCheck Application Frontend on Elastic Beanstalk
1. Change directory to vibe-check-frontend (run command - cd vibe-check-frontend)
2. Run npm install
3. Run npm start
4. Ensure '.env' file is available in the 'vibe-check-frontend' directory - and contains the most up to date Access ID, Access Key and Session Token
        This is essential to support the uplaod Image functionality as discussed below
5. Ensure you are in vibe-check-frontend directory and execute following command to upload to beanstalk and start
 - eb create -ip LabInstanceProfile --service-role LabRole
 - When prompted, leave the 'Environment name' and 'DNS CNAME prefix' as defaults, and the load balencer type as 2 -(application) and Spot Fleet requests as No 
        





# Available Functionality

# VibeCheck Application Functionality (end user application)
1. Sign Up - Allow user to sign up, username and email must be unique - All details saved in database 
2. Login - Allow user to sign in with credentials - All details fetched and verified from database 
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
                                User can ONLY change First Name, Last Name, Email and Password. - Username is immutable
    5.3 - Delete Account - On Click opens a Dialog asking the user to confirm that they want to delete their account
                           If the user Confirms by clicking 'Yes' the account is deleted and the user is logged out directed to Home page
                           When the Account is deleted - All the users Posts and Comments are deleted

7. User Interactions on Content (Both Posts and Comments):
        7.1 - The Application allows users to Like / Dislike Posts and Comments
        7.2 - All user interactions on Content are stored on the database 
        
8. User Friendships
        8.1 - The New 'Friends' Tab on the Navbar (presented to Logged in users) allow users to maintain friendships with other users 
        8.2 - Following - The Following Tab on the Friends Page shows all the Users the Logged in User is currently following with the option to unfolow these users 
        8.3 - Followers -  The Followers Tab on the Friends Page shows all the Users that are following the Logged in User ie. the Logged users Followers - There is also an option for the Logged user to remove these followers
        8.4 - Suggested - The Suggested Tab shows the Users the Logged user is NOT currently following, with the Option to Follow them
        This Layout for the Friends page has been Inspired by Instagram (from Facebook)
        


# References 
The VibeCheck Full stack application was not completly developed during Cloud Computing Assignment 1 time frame. 

The inception of this VibeCheck Application was during Further Web Programming COSC2758, a class that I Hewa Annakkage Gaveen Amarapala (s3766914) undertook in
Semester 2 - 2021. During this (FWP) course I developed the VibeCheck fullstack application as part of course requirements, and when  I undertook Cloud Computing in Semester 1 2022 i thoght it was the perfect oppertunity for me to deploy my VibeCheck Application to the cloud, as I am very passionate about this Application, which I consider to be one of my biggest wins as a Software Enginner, and a project I'm very proud of. 

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


https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates 
https://www.npmjs.com/package/react-chartjs-2
https://material-ui.com/components/tabs
Pagination - Further web programming Lecture 9
Bootstrap Liblary

Further Web Programming Lecture Materials - Weeks  9 / 10
Further Web Programming Lab Materials / Solutions - Weeks  8, 9, 10


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
