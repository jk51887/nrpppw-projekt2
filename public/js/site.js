
window.onload = () => {
    document.getElementById('btnLogin').addEventListener("click", login);
    document.getElementById('btnLogout').addEventListener("click", logout);
    document.getElementById('btnRegister').addEventListener("click", register);
    document.getElementById('store').addEventListener("click", codeUncodeBase);
    codeUncodeBase();
};


function codeUncodeBase(){
    
    axios.post(`${path}delete`) 
            .then(res => {
                console.log("Uspjesna promjena baze.");
                refreshBase();
            })
            .catch(function (error) {                          
                         
            });
}

function register(){
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    var store = document.getElementsByClassName('store');
    let insecure = store[0].checked;

    

    if (!username.length ==0 && !password.length==0){
        axios.post(`${path}register`, {username, password,insecure}) 
            .then(res => {
                console.log("Uspjesna registracija.");
                document.getElementById('content').innerHTML = "Uspješna registracija.";
                refreshBase();
            })
            .catch(function (error) {                          
                document.getElementById('content').innerHTML = "Neuspješna registracija.";           
            });  
        }
        document.getElementById('username').value="";
        document.getElementById('password').value="";
}

function showLoginForm(show) {
    if (show) {
        document.getElementsByClassName('login-form')[0].style.display = "block";
        document.getElementById('btnLogout').style.display = "none";
    }
    else {
        document.getElementsByClassName('login-form')[0].style.display = "none";
        document.getElementById('btnLogout').style.display = "block";
    }
}


var path = location.pathname.substring(1);

function logout() {
    document.getElementById('content').innerHTML = '';
    showLoginForm(true);
}

function login() {
    document.getElementById('content').innerHTML = '';
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    var store = document.getElementsByClassName('store');
    let insecure = store[0].checked;

    if (!username.length ==0 && !password.length==0){
    axios.post(`${path}login`, {username, password,insecure})
          .then(res => {
              console.log("Uspjesan login.");
              document.getElementById('content').innerHTML = "Uspješna prijava.";
              showLoginForm(false);
          })
          .catch(function (error) {                          
              document.getElementById('content').innerHTML = "Neuspješna prijava.";           
          });  
        }

        document.getElementById('username').value="";
        document.getElementById('password').value="";
}



function refreshBase(){
    var store = document.getElementsByClassName('store');
    let insecure = store[0].checked;

    axios.post(`${path}base`,{insecure})
          .then(res => {
              
              document.getElementById('content2').innerHTML = res.data;

          })
          .catch(function (error) {                          
                  
          }); 
}






