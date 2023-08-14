const express = require('express');
const session= require('express-session');
const app = express();
const port= 3000;

 app.set( 'view engine','ejs');
 app.use(express.static('public'));
 app.use(express.urlencoded({extended:true}));
 app.use(express.json());

 app.use(session({
    secret: 'Capitan20', 
    resave: false,
    saveUninitialized: true,
}));

app.use('/' ,require('./routes/indexRoutes'));
app.listen(port,()=>{
    console.log(`APP listening on port ${port}`);
});


