const Analysis = require('../models/Analysis');
const User = require('../models/User');

/**
 * @desc    Get all users for Admin Dashboard
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a user and their analyses
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        // Prevent deleting other admins
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        // Delete user's analyses first
        await Analysis.deleteMany({ userId: user._id });

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User and their analyses deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get all analyses for Admin Dashboard
 * @route   GET /api/admin/analyses
 * @access  Private/Admin
 */
const getAllAnalyses = async (req, res) => {
    try {
        const backendAnalyses = await Analysis.find({ userId: { $ne: null } })
            .populate('userId', 'username email')
            .sort({ timestamp: -1 });
        res.json(backendAnalyses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get system statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        // Filter out guest analyses (where userId is null)
        const analysisCount = await Analysis.countDocuments({ userId: { $ne: null } });
        const fakeCount = await Analysis.countDocuments({ "result.classification": "Fake", userId: { $ne: null } });
        const realCount = await Analysis.countDocuments({ "result.classification": "Real", userId: { $ne: null } });

        res.json({
            userCount,
            analysisCount,
            fakeCount,
            realCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAllUsers, deleteUser, getAllAnalyses, getStats };
