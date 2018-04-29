import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FlightSchema = new Schema({
  date: Date,
  airline: String,
  originCode: String,
  destinationCode: String,
  kilometers:  Number,
  flight: Number,
  stops: Number,
  equipmentName: String,
  depTime: String,
  arrTime: String,
});

export default mongoose.model('Flight', FlightSchema);
