const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Query = require("../../models/Query");
const Session = require("../../models/Session");
const User = require("../../models/User");
const router = express.Router();

// @route  POST api/queries
// @desc   Add a query
// @access Private
router.post(
  "/:session_id",
  [
    auth,
    [
      check("keyword", "keyword is required")
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
      const newQuery = new Query({
        addedIn: session.id,
        keyword: req.body.keyword,
        addedBy: user.name
      });

      const query = await newQuery.save();
      console.log(query);
      res.json(query);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  GET api/queries
// @desc   Get queries by session id
// @access Private
router.get("/session_queries/:session_id", auth, async (req, res) => {
  try {
    const queries = await Query.find({ addedIn: req.params.session_id }).sort({
      date: -1
    });
    res.json(queries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  GET api/queries/user
// @desc   Get queries by user ID
// @access Private
router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  try {
    const queries = await Query.find({ addedBy: user.name });
    res.json(queries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/queries/:id
// @desc   Delete a query
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    await Query.findByIdAndRemove(res.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
