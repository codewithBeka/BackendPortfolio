import mongoose from 'mongoose';

const dbConnect = () => {
    const mongodbUrl = 'mongodb+srv://walebereket37:16bereket16@portfolio.kofox.mongodb.net/?retryWrites=true&w=majority&appName=portfolio';
    mongoose
      .connect(mongodbUrl)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export default dbConnect