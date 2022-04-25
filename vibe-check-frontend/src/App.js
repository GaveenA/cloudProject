import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React, { useState, useMemo, useEffect} from "react";
import { UserContext} from './context/AppContext';
import SignUp from "../src/components/signup";
import SignIn from "../src/components/signin";
import Profile from "../src/components/profile";
import Forum from "../src/components/forum"
import "./App.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./components/home";
import Friends from "./components/friends";
import {getUserFromDb, getLoggedUser, setLoggedUser} from "./components/newRepository"

function App() {
  const [user, setUser] = useState(getLoggedUser());

  useEffect(() => {
    /* 
    This function gets the user object for currently logged user from local storage (cache)
    We then get the most updated version of this user from the database - using username 
    (This is to ensure any changes made on the Admin end are reflected immediately)
    If we recieve a success response from the database we know that the user has not been deleted.
    Then, using the most up-to-date user object we also determine if the user has been blocked, 
    and if not we add the user to state (and also update the local cache with the most up-to-date user
      object )
    */
    const getUserDB = async () => {
      const loggedUser = getLoggedUser();
      if(loggedUser){
        const getUserDB_res = await getUserFromDb(loggedUser.username);
        console.log(getUserDB_res);
        if(getUserDB_res.responseType == "success"){
          const loggedUserFromDB = getUserDB_res.serverResponse;
          if(loggedUserFromDB.blocked == false){
            setUser(loggedUserFromDB)
            setLoggedUser(loggedUserFromDB);  
          }
          else {
            setUser(null);
            // redirect to sign in page as user account has been blocked
          }
        }
        else{
          setUser(null);
          // redirect to main page as profile no longer exists
        }
      }
    }
    getUserDB();
    
  }, [])

  
  
  /* useMemo helps improve performance by only returning the value if any of the
  mentioned dependencies change */
  const provider = useMemo(()=> ({user, setUser}), [user, setUser])

  return (
    <UserContext.Provider value={provider}>
      <Router>
        <div className="App">
          <NavBar/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={SignIn}/>
            <Route path="/profile" component={Profile} />
            <Route path="/forum" component={Forum}/> 
            <Route path="/friends" component={Friends}/> 
          </Switch>
          <Footer/>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;



/* References: 
  The VibeCheck Full stack application was not completly developed during Cloud Computing Assignment 1 time frame. 

  The inception of this VibeCheck Application was during Further Web Programming COSC2758, a class that I Hewa Annakkage Gaveen Amarapala (s3766914) undertook in
  Semester 2 - 2021. During this (FWP) course I developed the VibeCheck fullstack application as part of course requirements, 
  and when  I undertook Cloud Computing in Semester 1 2022 i thoght it was the perfect oppertunity for me to deploy my VibeCheck Application to the cloud, 
  as I am very passionate about this Application, which I consider to be one of my biggest wins as a Software Enginner, and a project I'm very proud of. 


 React:
    useMemo: https://reactjs.org/docs/hooks-reference.html
    React Router: https://reactrouter.com/
*/
