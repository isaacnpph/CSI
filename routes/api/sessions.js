const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Session = require("../../models/Session");
const User = require("../../models/User");
const Query = require("../../models/Query");
const router = express.Router();
const fetch = require("node-fetch");

let socket_clients = global.socket_clients;

// @route  GET api/sessions/session-by-id/:session_id
// @desc   Get a session by its ID
// @access Private
router.get("/session-by-id/:session_id", auth, async (req, res) => {
  try {
    const sessionById = await Session.findById(req.params.session_id);

    if (!sessionById) return res.status(400).json({ msg: "Session not found" });

    res.json(sessionById);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Session not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route  GET api/sessions/user
// @desc   Get sessions by user ID
// @access Private
router.get("/user", auth, async (req, res) => {
  try {
    let sessions = await Session.find({
      $or: [{ invitedUsers: req.user.id }, { author: req.user.id }]
    });

    // check if the user has created sessions.
    if (sessions.length === 0)
      return res
        .status(400)
        .json({ msg: "User has not created a session yet." });

    // sorting sessions by date (the latest at the top)
    sessions.sort((a, b) => {
      return b.date - a.date;
    });
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res
        .status(400)
        .json({ msg: "User has not created a session yet." });
    }
    res.status(500).send("Server error");
  }
});

// @route  POST api/sessions
// @desc   Create a session
// @access Private
router.post("/", auth, async (req, res) => {
  try {

    const newSession = new Session({
      author: req.user.id,
      name: req.body.name,
      description: req.body.description
    });
    newSession.save();
    res.json(newSession);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/sessions/:id
// @desc   Delete a session
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedSession = await Session.findByIdAndRemove(req.params.id);

    deletedSessionUsers = deletedSession.invitedUsers;

    for(let i=0; i < deletedSessionUsers.length; i++) {
      for(let j=0; j < socket_clients.length; j++){
         if(socket_clients[j].user_id == deletedSessionUsers[i]);
            socket_clients[j].socket.emit('sessionDeleted', {deletedSession});
        }
    }

    res.json(deletedSession._id);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ success: false });
  }
});

