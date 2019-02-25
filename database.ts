import * as mongo from 'mongodb';

export default (): Promise<mongo.MongoClient> => {
  return mongo.connect(process.env.MONGO_URL, { useNewUrlParser: true });
};
