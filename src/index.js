const express=require('express');
const rateLimit =require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const {ServerConfig}=require('./config');
const apiRoutes=require('./routes');
const app=express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
    max:3,//Limit each IP to 2 requests per 'window' (here,per 15 mintues)
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(limiter);


app.use('/flightsService',
  createProxyMiddleware({
    target:ServerConfig.FLIGHTS_SERVICE,
    changeOrigin: true,
    pathRewrite:{'^/flightsService':'/'}
  }),
);
app.use('/bookingService',
  createProxyMiddleware({
    target:ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite:{'^/bookingService':'/'}
  }),
);


app.use('/api',apiRoutes);


app.listen(ServerConfig.PORT,()=>{
    console.log(`Server is running on port: ${ServerConfig.PORT}`);
});