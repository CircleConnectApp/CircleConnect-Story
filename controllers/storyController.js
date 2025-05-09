const { Pool } = require("pg");
const mongoose = require("mongoose");
const Story = require("../models/story");
const { sequelize } = require("../config/db");

exports.createStory = async (req, res) => {
  try {
    const { content, community_id, media_url } = req.body;
    const user_id = req.user.user_id;

    // Basic validation
    if (!content || !community_id) {
      return res.status(400).json({ 
        error: "Content and community_id are required" 
      });
    }

    // Convert user_id to ObjectId
    const userObjectId = mongoose.Types.ObjectId(user_id);

    // Save community_id as it is (number)
    const story = new Story({ 
      user_id: userObjectId, 
      community_id: community_id, // Save as provided (e.g., number)
      content,
      media_url 
    });

    await story.save();
    res.status(201).json({ 
      message: "Story created successfully",
      story: {
        id: story._id,
        content: story.content,
        expires_at: story.expire_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to create story",
      details: err.message 
    });
  }
};

exports.getCommunityStories = async (req, res) => {
  try {
    const { id } = req.params;  
    const { page = 1, limit = 20 } = req.query;

    const communityIdString = id.toString();

    const stories = await Story.find({ community_id: communityIdString })
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ stories });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch stories",
      details: err.message,
    });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const story = await Story.findById(id);
    
    if (!story) {
      return res.status(404).json({ 
        error: "Story not found" 
      });
    }

    if (story.user_id.toString() !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: "Not authorized to delete this story" 
      });
    }

    await Story.deleteOne({ _id: id });
    res.json({ 
      message: "Story deleted successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to delete story",
      details: err.message 
    });
  }
};