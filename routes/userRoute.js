var express = require('express');
var router = express.Router();

var userCtrl = require('../controllers/userCtrl.js');

/* GET users listing. */
router.get('/validate', function(req, res, next) {
    var _userId = req.session._userId;
    if(_userId){
        userCtrl.findUserById(_userId,function(err,user){
            if(err){
                console.log(err);
                res.json({code:500,data:"服务端报错"});
            } else {
                res.json({code:1,data:user});
            }
        })
    } else {
        res.json({code:0,data:"用户未登陆"});
    }
});

router.post('/login',function(req,res,next){
    var email = req.body.email;
    if(email){
        userCtrl.findByEmailOrCreate(email,function(err,user){
            if(err){
                console.log(err);
                res.json({code:500,data:"服务端报错"});
            } else {
                req.session._userId = user._id;
                userCtrl.online(user._id,function(err,user){
                    if(err){
                        console.log(err);
                        res.json({code:500,data:"服务端报错"});
                    } else {
                        res.json({code:1,data:user});
                    }
                })
            }
        })
    } else {
      res.json({code:0,data:"邮箱不能为空"});
    }
});

router.get('/logout',function(req,res,next){
    var _userId = req.session._userId;

    userCtrl.offline(_userId,function(err,user){
        if(err){
            res.json({code:500,data:"服务端报错"});
        } else {
            // req.session._userId = null;
            delete req.session._userId;
            res.json({code:1});
        }
    })
});

module.exports = router;
