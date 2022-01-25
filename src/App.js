import * as React from "react";
import woofverse from "./woofverse.png";
import wall from "./wall.svg";

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
  addDoc,
  setDoc,
  doc,
  getFirestore,
  deleteDoc,
  collection,
  serverTimestamp,
  limit,
  query,
  orderBy,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
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
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import GoogleIcon from "@mui/icons-material/Google";

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
  const [user] = useAuthState(auth);

  if (user) {
    return (
      <ThemeProvider theme={theme}>
        <UserInintializer />
        <CssBaseline enableColorScheme />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:chatRoom" element={<Chat />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SignInScreen />
      </ThemeProvider>
    );
  }
}

function UserInintializer() {
  useEffect(() => {
    console.log("auth triggered");
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
    // eslint-disable-next-line
  }, [auth]);

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
            authorName={post.authorName}
            authorPfp={post.authorPfp}
            time={post.time.toDate().toLocaleString(undefined, {
              hour: "numeric",
              minute: "numeric",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
  const makePost = () => {
    addDoc(collection(db, "posts"), {
      title: title,
      content: content,
      authorName: auth.currentUser.displayName,
      authorPfp: auth.currentUser.photoURL,
      time: serverTimestamp(),
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
  const { title, content, authorName, authorPfp, time } = props;
  return (
    <>
      <Card sx={{ my: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <br />
          <Typography variant="body2" color="textSecondary" component="p">
            {content}
          </Typography>
          <br />
          <Stack direction="row" spacing={1}>
            <Chip
              avatar={<Avatar alt="avatar" src={authorPfp} />}
              label={authorName}
              color="primary"
            />
            <Chip label={time} color="primary" variant="outlined" />
          </Stack>
        </CardContent>
      </Card>
    </>
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
      {members &&
        members.map((member) => (
          <MemberCard
            key={member.id}
            name={member.name}
            pfp={member.pfp}
            role={member.role}
          />
        ))}
    </Container>
  );
}

function MemberCard(props) {
  let { name, pfp, role } = props;
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
    <Card sx={{ my: 3 }}>
      <Box sx={{ p: 2, display: "flex" }}>
        <Stack spacing={2} direction="row">
          <Avatar src={pfp} sx={{ width: 69, height: 69 }} />
          <Box sx={{ p: 2 }}>
            <Typography fontWeight={700}>{name}</Typography>
            <Chip
              label={displayRole}
              variant="outlined"
              size="small"
              color={color}
            />
          </Box>
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
  const { message, userName, avatar, userId, id, chatRoom, displayTime } =
    props;
  const [buttonDisplay, setButtonDisplay] = useState("none");
  const [hoverState, setHoverState] = useState(false);

  useEffect(() => {
    if (userId === auth.currentUser.uid && hoverState) {
      setButtonDisplay("");
    } else {
      setButtonDisplay("none");
    }
  }, [userId, hoverState]);

  const deleteMessage = () => {
    console.log(id);
    deleteDoc(doc(db, "chat", chatRoom, "messages", id));
  };

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Avatar src={avatar} />
        <Box
          onMouseEnter={() => {
            setHoverState(true);
          }}
          onMouseLeave={() => {
            setHoverState(false);
          }}
        >
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
            >
              <ClearIcon fontSize="small" onClick={deleteMessage} />
            </IconButton>
          </Stack>
          <Typography variant="body1" color="textSecondary" component="p">
            {message}
          </Typography>
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
      authorName: auth.currentUser.displayName,
      authorAvatar: auth.currentUser.photoURL,
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
        <ListItem button component={Link} href="./about">
          <ListItemText>About</ListItemText>
        </ListItem>
        <ListItem button component={Link} href="./chat/main">
          <ListItemText>Chat</ListItemText>
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

export default App;
