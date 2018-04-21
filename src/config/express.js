import express from 'express';
import flightsRoute from '../app/routes/flights.route';

export default function() {
  const app = express();
  flightsRoute(app);

  return app;
};
