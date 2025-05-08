const express = require("express");
const router = express.Router();
const controller = require("../controllers/storyController");
const authenticate = require("../middleware/auth");


router.post("/", authenticate, controller.createStory);


router.get("/community/:id", authenticate, controller.getCommunityStories);

router.delete("/:id", authenticate, controller.deleteStory);

module.exports = router;