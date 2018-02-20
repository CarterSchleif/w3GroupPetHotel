// The dependencies reside here.
const express = require('express');
const bodyParser = require('body-parser');
const petRouter = require('./routes/pet.router');
const ownerRouter = require('./routes/owner.router');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));

// The routes reside here.
app.use('/pet.router', petRouter);
app.use('/owner.router', ownerRouter);

// The port Listener... listens.
const port = 5000;
app.listen(port, ()=> console.log(`Server up on port: ${port}`));