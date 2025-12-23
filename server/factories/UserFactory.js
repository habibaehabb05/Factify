const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserFactory {
    /**
     * Factory method to create a user based on role.
     * Centralizes user creation logic (hashing pw, validation).
     * @param {Object} data - { username, email, password, role }
     * @returns {Promise<User>}
     */
    static async createUser(data) {
        const { username, email, password, role } = data;

        // Validate role (Design Pattern: Factory ensures correct object types)
        const validRoles = ['user', 'admin'];
        const assignedRole = validRoles.includes(role) ? role : 'user';

        // Password Hashing (could move to pre-save hook, but Factory is also a good place for "Construction")
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: assignedRole
        });

        return await user.save();
    }
}

module.exports = UserFactory;
