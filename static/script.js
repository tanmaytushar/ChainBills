
// handles login logic
function handlelnButtonClick(){
    var useremail = document.getElementById('emailInput').value;
    var userpassword = document.getElementById('passwordInput').value;
    var userData = {
        email : useremail,
        password : userpassword
    };
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
            
        },
        body: JSON.stringify(userData) // Convert the object to JSON format
    })
    .then(response => {
        // for sucessful response code 200-299
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(error => Promise.reject(error));
        }
    })
    .then(data => {
        // to be changed later to userhomepage
        if(data.message === "Login verified"){
            sessionStorage.setItem('useremail',useremail);
            window.location.href ='/static/homepage.html';
        }
        else{
            alert("Invalid Credentials Retry");
        }
        
    })
    .catch(error => {
        console.error('Error during fetch:', error);
        
    });

    
    
}
// handles signup logic
function handlesuButtonClick(){
    var useremail = document.getElementById('emailInput').value;
    var userpassword = document.getElementById('passwordInput').value;
    var userbname = document.getElementById('bnameInput').value;
    var userbaddress = document.getElementById('baddressInput').value;
    var usernumber = document.getElementById('numberInput').value;
    
    var userData = {
        email: useremail,
        password: userpassword,
        bname : userbname,
        baddress : userbaddress,
        number : usernumber,
        
    };
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
            
        },
        body: JSON.stringify(userData) // Convert the object to JSON format
    })
    .then(response => {
        // for sucessful response code 200-299
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(error => Promise.reject(error));
        }
    })
    .then(data => {
        
        if(data.message === "User created successfully"){
            sessionStorage.setItem('useremail', useremail);
            window.location.href ='/static/homepage.html';
        }
        else if(data.message === "email already exits"){
            alert("User already exists with the provided email. Try logging in.")
        }
        else if(data.message === "Invalid data provided"){
            alert("Invalid details");
        }
    })
    .catch(error => {
        console.error('Error during fetch:', error);
        
    });
    
    
}
// handles generate pdf
function handleGeneratePDF(){
    const useremail = sessionStorage.getItem('useremail');
    fetch(`/api/user?email=${useremail}`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(error => Promise.reject(error));
        }
    })
    .then(data => {
        // Handle the retrieved user data as needed
        console.log(data);
        sessionStorage.setItem('userData', JSON.stringify(data));
        window.location.href = '/static/invoice/invoice.html';
    });
    
}

function handleviewInvoices() {
    const useremail = sessionStorage.getItem('useremail');

    fetch('/api/pdfdata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: useremail }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch data');
        }
    })
    .then(data => {
        
        sessionStorage.setItem('userPDF', JSON.stringify(data));
        window.location.href = '/static/dynamic/data.html';
    })
    .catch(error => {
        console.error('Error:', error);
        
    });
}
//purchase order
function handlepurchaseOrder(){
    const useremail = sessionStorage.getItem('useremail');
    fetch(`/api/user?email=${useremail}`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(error => Promise.reject(error));
        }
    })
    .then(data => {
        // Handle the retrieved user data as needed
        console.log(data);
        sessionStorage.setItem('userData', JSON.stringify(data));
        window.location.href = '/static/purchase/purchase.html';
    });
    
}


