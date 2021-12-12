const express = require('express');
const fs = require('fs')
const { encrypt, decrypt } = require('./crypto');

const app = express();

var cors = require('cors');
app.use(cors())
app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json()); 




app.get('/', function (req, res) {    
    res.render('client');
});




app.post('/base',  function (req, res) {
    const insecure = req.body.insecure;

    let outData="";
    let data = readFromBase();
    var array = data.split(/\r?\n/);//dsaodas:djhjadshsa or j32:22
    array.forEach((element) => {
        
        if (element!==""){
          
            let first_second = element.split(/\r?:/);
            if (insecure){ // ok:11
                outData+=first_second[0]+"  "+ first_second[1]+"<br>";
            }
            else{ // sajbjdkash:sajdhsa
                let hash = {
                    iv: first_second[0],
                    content: first_second[1]
                }
                let decoded = decrypt(hash); //oi:22
                let user_pass = decoded.split(/\r?:/);
                outData += user_pass[0] + "  "+hash.iv+hash.content+"<br>";
                
            } 
        }
     } )
     console.log("return data is " + outData);
    res.send(outData);
});




app.post('/delete',  function (req, res) {

    fs.writeFileSync('baza.txt',"");//da ispraznimo
     res.send("uspejh");

});


app.post('/login',  function (req, res) {
    const username = req.body.username;
	const password = req.body.password;
    const insecure = req.body.insecure;
    /*
    let hash = encrypt("hi");
    console.log(hash);
    let hash2 = {
        iv:hash.iv,
        content:hash.content
    }
    console.log(decrypt(hash2));*/

    if (insecure){
        if (!accountExists(username,password)) {
            res.status(401).send("Invalid username or password");
        }
        else {
            res.send("aaa");
        }
    }
    else{
        if (!(existsEncrypted(username,password))){
            res.status(401).send("Invalid username or password");
        }


        else
            res.send("aaa");
    }


    
});

app.post('/register',  function (req, res) {
    const username = req.body.username;
	const password = req.body.password;
    const insecure = req.body.insecure;
    console.log(username + "<- username");
    if (!usernameExists(username,insecure)){
        if (insecure){
            writeToBase(username,password);
            res.send("Uspjesna registracija");
        }
        else{
            let hash = encrypt((username+":"+password));
            writeToBase(hash.iv,hash.content);
            res.send("Uspjesna registracija");
        }
    }
    else res.status(401).send("Fail");
    
});


function usernameExists(username,insecure){
    let allAccounts = readFromBase();
    var array = allAccounts.split(/\r?\n/);
    let postoji = false;
    array.forEach((element) => {
        
        let username_password = element.split(/\r?:/);
        if (username_password[0] === username){
            postoji=true;
        }

        if (element!=="" && !insecure){
            let hash = {
                iv: username_password[0],
                content: username_password[1]
            }
            let decripted = decrypt(hash);
            let username_password2 = decripted.split(/\r?:/);
            if (username_password2[0]===username)postoji = true;

        }

     } )
     return postoji;
}



const port = process.env.PORT || 3000;

const baseURL = process.env.APP_URL || `http://localhost:${port}`



app.listen(port, () => {
  console.log(`Server running on ${baseURL}`);
});


//za ocitavanja registriranih profile (zasad nekodiranih)
/*
function accountExists(encrypted){
    let allAccounts = readFromBase();
    var array = allAccounts.split(/\r?\n/);
    let postoji = false;
    array.forEach((element) => {
        
       if (element === encrypted)postoji=true;
     } )
     return postoji;
}*/
function existsEncrypted(username,password){
    let allAccounts = readFromBase();
    var array = allAccounts.split(/\r?\n/);//dsaodas:djhjadshsa
    let postoji = false;
    let search = username+":"+password;
    array.forEach((element) => {
        
        if (element!==""){
        let username_password = element.split(/\r?:/);
        let hash = {
            iv: username_password[0],
            content: username_password[1]
        }
        if (decrypt(hash) ===search){
            
            console.log("postoji");
            postoji=true;
        }}


     } )
     return postoji;
}


function accountExists(username,password){
    let allAccounts = readFromBase();
    var array = allAccounts.split(/\r?\n/);
    let postoji = false;
    array.forEach((element) => {
        
        let username_password = element.split(/\r?:/);
        if (username_password[0] === username && username_password[1] === password){
            
            console.log("postoji");
            postoji=true;
        }
     } )
     return postoji;
}


//za upisivanje podataka u bazu (zasad nekodiranih)
function writeToBase(username,password){

    let data = readFromBase()+"\n"+username+":"+password;
    fs.writeFileSync('baza.txt',data);
}




//procita cijeli fajl
function readFromBase(){
    let data = fs.readFileSync('baza.txt','utf8');
    return data;
}