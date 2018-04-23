import express from 'express';
import cors from 'cors';
import flightsRoute from '../app/routes/flights.route';

export default function() {
  const app = express();
  app.use(cors);
  flightsRoute(app);

  return app;
};
