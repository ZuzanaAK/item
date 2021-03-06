const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
const User = require('../models/User.model')
const Item = require('../models/Item.model')
const passport = require('passport');
const nodemailer = require('nodemailer');


//......................SignUp.....................//

router.get('/signup', (req, res) => {
    
    res.render('auth/signup')
})


router.post('/signup', (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
      res.status(500).render('auth/signup', {message: 'Please enter all details'})
      return;
    }

    let emailReg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    if (!emailReg.test(email)) {
      res.status(500).render('auth/signup', {message: 'Please enter a valid email'})
      return;
    }
  

    let passwordReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
    if (!passwordReg.test(password)) {
      res.status(500).render('auth/signup', {message: 'Password must have one lowercase, one uppercase, a number, a special character and must be atleast 8 digits long'})
      return;
    }

    bcrypt.genSalt(10)
      .then((salt) => {

        bcrypt.hash(password, salt)
          .then((hashedPassword) => {

            User.create({
              name,
              email, 
              password: hashedPassword
            })
              .then(() => {
                    sendWelcomeEmail(email);
                    res.redirect('/welcomeMessage')      
              })

          })      
      })
})

//......................SignIn.....................//

router.get('/signin', (req, res) => {
  
  res.render('auth/signin')
})


router.post('/signin', (req, res, next) => {

  passport.authenticate('local', (err, user, failureDetails) => {
    
    if(err) {
      return netx(err);
    }

    if (!user) {
      res.render('auth/signin', {message: 'Wrong password or username'});
      return;
    }

    

    req.login(user, err => {
      if(err) {
        return next(err);
      }
      res.redirect('/dashboard');
    });

  })(req, res, next);
});

/////////////////////////////////////////////////////
//////////     Social login: Google    //////////////
/////////////////////////////////////////////////////

router.get(
  '/signin/google',
   passport.authenticate("google",
   {
     scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
     ]
    })
    );


router.get('/signin/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin/googleLoginFailure',scope: ['profile', 'email'], prompt: 'select_account' }  ),
  function(req, res) {
    res.redirect('/');
  });



router.get("/signin/googleLoginFailure", (req, res) => {
  res.render("auth/googleFailure")
});



//...................LogOut...........................//

router.post('/logout', (req, res) => {
  console.log("pre", req.session);
  req.session.destroy();
  console.log("post", req.session);
  res.redirect('/signin'); 
});

//...................Dashboard...........................// 


router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  const { _id } = req.user;
  
  let profileOwner = false;

  if ( req.session.passport.user) {
    userInSession = true;
  }

  if ( req.session.passport.user === req.params.userId ) {
    profileOwner = true;
  }
  
  Item.find({ user: _id })
    .then((itemsFromDB => 
        res.render('users/dashboard', { items: itemsFromDB, profileOwner: profileOwner, userInSession: userInSession })))

    .catch((err) => console.log(err))
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // The user is authenticated
    // and we have access to the logged user in req.user
    return next();
  } else {
    res.redirect('/signin');
  }
}


router.get('/profile', ensureAuthenticated, (req, res, next) => {

  const { _id } = req.user;

  console.log(_id)
  
  let profileOwner = false;

  if ( req.session.passport.user ) {
    userInSession = true;
  }

   
  if ( req.session.passport.user == req.user._id ) {
    
    profileOwner = true;
  }
  
  User.findOne({ _id: _id })
    .then(userFromDB => {
      console.log(userFromDB);
      res.render('users/profile', { user: userFromDB, profileOwner: profileOwner, userInSession: userInSession })
    })
    .catch((err) => console.log(err))
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // The user is authenticated
    // and we have access to the logged user in req.user
    return next();
  } else {
    res.redirect('/signin');
  }
}

//.................Profile-Edit............................//

router.get("/profile-edit", ensureAuthenticated, (req,res,next) => {

  const { _id } = req.user;

  console.log(_id)
  
  let profileOwner = false;

  if ( req.session.passport.user ) {
    userInSession = true;
  }

   
  if ( req.session.passport.user == req.user._id ) {
    
    profileOwner = true;
  }

  User.findOne({ _id: _id })

  .then(userFromDB => {
    console.log(userFromDB);
    res.render('users/profile-edit', {userFromDB: userFromDB, profileOwner: profileOwner, userInSession: userInSession });
  })
  .catch((err) => console.log(err))
});

//...................Verification...........................// 

router.get("/welcomeMessage", (req,res,next) => {
  res.render('auth/welcomeMessage');
})


//..............................................// 




//-----------------------------------------
//Function to send the welcome email
// ----------------------------------------

function sendWelcomeEmail(emailAddress) {

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'itemmlradm@gmail.com',
      pass: process.env.NODEMAILERPASS
    }
  })

  transporter.sendMail({
    from: '".item team " <itemmlradm@gmail.com>',
    to: emailAddress,
    subject: 'Welcome Email',
    text: 'welcome',
    html: 
    `<h2>Welcome to our .item family!</h2>
    <p>Thank you for joining us. Now, you can give a second life to all the things you are not using anymore!</p>
    <p>If you have any questions or feedback, please, contact our admin team.</p>
    <div>
    <img width="80px" src="https://res.cloudinary.com/dhvc31ofm/image/upload/v1609870538/gbtcnhn1nel7zlwsryx5.png" alt="logo">
    </div>`
  })
  .then(info => console.log(info))
  .catch(err => console.log(err));
}



module.exports = router;