// @route  PUT api/sessions/activeusers/:session_id
// @desc   Add a user to the session using their email address
// @access Private
router.put("/invitedUsers/:session_id", auth, async (req, res) => {
  try {
    
    const { email } = req.body;
    const user = await User.findOne({ email });
    const session = await Session.findById(req.params.session_id);


    let socket = await socket_clients.filter(x => x.user_id == user._id);
    socket = socket[socket.length-1].socket;


    // check if user's already added
    for (var i = 0; i < session.invitedUsers.length; i++) {
      if (session.invitedUsers[i] == user.id) {
        return res.status(400).json({ msg: "User has already been invited." });
      }
    }
    if (user.id == session.author) {
      return res
        .status(400)
        .json({ msg: "Not possible to add yourself to the session" });
    }
    // check number of users in the session (only 10 users allowed in one session)
    if (session.invitedUsers.length > 9) {
      return res
        .status(400)
        .json({ msg: "No more than 10 users can join a session" });
    }
    // add user to the session
    session.invitedUsers.unshift(user);
    await session.save();

    socket.emit('newUserAddedToSession', {session});

    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/sessions/invitedUsers/remove/:session_id/:user_email"
// @desc   Remove a user f user from the session / Leave session
// @access Private
router.delete(
  "/invitedUsers/remove/:session_id/:user_email",
  auth,
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.user_email });
      const session = await Session.findById(req.params.session_id);
      session.invitedUsers.remove(user);
      await session.save();

      let socket = socket_clients.filter(socket_client => {
        return socket_client.user_id == user._id; 
      })

      socket = socket[socket.length-1].socket;
      socket.emit('removedFromSession', session);

      res.json(session._id);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  PUT api/sessions/queries/
// @desc   Add a query to the list of queries
// @access Private
router.put("/queries", auth, async (req, res) => {
  const { title } = req.body;
  const query = await Query.findOne({ title });
  const session = await Session.findById(req.session.id);
  try {
    // add query to history of queries
    session.queries.unshift(query);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/sessions/queries/:session_id
// @desc   Remove a query from queries
// @access Private
router.delete("/queries/:session_id", auth, async (req, res) => {
  const { title } = req.body;
  const query = await Query.findOne({ title });
  const session = await Session.findById(req.params.session_id);
  try {
    session.queries.remove(query);
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  PUT api/sessions/highlightedQueries:session_id
// @desc   Add a query to the list of highlighted queries
// @access Private
router.put(
  "/highlightedQueries/:session_id",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("snippet", "Snippet is required")
        .not()
        .isEmpty(),
      check("link", "URL is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, snippet, link } = req.body;

    const search = {
      title,
      snippet,
      link,
      user: req.user.id
    };
    try {
      const session = await Session.findById(req.params.session_id);
      // add query to highlighted queries
      session.highlightedQueries.unshift(search);
      await session.save();

      let sessionUsers = session.invitedUsers;
      sessionUsers.push(session.author);


      for(let i=0; i<sessionUsers.length; i++) {
        for(let j=0; j < socket_clients.length; j++) {
          if(sessionUsers[i] == socket_clients[j].user_id && sessionUsers[i] != search.user) {
            socket_clients[j].socket.emit('highlightSearchUpdate', session);
          }
        }
      }

      
      res.json(session);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  DELETE api/sessions/highlightedQueries/:session_id
// @desc   Remove a query from the list of highlighted queries
// @access Private
router.delete(
  "/highlightedQueries/:session_id/:search_id",
  auth,
  async (req, res) => {
    const session = await Session.findById(req.params.session_id);
    try {
      session.highlightedQueries.remove(req.params.search_id);
      await session.save();

      let sessionUsers = session.invitedUsers;
      sessionUsers.push(session.author);


      for(let i=0; i<sessionUsers.length; i++) {
        for(let j=0; j < socket_clients.length; j++) {
          if(sessionUsers[i] == socket_clients[j].user_id && sessionUsers[i] != req.user.id) {
            
            socket_clients[j].socket.emit('removedHighlightSearchUpdate', session);
          }
        }
      }

      res.json(session);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  PUT api/sessions/like/:session_id/:search_id
// @desc   Like a highlighted search
// @access Private
router.put("/like/:session_id/:search_id", auth, async (req, res) => {
  try {
    // get session
    const session = await Session.findById(req.params.session_id);

    // get highlighted search
    const highlightedLink = session.highlightedQueries.find(
      highlightedLink => highlightedLink.id === req.params.search_id
    );

    // Check if the highlighted search has already been liked
    if (
      highlightedLink.likes.filter(
        likes => likes.user.toString() === req.user.id
      ).length > 0
    ) {
      return res.status(400).json({ msg: "query already liked" });
    }

    highlightedLink.likes.unshift({ user: req.user.id });
    await session.save();

    let sessionUsers = session.invitedUsers;
      sessionUsers.push(session.author);


      for(let i=0; i<sessionUsers.length; i++) {
        for(let j=0; j < socket_clients.length; j++) {
          if(sessionUsers[i] == socket_clients[j].user_id && sessionUsers[i] != req.user.id) {
            
            socket_clients[j].socket.emit('HighlightSearchLikeUpdate', session);
          }
        }
      }

    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  PUT api/sessions/unlike/:session_id
// @desc   Unlike a highlighted search
// @access Private
router.put("/unlike/:session_id/:search_id", auth, async (req, res) => {
  try {
    // get session
    const session = await Session.findById(req.params.session_id);

    // get highlighted search
    const highlightedLink = session.highlightedQueries.find(
      highlightedLink => highlightedLink.id === req.params.search_id
    );

    if (
      highlightedLink.likes.filter(
        likes => likes.user.toString() === req.user.id
      ).length === 0
    ) {
      return res.status(400).json({ msg: "query not liked yet" });
    }
    // get the index of the like that needs to be removed
    const removeLike = highlightedLink.likes
      .map(likes => likes.user.toString())
      .indexOf(req.user.id);

    // remove the like
    highlightedLink.likes.splice(removeLike, 1);
    await session.save();

    let sessionUsers = session.invitedUsers;
      sessionUsers.push(session.author);


      for(let i=0; i<sessionUsers.length; i++) {
        for(let j=0; j < socket_clients.length; j++) {
          if(sessionUsers[i] == socket_clients[j].user_id && sessionUsers[i] != req.user.id) {
            
            socket_clients[j].socket.emit('HighlightSearchUnlikeUpdate', session);
          }
        }
      }

    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/sessions/comment/:id
// @desc   Comment on a highlighted search
// @access Private
router.post(
  "/comment/:session_id/:search_id",
  [
    auth,
    [
      check("content", "Content is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const session = await Session.findById(req.params.session_id);
      const user = await User.findById(req.user.id).select("-password");

      const newComment = {
        name: user.name,
        content: req.body.content,
        user: req.user.id
      };

      for (var i = 0; i < session.highlightedQueries.length; i++) {
        if (session.highlightedQueries[i]._id == req.params.search_id) {
          session.highlightedQueries[i].comments.unshift(newComment);
          session.highlightedQueries[i].comments.sort((a, b) => {
            return a.date - b.date;
          });
        }
      }

      await session.save();

      let sessionUsers = session.invitedUsers;
      sessionUsers.push(session.author);


      for(let i=0; i<sessionUsers.length; i++) {
        for(let j=0; j < socket_clients.length; j++) {
          if(sessionUsers[i] == socket_clients[j].user_id && sessionUsers[i] != req.user.id) {
            
            socket_clients[j].socket.emit('HighlightSearchAddCommentUpdate', session);
          }
        }
      }

      res.json(session);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  DELETE api/sessions/comment/:session_id/:search_id/:comment_id
// @desc   Delete a comment
// @access Private
router.delete(
  "/comment/:session_id/:search_id/:comment_id",
  auth,
  async (req, res) => {
    try {
      const session = await Session.findById(req.params.session_id);

      // get highlighted search
      const highlightedLink = session.highlightedQueries.find(
        highlightedLink => highlightedLink.id === req.params.search_id
      );

      // get comment
      const comment = highlightedLink.comments.find(
        comment => comment.id === req.params.comment_id
      );

      // check if comment exists
      if (!comment) {
        return res.status(404).json({ msg: "comment not found" });
      }

      // check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "not possible" });
      }

      // get the index of the comment that needs to be removed
      const removeIndex = highlightedLink.comments
        .map(comment => comment.id)
        .indexOf(req.params.comment_id);

      // remove the comment
      highlightedLink.comments.splice(removeIndex, 1);

      await session.save();

      let sessionUsers = session.invitedUsers;
      sessionUsers.push(session.author);


      for(let i=0; i<sessionUsers.length; i++) {
        for(let j=0; j < socket_clients.length; j++) {
          if(sessionUsers[i] == socket_clients[j].user_id && sessionUsers[i] != req.user.id) {
            
            socket_clients[j].socket.emit('HighlightSearchRemoveCommentUpdate', session);
          }
        }
      }

      res.json(session);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  GET api/sessions/googleApi/:query/:page
// @desc   Fetch results from Google Search API
// @access Private
router.get("/googleApi/:query/:page", auth, async (req, res) => {
  const cx = "000945381243835014262:mt4yjab0bag";
  const apiURL = "https://www.googleapis.com/customsearch/v1";
  const apiKey = "AIzaSyDsdl5HGvecx7sakunJREQSbcHMbSIe7EU";

  let URL =
    apiURL +
    "?key=" +
    apiKey +
    "&num=10&start=" +
    req.params.page +
    "&cx=" +
    cx +
    "&q=" +
    req.params.query;

  try {
    let response = await fetch(URL);
    let data = await response.json();
    await res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
