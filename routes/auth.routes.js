const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')
const Item = require('../models/Item.model')
const passport = require('passport');

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

            UserModel.create({
              name,
              email, 
              password: hashedPassword
            })
              .then(() => {
                    res.redirect('/')      
              })

          })      
      })
})

//......................SignIn.....................//

router.get('/signin', (req, res) => {
  
  res.render('auth/signin')
})

// router.post(
//   '/signin',
//   passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/signin'
//   })
// );

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

  
  // const {email, password} = req.body

  // UserModel.findOne({email: email})
  //   .then((userData) => {
          
  //         if (!userData) {
  //           res.status(500).render('auth/signin', {message: 'User does not exist'}) 
  //           return;
  //         }

  //         bcrypt.compare(password, userData.password)
  //           .then((result) => {
  //               //check if result is true
  //               if (result) {
                    
  //                   req.session.loggedInUser = userData 
  //                   res.redirect('/dashboard')
  //               }
  //               else {
  //                  res.status(500).render('auth/signin', {message: 'Passwords not matching'}) 
  //               }
  //           })
  //           .catch(() => {
  //             res.status(500).render('auth/signin', {message: 'Something went wrong. Try again!'}) 
  //           })
  //   })
// })


//...................LogOut...........................//


router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

//...................Dashboard...........................// 

router.get("/dashboard", (req,res,next) => {
  console.log('session: ', req.session)

  //TODO: LAUNCH QUERY TO SHOW USER NAME IN RENDERED VIEW
  res.render('users/dashboard', {userInSession: req.session.passport.user}); //changed from loggedInUser
})

//..............................................// 

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
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

router.get('/:userId/private-dashboard', ensureAuthenticated, (req, res, next) => {
  const { _id } = req.user;
  Item.find({ user: _id })
    .then((itemsFromDB => res.render('users/private-dashboard', { items: itemsFromDB })))
    .catch((err) => console.log(err))
});



module.exports = router;