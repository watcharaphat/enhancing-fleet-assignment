import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const WinterSchema = new Schema({
  airline: String,
  originCode: String,
  destinationCode: String,
  kilometers:  Number,
  flight: Number,
  equipmentName: String,
  depTime: String,
  arrTime: String,
  startDate: String,
  endDate: String,
});

export default mongoose.model('Winter', WinterSchema);
