import FriendsList from "../components/FriendsList";
import ChatBox from "../components/ChatBox";

function Messenger() {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        <div className="col-md-4 border-end">
          <FriendsList />
        </div>

        <div className="col-md-8 p-0">
          <ChatBox />
        </div>

      </div>
    </div>
  );
}

export default Messenger;