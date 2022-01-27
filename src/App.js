import * as React from "react";
import woofverse from "./woofverse.png";
import wall from "./wall.svg";
import "./MarkdownStyles.css";

import { useState, useEffect, useRef } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import {
  setDoc,
  doc,
  updateDoc,
  getFirestore,
  deleteDoc,
  collection,
  serverTimestamp,
  limit,
  query,
  orderBy,
} from "firebase/firestore";
import {
  useCollectionData,
  useDocumentOnce,
  useDocumentData,
} from "react-firebase-hooks/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import LoadingButton from "@mui/lab/LoadingButton";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import GoogleIcon from "@mui/icons-material/Google";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import ReactMarkdown from "react-markdown";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#81a1c1",
    },
    secondary: {
      main: "#b48ead",
      contrastText: "#e5e9f0",
    },
    error: {
      main: "#bf616a",
      contrastText: "#e5e9f0",
    },
    success: {
      main: "#a3be8c",
    },
    warning: {
      main: "#d08770",
    },
    background: { default: "#2e3440", paper: "#3b4252" },
    text: {
      primary: "#d8dee9",
      secondary: "#e5e9f0",
    },
  },
});

const firebaseConfig = {
  apiKey: "AIzaSyAdBLSHq0nDFpJ0FkIyZKWDH46bJrTy61Y",
  authDomain: "woofverse-cirlce.firebaseapp.com",
  projectId: "woofverse-cirlce",
  storageBucket: "woofverse-cirlce.appspot.com",
  messagingSenderId: "664061003562",
  appId: "1:664061003562:web:5b6c422df605ee86e6c053",
  measurementId: "G-TYRZ214QW4",
};

const firebaseBackupConfig = {
  apiKey: "AIzaSyAFnVZqiUnQ76tDbGQZ31HeR8TdzzJNW-A",
  authDomain: "woofverse-backup.firebaseapp.com",
  projectId: "woofverse-backup",
  storageBucket: "woofverse-backup.appspot.com",
  messagingSenderId: "558762004854",
  appId: "1:558762004854:web:76ad9230d7c9ff3353aa57",
};

console.log(firebaseConfig);
console.log(firebaseBackupConfig);

initializeApp(firebaseConfig);
// initializeApp(firebaseBackupConfig);
const db = getFirestore();
const auth = getAuth();
const authProvider = new GoogleAuthProvider();

