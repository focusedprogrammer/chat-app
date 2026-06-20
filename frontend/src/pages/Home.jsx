import { useEffect, useState } from "react";
import FriendsList from "../components/FriendsList";
import ChatBox from "../components/chatBox";
import API from "../services/api";

function Home() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [friend, setFriend] = useState(null);
  const [refreshFriends, setRefreshFriends] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchRequests();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");

      console.log("USER API =>", res.data); //debug

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get("/follow/requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const searchUsers = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      const res = await API.get(`/auth/users?search=${value}`);

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendRequest = async (id) => {
    try {
      const res = await API.post("/follow/send", {
        receiverId: id,
      });

      alert(res.data.message);
    } catch (err) {
      alert(err?.response?.data?.message || "Request Failed");
    }
  };

  const acceptRequest = async (id) => {
    try {
      const res = await API.post("/follow/accept", {
        requestId: id,
      });

      alert(res.data.message);

      fetchRequests();

      setRefreshFriends((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="container-fluid px-0 bg-light vh-100 d-flex flex-column">
      {/* Navbar */}

      <nav
        className="navbar navbar-dark bg-primary"
        style={{
          width: "100%",
          padding: "12px 20px",
        }}
      >
        <h3 className="text-white m-0">Chat Application</h3>

        <div
          style={{ cursor: "pointer" }}
          onClick={() => setShow(!show)}
          className="position-relative"
        >
          <span className="text-white">{user?.name}</span>

          {show && (
            <div
              className="card position-absolute p-3 shadow"
              style={{
                right: 0,
                top: "40px",
                width: "250px",
                zIndex: 1000,
              }}
            >
              <h6>{user?.name}</h6>

              <p className="mb-2">{user?.email}</p>

              <button className="btn btn-danger btn-sm" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div
        className="row flex-grow-1 overflow-hidden g-0"
        style={{
          margin: 0,
        }}
      >
        {/* LEFT PANEL */}

        <div
          className="col-md-4 border-end d-flex flex-column"
          style={{
            background: "#fff",
            height: "calc(100vh - 60px)",
          }}
        >
          {/* Search Users */}

          <div className="card shadow-sm mt-3">
            <div className="card-header">Search Users</div>

            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search user..."
                value={search}
                onChange={(e) => searchUsers(e.target.value)}
              />

              {users.map((u) => (
                <div
                  key={u.id}
                  className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                >
                  <div>
                    <strong>{u.name}</strong>

                    <div>@{u.username}</div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => sendRequest(u.id)}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requests */}

          <div className="card shadow-sm mt-3">
            <div className="card-header">Friend Requests</div>

            <div className="card-body">
              {requests.length === 0 && <p>No Requests</p>}

              {requests.map((r) => (
                <div
                  key={r.id}
                  className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                >
                  <div>
                    <strong>{r.name}</strong>

                    <div>@{r.username}</div>
                  </div>

                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => acceptRequest(r.id)}
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Friends */}

          <div className="card shadow-sm mt-3 mb-3 flex-grow-1">
            <div className="card-header">Friends</div>

            <div
              className="card-body p-0"
              style={{
                overflowY: "auto",
                maxHeight: "100%",
              }}
            >
              <FriendsList
                onSelectFriend={setFriend}
                refresh={refreshFriends}
              />
            </div>
          </div>
        </div>

        {/* CHAT AREA */}

        <div
          className="col-md-8 d-flex flex-column p-0"
          style={{
            background: "#ece5dd",
            height: "calc(100vh - 60px)",
            overflow: "hidden",
          }}
        >
          <div className="flex-grow-1">
            <ChatBox friend={friend} currentUser={user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
