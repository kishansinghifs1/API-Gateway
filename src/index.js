const express=require('express');
const rateLimit =require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const {ServerConfig}=require('./config');
const apiRoutes=require('./routes');
const app=express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
  max:50,//Limit each IP to 2 requests per 'window' (here,per 15 mintues)
    skip: (req) => req.path === '/health',
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-idempotency-key');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API IS LIVE',
    error: {},
    data: {}
  });
});

app.use(limiter);


app.use('/flightsService',
  createProxyMiddleware({
    target:ServerConfig.FLIGHTS_SERVICE,
    changeOrigin: true,
    pathRewrite:{'^/flightsService':'/'},
  }),
);
app.use('/bookingService',
  createProxyMiddleware({
    target:ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite:{'^/bookingService':'/'},
  }),
);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api',apiRoutes);


app.listen(ServerConfig.PORT,()=>{
    console.log(`Server is running on port: ${ServerConfig.PORT}`);
});