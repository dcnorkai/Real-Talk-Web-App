import React, {useState} from "react";
import "./App.css";
import Axios from "axios";

function App(){
  return(
    <div className="container">
      <div className="loginForm">
        <form>
          <h4>Login</h4>
          <label htmlFor="username">Username</label>
          <input className="textInput" type="text" name="username" placeholder="Enter your Username" required />
          <label htmlFor="password">Password</label>
          <input className="textInput" type="password" name="password" placeholder="Enter your Username" required />
          <input className="button" type="submit" value="Login" />
        </form>
      </div>

    </div>
  );
}

export default App;