function App() {
  const [user, loading] = useAuthState(auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {user && (
        <>
          <UserInintializer />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/members" element={<Members />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:chatRoom" element={<Chat />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Router>
        </>
      )}
      {loading && <Loading />}
      {!user && !loading && <SignInScreen />}
    </ThemeProvider>
  );
}

function Loading() {
  return (
    <>
      <Grid
        spacing={3}
        direction="column"
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          textAlign: "center",
          margin: 0,
          height: "100vh",
          width: "100vw",
          backgroundImage: `url('${wall}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <CircularProgress color="success" />
        <Typography variant="h6" sx={{ my: 1 }}>
          Loading...
        </Typography>
      </Grid>
    </>
  );
}

function UserInintializer() {
  const [userDoc, loading, error] = useDocumentOnce(
    doc(db, "members", auth.currentUser.uid)
  );
  useEffect(() => {
    console.log("auth triggered");
    if (!userDoc && !loading) {
      if (auth.currentUser.uid === "ATLdbZiL1pSHx0PG3JAc9o6Zveq1") {
        setDoc(
          doc(db, "members", auth.currentUser.uid),
          {
            name: auth.currentUser.displayName,
            pfp: auth.currentUser.photoURL,
            role: "Admin",
          },
          { merge: true }
        );
      }
      setDoc(
        doc(db, "members", auth.currentUser.uid),
        {
          name: auth.currentUser.displayName,
          pfp: auth.currentUser.photoURL,
        },
        { merge: true }
      );
    }
    // eslint-disable-next-line
  }, [auth, userDoc, loading, error]);

  return <></>;
}

function Home() {
  return (
    <>
      <ResponsiveDrawer title="Home" content={<HomeContent />} />
    </>
  );
}

function HomeContent() {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("time", "desc"), limit(50));
  const [posts] = useCollectionData(q);

  useEffect(() => {
    console.log("posts", posts);
    // eslint-disable-next-line
  }, [posts]);

  return (
    <Container>
      <PostCreator />
      {posts &&
        posts.map((post) => (
          <ContentCard
            key={post.id}
            title={post.title}
            content={post.content}
            time={
              post.time &&
              post.time.toDate().toLocaleString(undefined, {
                hour: "numeric",
                minute: "numeric",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }
            id={post.id}
            authorId={post.authorId}
          />
        ))}
    </Container>
  );
}

function PostCreator() {
  const [enabled, setEnabled] = useState(false);
  const [buttonDisplay, setButtonDisplay] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userDoc] = useDocumentOnce(doc(db, "members", auth.currentUser.uid));
  const makePost = () => {
    const docRef = doc(collection(db, "posts"));
    setDoc(docRef, {
      title: title,
      content: content,
      authorName: userDoc.data().name,
      authorPfp: userDoc.data().pfp,
      time: serverTimestamp(),
      authorId: auth.currentUser.uid,
      id: docRef.id,
    });
    setEnabled(false);
    setButtonDisplay("");
    setTitle("");
    setContent("");
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        disableElevation
        sx={{ display: buttonDisplay, mb: 2 }}
        onClick={() => {
          setButtonDisplay("none");
          setEnabled(true);
        }}
      >
        New Post
      </Button>
      <Collapse in={enabled}>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Make a New Post
          </Typography>

          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <br />
          <TextField
            id="outlined-basic"
            label="Content"
            rows={6}
            variant="outlined"
            fullWidth
            multiline
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <br />

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              disableElevation
              onClick={() => {
                makePost();
              }}
            >
              Post
            </Button>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => {
                setButtonDisplay("");
                setEnabled(false);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>
      </Collapse>
    </>
  );
}

function ContentCard(props) {
  const { title, content, time, id, authorId } = props;
  const [showComments, setShowComments] = useState(false);
  const [commentButtonDisplay, setCommentButtonDisplay] = useState("");
  const [disableButtonDisplay, setDisableButtonDisplay] = useState("");
  const [userDoc] = useDocumentOnce(doc(db, "members", authorId));
  const [authorName, setAuthorName] = useState("");
  const [authorPfp, setAuthorPfp] = useState("");

  useEffect(() => {
    if (userDoc) {
      setAuthorName(userDoc.data().name);

      setAuthorPfp(userDoc.data().pfp);
    }
  }, [userDoc]);

  useEffect(() => {
    if (showComments) {
      setCommentButtonDisplay("none");
      setDisableButtonDisplay("");
    } else {
      setCommentButtonDisplay("");
      setDisableButtonDisplay("none");
    }
  }, [showComments]);

  return (
    <>
      <Card sx={{ my: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Box sx={{ mb: 5 }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              avatar={<Avatar alt="avatar" src={authorPfp} />}
              label={authorName}
              color="primary"
            />
            {time && <Chip label={time} color="primary" variant="outlined" />}
            <Button
              onClick={() => {
                setShowComments(true);
                setCommentButtonDisplay("none");
              }}
              sx={{ borderRadius: "16px", display: commentButtonDisplay }}
              variant="outlined"
              size="small"
              disableElevation
              startIcon={<ExpandMoreIcon />}
            >
              Show Comments
            </Button>
            <Button
              sx={{ borderRadius: "16px", display: disableButtonDisplay }}
              color="error"
              size="small"
              variant="outlined"
              disableElevation
              onClick={() => {
                setShowComments(false);
                setCommentButtonDisplay("");
              }}
              startIcon={<ExpandLessIcon />}
            >
              Hide Comments
            </Button>
          </Stack>
          <Collapse in={showComments}>
            <Box sx={{ my: 3 }}>
              <Comments id={id} />
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </>
  );
}

function Comments(props) {
  const { id } = props;
  console.log(id);
  const commentsRef = collection(db, "posts", id, "comments");
  const q = query(commentsRef, orderBy("time", "desc"));
  const [comments] = useCollectionData(q);

  useEffect(() => {
    console.log(commentsRef);
    console.log("comments", comments);
  }, [comments, commentsRef]);

  return (
    <Box sx={{ my: 3 }}>
      <Divider sx={{ mb: 3 }} />

      <CreateComment id={id} />
      {comments &&
        comments.map((comment) => (
          <Comment
            key={comment.id}
            content={comment.content}
            authorId={comment.authorId}
            time={
              comment.time &&
              comment.time.toDate().toLocaleString(undefined, {
                hour: "numeric",
                minute: "numeric",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }
            id={comment.id}
            postId={id}
          />
        ))}
    </Box>
  );
}

function CreateComment(props) {
  const { id } = props;
  const [content, setContent] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (content.length > 0) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [content]);

  const makeComment = (id) => {
    const commentRef = doc(collection(db, "posts", id, "comments"));
    const comment = {
      content,
      time: new Date(),
      authorId: auth.currentUser.uid,
      id: commentRef.id,
    };
    setDoc(commentRef, comment);
    setContent("");
  };

  return (
    <>
      <Box>
        <TextField
          id="input"
          label="Comment"
          rows={1}
          variant="outlined"
          fullWidth
          multiline
          size="small"
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <br />

        <Collapse in={enabled}>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              disableElevation
              onClick={() => {
                makeComment(id);
                document.getElementById("input").value = "";
              }}
            >
              Comment
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disableElevation
              onClick={() => {
                setEnabled(false);
                setContent("");
                document.getElementById("input").value = "";
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Collapse>
      </Box>
    </>
  );
}

function Comment(props) {
  const { content, authorId, time, postId, id } = props;
  const userId = authorId;
  const [userDoc] = useDocumentOnce(doc(db, "members", userId));
  const [authorName, setUserName] = useState("");
  const [authorPfp, setAvatar] = useState("");
  const [deleteButton, setDeleteButton] = useState("none");

  const deleteComment = () => {
    deleteDoc(doc(collection(db, "posts", postId, "comments"), id));
  };

  useEffect(() => {
    if (auth.currentUser.uid === authorId) {
      setDeleteButton("");
    }
  }, [authorId]);

  useEffect(() => {
    if (userDoc) {
      setUserName(userDoc.data().name);
      setAvatar(userDoc.data().pfp);
    }
  }, [userDoc]);

  return (
    <Paper sx={{ p: 3, my: 3 }} elevation={0}>
      <Box sx={{ mb: 2 }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>
      <Stack direction="row" spacing={1}>
        <Chip
          avatar={<Avatar alt="avatar" src={authorPfp} />}
          label={authorName}
          color="primary"
        />
        <Chip label={time} color="primary" variant="outlined" />
        <Button
          size="small"
          color="error"
          disableElevation
          variant="outlined"
          sx={{ borderRadius: "16px", display: deleteButton }}
          startIcon={<DeleteIcon />}
          onClick={deleteComment}
        >
          Delete Comment
        </Button>
      </Stack>
    </Paper>
  );
}

function Members() {
  return (
    <>
      <ResponsiveDrawer title="Members" content={<MembersContent />} />
    </>
  );
}

function MembersContent() {
  const membersRef = collection(db, "members");
  const q = query(membersRef, orderBy("name"));
  const [members] = useCollectionData(q);
  return (
    <Container>
      <Stack spacing={3}>
        {members &&
          members.map((member) => (
            <MemberCard
              key={member.id}
              name={member.name}
              pfp={member.pfp}
              role={member.role}
              desc={member.desc && member.desc}
            />
          ))}
      </Stack>
    </Container>
  );
}

function MemberCard(props) {
  let { name, pfp, role, desc } = props;
  const [color, setColor] = useState("primary");
  const [displayRole, setRole] = useState("Member");

  useEffect(() => {
    console.log("member card triggered");
    if (role === "Admin") {
      setRole("Admin");
      setColor("success");
    } else {
      // eslint-disable-next-line
      setRole("Member");
      setColor("primary");
    }
  }, [role]);
  return (
    <Card>
      <Box sx={{ p: 4, display: "flex" }}>
        <Stack spacing={2} direction="row">
          <Avatar src={pfp} sx={{ width: 69, height: 69 }} />
          <Stack sx={{ p: 0 }} spacing={1}>
            <Typography fontWeight={700}>{name}</Typography>

            <Typography variant="body2">{desc}</Typography>
            <Box>
              <Chip
                label={displayRole}
                variant="outlined"
                size="small"
                color={color}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}

function About() {
  return (
    <>
      <ResponsiveDrawer
        content={<p>I'll write about Woofverse when I feel like it</p>}
      />
    </>
  );
}

function Chat() {
  const { chatRoom } = useParams();
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" gutterBottom>
          Woofverse Chat
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button component={Link} href="/chat/main">
          <ListItemText>Kennel</ListItemText>
        </ListItem>
      </List>
    </div>
  );
  const title = "Kennel";
  return (
    <>
      <ResponsiveChatDrawer
        title={title}
        drawer={drawer}
        content={<ChatContent chatRoom={chatRoom} />}
      />
    </>
  );
}

let chatDrawerWidth = 240;

function ChatContent(props) {
  const { chatRoom } = props;
  const messagesRef = collection(db, "chat", chatRoom, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(50));
  const [messages] = useCollectionData(q);
  const dummy = useRef();

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <>
      <Container fixed sx={{ width: "100%", pb: "30px", m: 0 }}>
        <Stack direction="column" spacing={2}>
          {messages &&
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                userName={message.authorName}
                avatar={message.authorAvatar}
                displayTime={
                  message.createdAt &&
                  message.createdAt.toDate().toLocaleString(undefined, {
                    hour: "numeric",
                    minute: "numeric",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                }
                userId={message.authorId}
                id={message.id}
                chatRoom={chatRoom}
              />
            ))}
          <span ref={dummy} />
        </Stack>
      </Container>
      <PostMessage />
    </>
  );
}

function ChatMessage(props) {
  const { message, userId, id, chatRoom, displayTime } = props;
  const [buttonDisplay, setButtonDisplay] = useState("none");
  const [hoverState, setHoverState] = useState(false);
  const [userDoc] = useDocumentOnce(doc(db, "members", userId));
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (userId === auth.currentUser.uid && hoverState) {
      setButtonDisplay("");
    } else {
      setButtonDisplay("none");
    }
  }, [userId, hoverState]);

  useEffect(() => {
    if (userDoc) {
      setUserName(userDoc.data().name);
      setAvatar(userDoc.data().pfp);
    }
  }, [userDoc]);

  const deleteMessage = () => {
    console.log(id);
    deleteDoc(doc(db, "chat", chatRoom, "messages", id));
  };

  return (
    <Box
      sx={{ w: "100%" }}
      onMouseEnter={() => {
        setHoverState(true);
      }}
      onMouseLeave={() => {
        setHoverState(false);
      }}
    >
      <Stack direction="row" spacing={2} sx={{ m: 0 }}>
        <Avatar src={avatar} />
        <Box>
          <Stack direction="row" spacing={2}>
            <Typography variant="h6" gutterBottom>
              {userName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ position: "relative", top: "8px" }}
            >
              {displayTime}
            </Typography>
            <IconButton
              aria-label="fingerprint"
              color="error"
              sx={{ display: buttonDisplay }}
              onClick={deleteMessage}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
          <ReactMarkdown className="md">{message}</ReactMarkdown>
        </Box>
      </Stack>
    </Box>
  );
}

function PostMessage() {
  const [width, setWidth] = useState(window.innerWidth);
  const [left, setLeft] = useState(chatDrawerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  const { chatRoom } = useParams();
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const messageRef = doc(collection(db, "chat", chatRoom, "messages"));
    setDoc(messageRef, {
      content: message,
      authorId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      id: messageRef.id,
    });
  };

  const onKeyDownFunction = (e) => {
    if (e.key === "Enter") {
      console.log(0);
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
      e.target.value = "";
    }
  };

  const onChangeFunction = (e) => {
    if (e.target.value.length > 0) {
      setMessage(e.target.value.trim());
    } else {
    }
  };

  useEffect(() => {
    if (isMobile) {
      setLeft(0);
    } else {
      setLeft(chatDrawerWidth);
    }
  }, [isMobile]);

  return (
    <Paper
      sx={{
        position: "fixed",
        right: 0,
        bottom: 0,
        left: left,
        p: 1,
        px: 5,
        borderRadius: 0,
      }}
    >
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Message"
          autoComplete="off"
          size="small"
          color="primary"
          onChange={onChangeFunction}
          onKeyDown={onKeyDownFunction}
        />
      </Stack>
    </Paper>
  );
}

function SignInScreen() {
  return (
    <Box>
      <AppBar>
        <Toolbar>
          <Avatar src={woofverse} sx={{ mr: 3 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Woofverse
          </Typography>
          <SignInButton />
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ my: 9 }}>
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar
            alt="Woofverse"
            src={woofverse}
            sx={{ width: 200, height: 200 }}
          />
        </Grid>
        <br />
        <Typography variant="h3" gutterBottom sx={{ textAlign: "center" }}>
          Welcome to Woofverse!
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          The official social media platform for Woof's friends and followers.
        </Typography>
        <br />
        <Grid
          sx={{ mt: 1 }}
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              signInWithPopup(auth, authProvider).then((r) => {});
            }}
            startIcon={<GoogleIcon />}
            size="large"
          >
            Sign In
          </Button>
        </Grid>
      </Container>
    </Box>
  );
}

function SignInButton() {
  return (
    <Button
      variant="text"
      color="success"
      onClick={() => {
        signInWithPopup(auth, authProvider).then((r) => {});
      }}
      startIcon={<GoogleIcon />}
    >
      Sign In
    </Button>
  );
}

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window, title, content } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    if (mobileOpen) {
      chatDrawerWidth = drawerWidth;
    } else {
      chatDrawerWidth = 0;
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" gutterBottom>
          Woofverse
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button component={Link} href="./">
          <ListItemText>Home</ListItemText>
        </ListItem>
        <ListItem button component={Link} href="./members">
          <ListItemText>Members</ListItemText>
        </ListItem>

        <ListItem button component={Link} href="./chat/main">
          <ListItemText>Chat</ListItemText>
        </ListItem>
        <Divider sx={{ m: 2 }} />
        <ListItem button component={Link} href="./settings">
          <ListItemText>Settings</ListItemText>
        </ListItem>
        <ListItem button component={Link} href="./about">
          <ListItemText>About</ListItemText>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => auth.signOut()}
            startIcon={<CloseIcon />}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundImage: `url('${wall}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}

function ResponsiveChatDrawer(props) {
  const { window, title, content, drawer } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${chatDrawerWidth}px)` },
          ml: { sm: `${chatDrawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" size="small" component="a" href="/">
              Back
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => auth.signOut()}
              startIcon={<CloseIcon />}
            >
              Sign Out
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: chatDrawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: chatDrawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: chatDrawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${chatDrawerWidth}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}

function Settings() {
  return (
    <>
      <ResponsiveDrawer title="Settings" content={<SettingsContent />} />
    </>
  );
}

function SettingsContent() {
  const [userDoc] = useDocumentData(doc(db, "members", auth.currentUser.uid));
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [desc, setDesc] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [file, setFile] = useState(null);
  const [newAvatar, setNewAvatar] = useState("");

  const apply = () => {
    const storage = getStorage();
    if (newName === "") {
      setName(name);
    }
    if (newDesc === "") {
      setDesc(desc);
    }
    const profileRef = ref(
      storage,
      `Profile/${auth.currentUser.uid}/avatar.${file.name.split(".").pop()}`
    );
    if (file) {
      uploadBytes(profileRef, file);
      setShowLoading(true);
      getDownloadURL(profileRef).then((url) => {
        setShowLoading(false);
        setShowButtons(true);
        console.log(url);
        setNewAvatar(url);
        console.log(newAvatar);
        const data = {
          name: newName.substring(0, 225),
          desc: newDesc.substring(0, 225),
          pfp: newAvatar,
        };
        const docRef = doc(db, "members", auth.currentUser.uid);
        updateDoc(docRef, data);
      });
    } else {
      const data = {
        name: newName.substring(0, 225),
        desc: newDesc.substring(0, 225),
        pfp: newAvatar,
      };
      const docRef = doc(db, "members", auth.currentUser.uid);
      updateDoc(docRef, data);
    }
  };

  useEffect(() => {
    if (userDoc) {
      setName(userDoc.name);
      setAvatar(userDoc.pfp);
      if (userDoc.desc) {
        setDesc(userDoc.desc);
      }
    }
  }, [userDoc]);

  useEffect(() => {
    console.log(name);
    console.log(newName);
    console.log(name === newName);
    if (newName !== name || newDesc !== desc) {
      setShowButtons(true);
    }
    if (newName === "" || newDesc === "") {
      setNewName(name);
      setNewDesc(desc);
      setShowButtons(false);
    }
  }, [name, newName, newDesc, desc]);

  const upload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setShowButtons(true);
    setFile(file);
  };

  return (
    <>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Profile Customization
      </Typography>
      <Card>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Box>
                    <input
                      component="input"
                      type="file"
                      onChange={upload}
                      className="infile"
                      id="infile"
                      onClick={upload}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => {
                        document.getElementById("infile").click();
                      }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Box>
                }
              >
                <Avatar src={avatar} sx={{ height: "120px", width: "120px" }} />
              </Badge>
            </Stack>
            <Stack spacing={2} sx={{ width: "100%" }}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                multiline
                rows={1}
                defaultValue={name}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              />
              <TextField
                id="desc"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                defaultValue={desc}
                onChange={(e) => setNewDesc(e.target.value)}
              />

              <Box>
                {showButtons && !showLoading && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      color="success"
                      onClick={apply}
                      startIcon={<DoneIcon />}
                    >
                      Apply
                    </Button>
                  </Stack>
                )}
                {showLoading && (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    variant="contained"
                    size="small"
                    disableElevation
                    color="success"
                    startIcon={<DoneIcon />}
                  >
                    Apply
                  </LoadingButton>
                )}
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Card>
      <Typography variant="h5" component="h2" sx={{ my: 3 }}>
        Profile Preview
      </Typography>
	  <Typography variant="body1" component="p" sx={{ mb: 3 }}>
	  Live Preview
	  </Typography>
      <MemberCard name={newName} desc={newDesc} pfp={newAvatar} />
	  <Typography variant="body1" component="p" sx={{ mb: 3 }}>
	  Server Preview (What it looks like to others right now)
	  </Typography>
      <MemberCard name={name} desc={desc} pfp={avatar} />
    </>
  );
}

export default App;
