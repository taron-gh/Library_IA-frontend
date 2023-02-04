import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [appState, setAppState] = useState('login'); //login, register, user, admin
  const [user, setUser] = useState({
    userType: 'user', //adminl, user
    email: '',
    password: ''
  });

  return (
    <div className='App'>
      <div className="login-container">
        <h1>Sign In</h1>
        <label>Email</label>
        <input type='email' placeholder='Your email'></input>
        <label>Password</label>
        <input type='password' placeholder='Password'></input>
        <button>Sign In</button>
        <p></p>
      </div>
      <div className='register-container'>
        <h1>Register</h1>
        <label>Email</label>
        <input type='email' placeholder='Your email'></input>
        <label>Password</label>
        <input type='password' placeholder='Password'></input>
        <button>Register</button>
        <p></p>
      </div>
      <div className='user-container'>
        <h1>Your Library Portal</h1>
        <div className='user-books-columns'>
          <div className='user-my-books'>
          
          </div>

          <div className='user-available-books'>

          </div>
        </div>
      </div>
    </div>

  );
}


function AvailableBook({name, count, addHandler}){
  return (
    <div onClick={(e) => {addHandler(e, name, count)}}>
      <p>{name}</p>
      <p>Left: {count} books</p>
    </div>
  );
}

function UsersBook({name, count, removeHandler}){
  return (
    <div onClick={(e) => {removeHandler(e, name, count)}}>
      <p>{name}</p>
      <p>Click to remove</p>
    </div>
  );
}

function AdminBook({name, count, removeHandler}){
  return (
    <div onClick={(e) => {removeHandler(e, name, count)}}>
      <p>{name}</p>
      <p>Click to remove</p>
    </div>
  );
}
export default App;
