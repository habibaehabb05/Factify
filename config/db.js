import mongoose from 'mongoose'; // <-- New import syntax

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully via Mongoose.');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB; // <-- New export syntax```



