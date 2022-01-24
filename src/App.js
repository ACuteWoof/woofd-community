import * as React from "react";
import woofverse from "./woofverse.png";
import wall from "./wall.svg";

import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import {
  addDoc,
  setDoc,
  doc,
  getFirestore,
  collection,
  Timestamp,
  limit,
  query,
  orderBy,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import PropTypes from "prop-types";
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

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const authProvider = new GoogleAuthProvider();

function App() {
  const [user] = useAuthState(auth);

  if (user) {
    return (
      <ThemeProvider theme={theme}>
        <UserInintializer />
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
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
    console.log("auth triggered");
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
  const [posts] = useCollectionData(q, { idField: "id" });

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
      time: Timestamp.now(),
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
  const q = membersRef;
  const [members] = useCollectionData(q, { idField: "id" });

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
    if (role === "Admin") {
      setRole("Admin");
      setColor("success");
    } else {
      // eslint-disable-next-line
      setRole("Member");
      setColor("primary");
      console.log("member card triggered");
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
  return (
    <>
      <ResponsiveDrawer content={<h1>In The Works</h1>} />
    </>
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
        <ListItem button component={Link} href="./chat">
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

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default App;
