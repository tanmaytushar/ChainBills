document.addEventListener("DOMContentLoaded", function () {
    
    const userPDF = JSON.parse(sessionStorage.getItem("userPDF")) || [];

    
    const pdfContainer = document.getElementById("pdf-container");

    // Loop through the userPDF array and generate HTML dynamically
    userPDF.forEach(function (pdfObject, index) {
        const div = document.createElement("div");
        div.classList.add("inside-container");

        
        div.innerHTML = `
           
                <div class ="invoice-upper-container">
                    <div class="serial-number-class" id="serial-number">${index + 1}.</div>
                    <div class="invoice-name-class" id="invoice-name">${pdfObject.pdfname}</div>
                    <button class="view-pdf-button" data-index="${index}">
                        <img src="pdf-logo-pink.png"  style="width: 40px;">
                    </button>
                </div>
                
            
        `;

        pdfContainer.appendChild(div);
    });

    
    const viewPdfButtons = document.querySelectorAll(".view-pdf-button");
    viewPdfButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const index = button.getAttribute("data-index");
            openPdfPage(userPDF[index]);
        });
    });
});

function openPdfPage(pdfObject) {
   
    const pdfContent = `
    
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice</title>
    <link rel="stylesheet" href="/static/invoice/invoice.css">
    <script src="/static/invoice/invoice.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    
</head>
<body>
    
    <div id ="content_container">

        ${pdfObject.pdfdata}
    </div>
    <div class="download-div">
        <button class = "download-button">
            <i class="ri-file-download-fill"></i>
        </button>
    </div>

    
    
    
</body>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const userAddressDiv = document.getElementById('userAddress');

        // Retrieve data from sessionStorage
        const userDataString = sessionStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            
            // Set the inner HTML of the userAddress div with the user data
            userAddressDiv.innerHTML = \`
                    <p>\${userData.bname}</p>
                    <p>\${userData.baddress}</p>
                    <p>\${userData.number}</p>
                \`;
        }
        const downloadButton = document.querySelector('.download-button');
        var contentContainer = document.getElementById('content_container');
        

        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        var randomFileName = 'invoice_' + Date.now() + '_' + generateRandomString(5) + '.pdf';
        
        
        downloadButton.addEventListener('click', function () {
            
            html2pdf(contentContainer, {
                margin: 15,
                filename: randomFileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            }).from(contentContainer).outputPdf();
        });

            



    })
    
</script>

</html>
    `;
    fetch('/pdfwrite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfContent }),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(error => Promise.reject(error));
            }
        })
        .then(data => {
            console.log('PDF content sent to the backend successfully:', data);
            window.location.href = 'pdf.html';
        })

    

    
}


