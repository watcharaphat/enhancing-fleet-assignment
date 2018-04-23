import express from 'express';
import flightsRoute from '../app/routes/flights.route';

export default function() {
  const app = express();

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
  });

  flightsRoute(app);

  return app;
};
