import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [details, setDetails] = useState(null);
  const [id, setId] = useState(0);
  const [count, setCount] = useState(0);
  const [val, setVal] = useState(false);
  let data = {};

  useEffect(() => {
    axios
      .get("http://localhost:3030/posts")
      .then((response) => {
        setDetails(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  function validate() {
    if (title.trim() === "" || body.trim() === "") {
      alert("Please Fill all the fields");
      setVal(false);
    } else {
      data = {
        title,
        body,
      };
      setVal(true);
    }
    console.log(title);
  }
  function updateDetails(ele) {
    setTitle(ele.title);
    setBody(ele.body);
    setId(ele.id);
    setCount(1);
  }
  function deleteDetails(id) {
    setId(id);
    axios
      .delete(`http://localhost:3030/posts/${id}`)
      .then((response) => {
        return axios
          .get("http://localhost:3030/posts")
          .then((response) => {
            return setDetails(response.data);
          })
          .catch((error) => error.message);
      })
      .catch((error) => error.message);
  }

  function handleForm(event) {
    event.preventDefault();
    if (count === 0) {
      validate();
      if (data.title) {
        axios
          .post("http://localhost:3030/posts", data)
          .then((response) => {
            return axios
              .get("http://localhost:3030/posts")
              .then((response) => {
                return setDetails(response.data);
              })
              .catch((error) => error.message);
          })
          .catch((error) => error.message);
        data = {};
        setTitle("");
        setBody("");
      }
    } else {
      validate();
      if (data.title) {
        axios
          .put(`http://localhost:3030/posts/${id}`, data)
          .then((response) => {
            return axios
              .get("http://localhost:3030/posts")
              .then((response) => {
                return setDetails(response.data);
              })
              .catch((error) => error.message);
          })
          .catch((error) => error.message);
        setTitle("");
        setBody("");
        data = {};
        setCount(0);
      }
    }
  }

  return (
    <>
      <div className="app">
        <form onSubmit={handleForm}>
          <label>Title : </label>
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <br />
          <label>Body : </label>
          <textarea
            type="text"
            placeholder="Enter Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
          <br />
          <br />
          <button>{count === 0 ? "Add" : "Update"}</button>
        </form>

        {details &&
          details.map((ele) => {
            return (
              <div key={ele.id}>
                <p>{ele.title}</p>
                <p>{ele.body}</p>
                <button onClick={() => updateDetails(ele)}>Edit</button>
                <button onClick={() => deleteDetails(ele.id)}>Delete</button>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default App;
