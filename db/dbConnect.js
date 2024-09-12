import mongoose from 'mongoose'

export async function dbConnect(dbName) {
   try {
      await mongoose.connect(process.env.MONGO_URI, { dbName })
      console.log('MongoDB connect successfully')
   } catch (error) {
      console.log('MongoDB failed to connect')
   }
}
