const express= require('express');
const jwt = require('jsonwebtoken')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

let user = {
    id:'abcdefghhh123',
    email:'johnstone@gmail.com',
    password:'abhggggfrttyyhujkkklk'
}

const JWT_SECRET = 'AshaMBHAV...'

app.get('/' , (req, res) =>{
    res.send("Hello World!");
})

app.get('/forgot-password', (req, res, next) =>{
  res.render('forgot-password');
})

app.post('/forgot-password', (req, res, next) =>{
  const {email} = req.body;
  if(email !== user.email){
      res.send ("User not registered");
      return;
  }
   const secret = JWT_SECRET + user.password
   const payload ={
       email:user.email,
       id: user.id
   }
   const token = jwt.sign(payload, secret , {expiresIn: '15m'});
   const link = `http://localhost:3000/reset-password/${user.id}/${token}`
   console.log (link);
   res.render('password-sent');
});

app.get('/reset-password/:id/:token', (req, res, next) =>{
  const {id, token}  = req.params;
  if(id !== user.id){
      res.send('Invalid id')
      return;
  }
  const secret = JWT_SECRET + user.password
  try {
      const payload =  jwt.verify(token, secret);
      res.render('reset-password', {email: user.email})
  }
  catch(error){
      console.log(err.message);
      res.send(error.message);

  }
})

app.post('/reset-password:id/:token', (req, res, next) =>{
    const {id, token}  = req.params;
    const { password , password2} = req.body;


    if(id !== user.id){
        res.send('Invalid id');
        return;
    }

    const secret = JWT_SECRET + user.password
    try{

        const payload = jwt.verify(token, secret);
        user.password = password2;
        res.send(user);

    }
    catch(err){
        console.log(err.message);
        res.send(err.message);
    }

})


app.listen(3000 ,() =>{
    console.log("Server is running on port 3000")
})
