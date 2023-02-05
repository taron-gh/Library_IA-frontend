import './App.css';
import { useState } from 'react';

const address = "http://localhost:8000"
function App() {

  //page states
  const [loginDisplayState, setLoginDisplayState] = useState("display-flex");
  const [registerDisplayState, setRegisterDisplayState] = useState("display-none");
  const [userDisplayState, setUserDisplayState] = useState("display-none");
  const [adminDisplayState, setAdminDisplayState] = useState("display-none");

  //login label
  const [loginLabel, setLoginLabel] = useState("");
  //controlled inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  //user page
  const [userBooks, setUserBooks] = useState([]);

  //all pages
  const [availableBooks, setAvailableBooks] = useState([]);
  /* ---------------API---------------- */

  //general requests
  function authenticate(email, password) {
    fetch(address + `/admin/authenticate/${email}/${password}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.isAdmin) {
          setLoginDisplayState("display-none");
          setAdminDisplayState("display-flex");
          getAvailableBooks(loginEmail, loginPassword);
        } else {
          return fetch(address + `/user/authenticate/${email}/${password}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.isUser) {
                setLoginDisplayState("display-none");
                setUserDisplayState("display-flex");
                refreshBookLists();
              } else {
                setLoginLabel("No such user! Try again.");
              }
            });
        }

      });
  }
  function refreshBookLists() {
    getUserBooks(loginEmail, loginPassword);
    getAvailableBooks(loginEmail, loginPassword);
  }

  //admin requests
  function adminAddBook(email, password) {
    let isCanceled = false;
    const bookName = prompt("Enter the name of the book: ");
    let bookCount = NaN;
    if (bookName !== "" && bookName != null) {
      let pr = prompt("Enter the amount of books: ");
      bookCount = parseInt(pr);
      if (isNaN(bookCount) && pr != null) {
        alert("Please enter a valid number!")
        isCanceled = true;
      }
      if (pr == null) {
        isCanceled = true;
      }
    } else if (bookName != null) {
      alert("Please enter a valid name!")
      isCanceled = true;
    } else if (bookName == null) {
      isCanceled = true;

    }
    if (!isCanceled) {
      fetch(address + `/admin/addBook/${email}/${password}/${bookName}/${bookCount}`)
      .then(() => {
      getAvailableBooks(loginEmail, loginPassword);

      })

      // .then((response) => {
      //   console.log(response);
      //   return response.json()
      // })
      // .then((data) => {
      //   console.log(data)

      // });
    }
  }
  function removeAdminBook(email, password, bookName) {
    fetch(address + `/admin/removeBook/${email}/${password}/${bookName}`)
    .then(() => {
      getAvailableBooks(loginEmail, loginPassword);

    })
    // .then((data) => {
    //   if (data.isReturned) {
    //     alert(`${bookName} is succesfully returned!`)
    //     refreshBookLists();
    //   } else {
    //     alert(`Error! ${bookName} is not returned.`)
    //   }
    // });
  }

  //user requests
  function registerUser(email, password) {
    fetch(address + `/user/register/${email}/${password}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.registered) {
          setRegisterDisplayState("display-none");
          setLoginDisplayState("display-flex");
          setLoginLabel("Congratulations, you are registered! Sign in to access your account.");
        } else {
          setLoginLabel("No such user! Try again.");
        }
      });
  }
  function addUserBook(email, password, bookName) {
    fetch(address + `/user/addBook/${email}/${password}/${bookName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.isAdded) {
          alert(`${bookName} is succesfully added to your books!`)
          refreshBookLists();
        } else {
          alert(`${bookName} is not available.`)
        }

      });
  }
  function getUserBooks(email, password) {
    fetch(address + `/user/getMyBooks/${email}/${password}`)
      .then((response) => response.json())
      .then((data) => {
        setUserBooks(data);
      });
  }
  function returnUserBook(email, password, bookName) {
    fetch(address + `/user/returnBook/${email}/${password}/${bookName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.isReturned) {
          alert(`${bookName} is succesfully returned!`)
          refreshBookLists();
        } else {
          alert(`Error! ${bookName} is not returned.`)
        }
      });
  }
  function getAvailableBooks(email, password) {
    fetch(address + `/getBooks/${email}/${password}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.accessDenied) {
          console.log(data);
          setAvailableBooks(data)
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
          authenticate(loginEmail, loginPassword)
          // userAuthenticate(loginEmail, loginPassword)
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
        <button onClick={() => {
          registerUser(loginEmail, loginPassword)
        }}>Register</button>
        <p className='login-label'>{loginLabel}</p>
      </div>
      <div className={userDisplayState + " user-container"}>
        <h1>Your Library Portal</h1>
        <div className='user-books-column-container'>
          <div className='user-book-column'>
            <h3>Your Books</h3>
            {
              userBooks.map((elem, i) => {
                return <UsersBook key={i} name={elem} removeHandler={(bookName) => {
                  returnUserBook(loginEmail, loginPassword, bookName)
                }}></UsersBook>
              })
            }
            {userBooks.length === 0 ? "You have no books under your name." : ""}
          </div>
          <div className={"user-book-column"}>
            <h3>Available Books</h3>
            {
              availableBooks.map((elem, i) => {
                return <AvailableBook key={i} name={elem.name} count={elem.count} addHandler={(bookName) => {
                  addUserBook(loginEmail, loginPassword, bookName)
                }}></AvailableBook>
              })

            }
          </div>
        </div>
      </div>
      <div className={adminDisplayState + " admin-container"}>
        <h1>Library Admin Portal</h1>
        {/* <button onClick={() => {
          getAvailableBooks(loginEmail, loginPassword);

        }}>TEST</button> */}
        <div className='admin-books'>
          <h3>Books in the library</h3>
          <button className='add-book-button' onClick={() => { adminAddBook(loginEmail, loginPassword) }}>Add book</button>
          {
            availableBooks.map((elem, i) => {
              return <AdminBook key={i} name={elem.name} count={elem.count} removeHandler={(bookName) => {
                if(prompt(`Are you sure that you want to remove ${bookName} from your library? Type YES to confirm.`) === "YES"){
                  removeAdminBook(loginEmail, loginPassword, bookName)

                }
              }}></AdminBook>
            })
          }
          {availableBooks.length === 0 ? <p>There are no books in the library.</p> : ""}
        </div>
      </div>
    </div>

  );
}


function AvailableBook({ name, count, addHandler }) {
  return (
    <div className="book" onClick={(e) => { addHandler(name) }}>
      <p>{name} (Click to Add)</p>
      <p>Left: {count} books</p>
    </div>
  );
}

function UsersBook({ name, removeHandler }) {
  return (
    <div className="book" onClick={(e) => { removeHandler(name) }}>
      <p>{name}</p>
      <p>Click to return</p>
    </div>
  );
}

function AdminBook({ name, count, removeHandler }) {
  return (
    <div className="book" onClick={(e) => { removeHandler(name) }}>
      <p>{name}</p>
      <p>Available amount: {count}</p>
      <p>Click to remove</p>
    </div>
  );
}


export default App;



