const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// const mongoConnect = require('./util/database').mongoConnect;

app.set('view engine','pug');
app.set('views','views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const emailRoutes = require('./routes/email');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use('/shop',shopRoutes);
app.use('/email',emailRoutes);
app.use('/',(req,res,next)=>{
	res.send('Welcome to my project');
	return res.end();
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
console.log('Server started');
// mongoConnect(() => {
//     app.listen(3000);
// });