import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('Chưa định nghĩa MONGO_URI trong file .env');
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host} 🗄️`);
  } catch (error) {
    console.error(`Lỗi kết nối MongoDB: ${(error as Error).message}`);
    process.exit(1); // Dừng server nếu lỗi database
  }
};

export default connectDB;