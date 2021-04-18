var express = require('express');
var router = express.Router();

// thay the duong dan mongo cua cac ban
var urlDB = 'mongodb+srv://admin:admin@cluster0.9q4s9.mongodb.net/Tinder?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected!!!!')
});

var multer = require('multer')
var path = 'uploads/'
var upload = multer({dest: path})
// username
// password
// name
// address
// number_phone

var user = new mongoose.Schema({
    name: String,
    date: String,
    sex: String,
    phone: String,
    hobby: String,
    avatar: String
})

/* GET home page. */
router.get('/',function(request,reponse){
    reponse.render('index');
});

router.get('/user', function (req, res, next) {
    // ket noi toi collection ten la users
    var connectUsers = db.model('users', user);
    connectUsers.find({},
        function (error, user) {
            if (error) {
                console.log(error)
                res.render('user', {title: 'Express : Loi'})
            } else {
                res.render('user', {title: 'Express', users: user})
            }
        })
});

// router.get('/user', function (req, res, next) {
//     // ket noi toi collection ten la users
//     var connectUsers = db.model('users', user);
//     connectUsers.find({},
//         function (error, user) {
//             if (error) {
//                 console.log(error)
//                 res.render('index', {title: 'Express : Loi'})
//             } else {
//                 data = '<table border="1" style="border-collapse:collapse" cellspacing="5" cellpadding="15">';
//                 data += '<tr>' +
//                     '<th>Avatar</th>' +
//                     '<th>Name</th>' +
//                     '<th>Date</th>' +
//                     '<th>Sex</th>' +
//                     '<th>Number Phone</th>' +
//                     '<th>Hobby</th>' +
//                     '</tr>';
//                 user.forEach(function (row) {
//                     data += '<tr>';
//                     data += '<td>' + row.avatar + '</td>';
//                     data += '<td>' + row.name + '</td>';
//                     data += '<td>' + row.date + '</td>';
//                     data += '<td>' + row.sex + '</td>';
//                     data += '<td>' + row.phone + '</td>';
//                     data += '<td>' + row.hobby + '</td>';
//                     data += '</tr>';
//                 });
//                 data += '</table>';
//                 res.writeHead(200, {'Content-Type': 'text/html'});
//                 res.end(data);
//                 res.render('index', {title: 'Express', users: user})
//             }
//         })
// });


let baseJson = {
    errorCode: undefined,
    errorMassage: undefined,
    data: undefined
}

router.get('/getUsers', function (req, res){
    var connectUser = db.model('users', user);
    connectUser.find({},
        function (error, users){
        if (error){
            baseJson.errorCode = 400
            baseJson.errorMassage = error
            baseJson.data = []
        } else {
            baseJson.errorCode = 200
            baseJson.errorMassage = ' Thanh Cong'
            baseJson.data = users
        }
        res.send(baseJson)
        })
})

router.post('/addusers', upload.single('avatar'), function (req, res) {
    console.log(req.body);
    var connectUsers = db.model('users', user);
    connectUsers({
        name: req.body.name,
        date: req.body.date,
        sex: req.body.sex,
        phone: req.body.phone,
        description: req.body.description,
        hobby: req.body.hobby,
        avatar: req.file.filename + '.jpg'
    }).save(function (error) {
        if (error) {
            res.render('addusers', {title: 'Express Loi!'});
        } else {
            res.render('addusers', {title: 'Express Thanh Cong'});
        }
    })
})

router.post('/delete', function (req, res) {
    var connectUsers = db.model('users', user);
    console.log(req.body._id)
    connectUsers.remove({ _id: req.body._id }, function (err) {
        if (err) {
            console.log(err)
        }
        else {
            connectUsers.find({},
                function (error, user) {
                    if (error) {
                        console.log(error)
                        res.render('user', {title: 'Express : Loi'})
                    } else {
                        res.render('user', {title: 'Express', users: user})
                    }
                })
        }
    })

})

// router.put('/user', function (req, res){
//     var deleteUsers = db.model('users', user);
//     deleteUsers.deleteOne({ _id: req.body._id }, function (err, user) {
//         console.log("Deleted");
//         res.redirect("/users");
//     });
// })

// router.put('/user', function (req, res){
//     var updateUsers = db.model('users', user);
//         updateUsers.findById(req.params._id);
//         updateUsers.set(req.body);
//         var result = updateUsers.save();
//         res.send(result);
//     if (error) {
//         res.status(500).send(error);
//     }
// });
//
// router.delete('/user', function (req, res) {
//         var deleteUsers = db.model('users', user);
//         deleteUsers.deleteOne({ _id: req.params._id }).exec();
//         response.send(deleteUsers);
//     if (error) {
//         res.status(500).send(error);
//     }
// });

module.exports = router;
