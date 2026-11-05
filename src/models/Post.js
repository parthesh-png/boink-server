const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post author is required'],
      index: true,
    },
    text: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Post text cannot exceed 2000 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Helpful virtual or index
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);

