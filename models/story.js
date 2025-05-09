const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  community_id: { 
    type: String, 
    required: true
  },
  content: { 
    type: String, 
    required: true
  },
  media_url: { 
    type: String
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  expire_at: { 
    type: Date, 
    default: () => Date.now() + 24 * 60 * 60 * 1000 
  }
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;