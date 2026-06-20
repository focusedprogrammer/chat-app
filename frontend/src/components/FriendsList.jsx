import { useEffect, useState } from "react";
import API from "../services/api";
import { FaSearch } from "react-icons/fa";

function FriendsList({ onSelectFriend }) {

  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    try {

      const res = await API.get(
        "/follow/friends"
      );

      console.log(
        "Friends Data",
        res.data
      );

      setFriends(res.data);

    } catch (err) {

      console.log(
        "Friends Error",
        err
      );

    }
  };

  const filteredFriends =
    friends.filter(friend =>
      friend.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <>
      <div className="p-3 border-bottom">

        <h5 className="fw-bold">
          Friends
        </h5>

        <div className="input-group mt-3">

          <span className="input-group-text">
            <FaSearch />
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="Search Friend"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      <div
        className="list-group list-group-flush"
        style={{
          maxHeight: "500px",
          overflowY: "auto"
        }}
      >

        {
          filteredFriends.length === 0 &&
          (
            <div className="p-3 text-muted">
              No Friends Found
            </div>
          )
        }

        {
          filteredFriends.map(
            (friend) => (

              <button
                key={friend.id}
                className="list-group-item list-group-item-action d-flex align-items-center"
                onClick={() =>
                  onSelectFriend(
                    friend
                  )
                }
              >

                <div
                  className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: "40px",
                    height: "40px"
                  }}
                >
                  {
                    friend.name
                    ?.charAt(0)
                  }
                </div>

                <div>

                  <strong>
                    {friend.name}
                  </strong>

                  <div
                    className="text-muted small"
                  >
                    @{
                      friend.username
                    }
                  </div>

                </div>

              </button>

            )
          )
        }

      </div>
    </>
  );
}

export default FriendsList;