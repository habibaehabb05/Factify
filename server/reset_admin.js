const mongoose = require('mongoose');
const User = require('./models/User');
const UserFactory = require('./factories/UserFactory');
const dotenv = require('dotenv');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Remove existing admin
        await User.deleteOne({ email: 'admin@factify.com' });
        console.log('Removed old admin');

        // Create fresh admin
        await UserFactory.createUser({
            username: 'admin',
            email: 'admin@factify.com',
            password: 'secureadminpassword123',
            role: 'admin'
        });
        console.log('Admin verified and reset: admin@factify.com / secureadminpassword123');

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetAdmin();
