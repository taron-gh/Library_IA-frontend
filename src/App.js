import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const address = "http://localhost:8000"
function App() {
  const [appState, setAppState] = useState('login'); //login, register, user, admin
  const [user, setUser] = useState({
    userType: 'user', //adminl, user
    email: '',
    password: ''
  });

  const [loginDisplayState, setLoginDisplayState] = useState("display-flex");
  const [registerDisplayState, setRegisterDisplayState] = useState("display-none");
  const [userDisplayState, setUserDisplayState] = useState("display-none");
  const [adminDisplayState, setAdminDisplayState] = useState("display-none");

  //login label
  const [loginLabel, setLoginLabel] = useState("");
  //controlled inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");



  /* ---------------API---------------- */

  //admin requests
  function adminAuthenticate(email, password) {
    fetch(address + `/admin/authenticate/${email}/${password}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.isAdmin) {
          setLoginDisplayState("display-none");
          setAdminDisplayState("display-flex");
        }
      });
  }
  function adminAddBook(email, password) {
    let isCanceled = false;
    const bookName = prompt("Enter the name of the book: ");
    // console.log(bookName);
    let bookCount = NaN;
    if (bookName != "" && bookName != null) {
      let pr = prompt("Enter the amount of books: ");
      bookCount = parseInt(pr);
      console.log(pr);
      if (isNaN(bookCount) && pr != null) {
        alert("Please enter a valid number!")
        isCanceled = true;
      }
      if(pr == null){
        isCanceled = true;
      }
    }else if(bookName != null){
      alert("Please enter a valid name!")
      isCanceled = true;
    }else if(bookName == null){
      isCanceled = true;

    }
    console.log(isCanceled);
    if (!isCanceled) {
      fetch(address + `/admin/addBook/${email}/${password}/${bookName}/${bookCount}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.isAdmin) {
            setLoginDisplayState("display-none");
            setAdminDisplayState("display-flex");
          }
        });
    }

  }
  //user requests
  function userAuthenticate(email, password) {
    fetch(address + `user/authenticate/${email}/${password}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.isUser) {
          setLoginDisplayState("display-none");
          setUserDisplayState("display-flex");
        }
      });
  }

  return (
    <div className='App'>
      <div className={loginDisplayState + " login-container"}>
        <h1>Sign In</h1>
        <label>Email</label>
        <input type='email' placeholder='Your email' value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value) }}></input>
        <label>Password</label>
        <input type='password' placeholder='Password' value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value) }}></input>
        <button onClick={() => {
          adminAuthenticate(loginEmail, loginPassword)
          userAuthenticate(loginEmail, loginPassword)
        }}>Sign in</button>
        <button onClick={() => {
          setRegisterDisplayState("display-flex");
          setLoginDisplayState("display-none")
        }}>Register</button>
        <p className='login-label'>{loginLabel}</p>
      </div>

      <div className={registerDisplayState + " register-container"}>
        <h1>Register</h1>
        <label>Email</label>
        <input type='email' placeholder='Your email' value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value) }}></input>
        <label>Password</label>
        <input type='password' placeholder='Password' value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value) }}></input>
        <button>Register</button>
        <p className='login-label'>{loginLabel}</p>
      </div>
      <div className={userDisplayState + " user-container"}>
        <h1>Your Library Portal</h1>
        <div className='user-books-column-container'>
          <div className='user-book-column'>
            <h3>Your Books</h3>
            <UsersBook name="AAAA"></UsersBook>
          </div>

          <div className={adminDisplayState + " user-book-column"}>
            <h3>Available Books</h3>

            <AvailableBook name="AAAA" count={10} addHandler={() => { console.log("aaa"); }}></AvailableBook>

          </div>
        </div>
      </div>
      <div className={adminDisplayState + " admin-container"}>
        <h1>Library Admin Portal</h1>
        <div className='admin-books'>
          <h3>Books in the library</h3>

          <button className='add-book-button' onClick={() => { adminAddBook(loginEmail, loginPassword) }}>Add book</button>

          <AdminBook name="AAAA" count={10}></AdminBook>
        </div>
      </div>
    </div>

  );
}


function AvailableBook({ name, count, addHandler }) {
  return (
    <div className="book" onClick={(e) => { addHandler(e, name, count) }}>
      <p>{name} (Click to Add)</p>
      <p>Left: {count} books</p>
    </div>
  );
}

function UsersBook({ name, removeHandler }) {
  return (
    <div className="book" onClick={(e) => { removeHandler(e, name) }}>
      <p>{name}</p>
      <p>Click to remove</p>
    </div>
  );
}

function AdminBook({ name, count, removeHandler }) {
  return (
    <div className="book" onClick={(e) => { removeHandler(e, name, count) }}>
      <p>{name}</p>
      <p>Available amount: {count}</p>
      <p>Click to remove</p>
    </div>
  );
}


export default App;



