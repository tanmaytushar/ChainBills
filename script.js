const express = require('express');
const path = require('path');
const port = 3000;
const app = express();
const zod = require('zod');
const mongoose = require('mongoose'); 
mongoose.connect("mongodb+srv://ttushar176:3ywCp2qGSi6ITZd1@ims.60bbhm5.mongodb.net/user_app")
const bcrypt = require('bcrypt');






// middleware for parsing json body
app.use(express.json());
// Serve static files from the 'static' directory
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
    const htmlFilePath = path.join('static', 'index.html');
    const cssFilePath = path.join('static', 'styles.css');

    // Read the contents of the CSS file
    const cssContent = require('fs').readFileSync(cssFilePath, 'utf8');
    

    // Send the HTML file along with the CSS content
    res.send(`
        <html>
            <head>
                <style>${cssContent}</style>
            </head>
            <body>
                ${require('fs').readFileSync(htmlFilePath, 'utf8')}
            </body>
        </html>
    `);
});



const userSchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    bname: zod.string(),
    baddress : zod.string(),
    number: zod.string().refine((value) => value.length === 10, {
        message: 'Number must be exactly 10 characters long',
    }),
    
});
const userSchemalogin = zod.object({
    email: zod.string().email(),
    password: zod.string()
});


const User = mongoose.model('Users',{
    email : String,
    password: String,
    bname: String,
    baddress : String,
    number : Number,
    
});

const Pdf = mongoose.model('Pdfs',{
    email : String,
    pdfname  : String,
    pdfdata : String,
});

app.post('/storepdf',async function(req,res){
    
    const email = req.body.email;
    const pdfname = req.body.pdfname;
    const pdfdata = req.body.pdfdata;
    const pdf = new Pdf({
        email : email,
        pdfname : pdfname,
        pdfdata : pdfdata
    });
    await pdf.save();
    res.status(201).json({
        message : "PDF saved successfully",

    })
});



app.post('/signup',async function(req,res){
    try{
        
        const userData = userSchema.safeParse(req.body);
        if(userData.success)
        {
            const email = req.body.email;
            const password = req.body.password;
            const bname = req.body.bname;
            const baddress = req.body.baddress;
            const number = req.body.number;
            
            const existingUser = await User.findOne({ email : email });
            if(existingUser){
                return res.status(209).json({
                    message: "email already exits",
                    
                });

            }
            const hashedPassword = await bcrypt.hash(password,10);
            const user = new User({
                email : email,
                password: hashedPassword,
                bname : bname,
                baddress : baddress,
                number : number,
                
            });
            
            await user.save();
            res.status(201).json({
                message: "User created successfully",
                
            });

        }
        else{
            
            res.status(211).json({ message: 'Invalid data provided' });
        }

        
        
    }catch(error){
        
        res.status(500).json({error:'Internal server error'});
    }


});

app.post('/login',async function(req,res){
    try{
        
        const userData = userSchemalogin.safeParse(req.body);
        if(userData.success)
        {
            const email = req.body.email;
            const password = req.body.password;
            const existingUser = await User.findOne({ email : email });
            if(existingUser){
                
                const isPasswordValid = await bcrypt.compare(password, existingUser.password);
                if(isPasswordValid)
                {
                    res.status(201).json({
                        message: "Login verified",
                    });

                }
                else{
                    res.status(211).json({ 
                        message: "Invalid Credentials"
                    }); 
                }
                


            }
            else{
                res.status(211).json({ 
                    message: "Invalid Credentials"
                });
            }
            

        }
        else{
            
            res.status(211).json({ message: "Invalid Credentials"});
        }

        
        
    }catch(error){
        
        res.status(500).json({error:'Internal server error'});
    }


});

app.get('/api/user', async function (req, res) {
    
    const email = req.query.email;
    const user = await User.findOne({ email: email });
    if (user){
        res.json({
            email : user.email,
            bname: user.bname,
            baddress: user.baddress,
            number: user.number
        });
    } 
    
});

app.post('/api/pdfdata', async function(req, res) {
    const email = req.body.email;
    const pdfs = await Pdf.find({ email: email });
    if (pdfs.length > 0) {
        const pdfArray = pdfs.map(pdf => ({
            email: pdf.email,
            pdfname: pdf.pdfname,
            pdfdata: pdf.pdfdata
        }));
        res.json(pdfArray);
    } else {
        res.json({ message: 'No PDFs found for the given email.' });
    }
});

const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.json());

app.post('/pdfwrite', async function (req, res) {
    try {
        const { pdfContent } = req.body;
        fs.writeFileSync('./static/dynamic/pdf.html', pdfContent);
        res.json({ message: 'PDF content written to pdf.html successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port);





