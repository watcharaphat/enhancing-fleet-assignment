import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SummerSchema = new Schema({
  airline: String,
  originCode: String,
  destinationCode: String,
  kilometers:  Number,
  flight: Number,
  equiptmentName: String,
  depTime: String,
  arrTime: String,
  startDate: String,
  endDate: String,
});

export default mongoose.model('Summer', SummerSchema);
