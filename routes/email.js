const express = require('express');
const verifier = require('email-verifier');
const nodemailer = require('nodemailer');
const crypto = require('crypto-js');

const router = express.Router();

let rand,mailOptions,host,link;
let users = {};


	String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

router.get('/test',(req,res,next)=>{
	res.send('<form action="/email/test" method="POST"><input type="text" name="plaintext" placeholder="Enter the plaintext"><button type="submit">Encrypt</button></form>');
});

router.post('/test',(req,res,next)=>{
	let plaintext = req.body.plaintext;
	console.log("Plaintext is "+plaintext);
	let encoded = crypto.AES.encrypt(plaintext,"message").toString();
	let decoded = (crypto.AES.decrypt(encoded,"message")).toString(crypto.enc.Utf8);
	res.send('<h1>Encoded text is '+encoded+'</h1><br><h1>Decoded text is '+decoded+'</h1>');
	return res.end();
});

router.get('/verify',(req,res,next)=>{ 
	console.log('Redirect successful');
	// const id = req.query.id;
	console.log("id "+req.query.id);
	let iid = (req.query.id).replaceAll(' ','+');
	try{let plaintext = (crypto.AES.decrypt(iid,"message")).toString(crypto.enc.Utf8);
	if(plaintext==''){
		return res.redirect('/');
	}
	else if(!users[plaintext]){
		res.send('<h1>Email verified</h1>');
		console.log("Plaintext is "+plaintext);
		users[plaintext] = true;
		console.log(users);
		return res.end();
	}
	else{
		res.send('<h1>Email already verified</h1>');
		return res.end();
	}}
	catch(err){
		return res.redirect('/');
	}
});

router.get('/',(req,res,next)=>{
	res.send('<hmtl><form action="/email" method="POST"><input type="email" placeholder="Enter email address" name="email"><button type="submit">Submit</button></form></html>');
	return res.end();
});

router.post('/',(req,res,next)=>{
	const email = req.body.email;
	console.log(email);

	let verify = new verifier("at_EEHvApdOPC6RkT91LMEXOlzXKaSAR");
	verify.verify(email,(err,data)=>{
		if(err){
			console.log(err);
			res.send('Problem');
			return res.end();
		}
		console.log(data);
		if(!data.smtpCheck || !data.dnsCheck){
			res.send('ERRRORRR');
			return res.end();
		}
		var smtpTransport = nodemailer.createTransport({
	    service: "Gmail",
	    auth: {
	        user: "madtproject@gmail.com",
	        pass: "harshapurvanikunj"
	    }
		});
		// rand=Math.floor((Math.random() * 100) + 54);
		let index = email.indexOf("@");
		let string = email.substring(0,index);
		let encoded = crypto.AES.encrypt(string,"message").toString();
	    host=req.get('host');
	    link="http://"+req.get('host')+"/email/verify?id="+encoded;
	    mailOptions={
	        to : email,
	        subject : "Please confirm your Email account",
	        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
	    }
	    console.log(mailOptions);
	    console.log("Encoded "+encoded+"string "+string+" host "+host+" link "+link);
	    console.log('smtpCheck '+data.smtpCheck+'  dnsCheck  '+data.dnsCheck);
	    if(data.smtpCheck && data.dnsCheck){
	    	smtpTransport.sendMail(mailOptions, function(error, response){
	     if(error){
            console.log(error);
            res.send('<h1>Incorrect email</h1>');
	        return res.end("error");
	     }else{
	    	console.log(response);
	    	users[string] = false;
	    	console.log(users);
	    	res.send("<h1>"+email+"</h1>");
	    	return res.end();
            // console.log("Message sent: " + response.message);
	         }
			});
	    }
	    else{
	    	res.send("<h1>Wrong credentials</h1>");
	    	return res.end();
	    }
	});
	res.send('Last wala');
	return res.end();
});

module.exports = router;