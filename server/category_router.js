const jwt = require('jsonwebtoken');
const checkJwt = require('express-jwt');

module.exports = (dal) => {
    let express = require('express');
    let router = express.Router();
    const secret = "secret";



    router.get('/', (req, res) => {
        // Get all categories. Put category into json response when it resolves.
        dal.getCategories().then(categories => res.json(categories));
    });

    router.get('/:id', (req, res) => {
        let id = req.params.id;
        dal.getCategory(id).then(category => res.json(category));
    });



/*    router.post('/', checkJwt({secret: secret}), (req, res) => {
        let category = {
            category : req.body.category,
            books : req.body.books// books array
        };
        console.log(req.body);
        console.log("consolelog category" + category)
        dal.createCategory(category).then(newCategory => res.json(newCategory));
    });*/



    router.post('/signup', (req, res) => {
        User.find({username: req.body.username}, (err, user) => {
            console.log(user)
            if(user.length != 0){
                res.json({
                    message: 'User with this username already exists!'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(hash){
                        console.log(req.body.admin)
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            admin: req.body.admin
                        })
                        user.save();
                        res.json({
                            message: 'ok'
                        })
                    }
                })
            }
        })
    })
    router.post('/:id/', (req, res) => {
        // To add a hobby, you need the id of the category, and some hobby text from the request body.
        console.log(req.params.id, req.body.book)
/*        let book = {
            books:req.body.books
        };*/
        console.log("Category_router =" + req.body.books)
        dal.addBook(req.params.id, req.body.books)
            .then(updatedBook => res.json(updatedBook));
    });

    return router;
};