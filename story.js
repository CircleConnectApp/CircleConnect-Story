const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' 
  },
  community_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Community' 
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 500 
  },
  media_url: { 
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  created_at: { type: Date, default: Date.now },
  expire_at: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: { expires: 0 } 
  }
});

module.exports = mongoose.model("Story", storySchema);