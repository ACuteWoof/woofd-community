import Peer from "peerjs";

import Button from "@mui/material/Button";

function CallScreen() {
  return (
    <>
      <PeerManager />
      <CreateCallButton>
        <Button variant="contained">Create Call</Button>
      </CreateCallButton>
    </>
  );
}

function PeerManager() {
  const peer = new Peer({
    config: {
      iceServers: [
        { url: "stun:stun.l.google.com:19302" },
        {
          url: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    },
  });
  return <></>;
}

function CreateCallButton(props) {
  const { children } = props;
  return <span>{children}</span>;
}

export { CallScreen, CreateCallButton, PeerManager };
