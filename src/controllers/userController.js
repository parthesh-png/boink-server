const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Search users by name or ID
// @route   GET /api/users/search?q=...
const searchUsers = async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim().slice(0, 64);
    if (!query) {
      return res.status(200).json({ success: true, users: [] });
    }

    const filter = { _id: { $ne: req.user._id } };
    if (/^[a-f\d]{24}$/i.test(query)) {
      filter._id = { $eq: query, $ne: req.user._id };
    } else {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: escapedQuery, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('_id name profilePicture')
      .limit(8)
      .lean();

    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name email profilePicture')
      .populate('following', 'name email profilePicture');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const postCount = await Post.countDocuments({ author: user._id });

    res.status(200).json({
      success: true,
      user: {
        ...user.toJSON(),
        postCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// Fields: Name, Email (readonly - preserved), Bio, Profile Picture URL
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, bio, profilePicture } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    // Email is strictly readonly and NOT updated

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        followers: updatedUser.followers,
        following: updatedUser.following,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow or Unfollow a user
// @route   POST /api/users/:id/follow
const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself.',
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const currentUser = await User.findById(currentUserId);

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId.toString()
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        isFollowing: false,
        message: `Unfollowed ${targetUser.name}`,
      });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        success: true,
        isFollowing: true,
        message: `Followed ${targetUser.name}`,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchUsers,
  getUserProfile,
  updateProfile,
  toggleFollow,
};
