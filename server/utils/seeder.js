const User = require('../models/User');
const UserFactory = require('../factories/UserFactory');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@factify.com' });
        if (!adminExists) {
            console.log('Seeding Admin User...');
            await UserFactory.createUser({
                username: 'admin',
                email: 'admin@factify.com',
                password: 'secureadminpassword123', // Hardcoded specific admin
                role: 'admin'
            });
            console.log('Admin User Created: admin@factify.com / secureadminpassword123');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

module.exports = seedAdmin;
