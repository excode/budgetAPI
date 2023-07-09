var cors = require('cors')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');        
const AuthorizationRouter = require('../authorization/routes.config');
const UsersRouter = require('../src/users/routes.config');
const CountryRouter = require('../src/country/routes.config');
const OrganizationRouter = require('../src/organization/routes.config');
const AccountcategoryRouter = require('../src/accountcategory/routes.config');
const AccountBookRouter = require('../src/accountBook/routes.config');
const BudgetallocationRouter = require('../src/budgetallocation/routes.config');
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});
        
    
app.use(cors({
    origin:['http://localhost:3000','http://localhost:8080'], 
    credentials:true
}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});
    

app.use(bodyParser.json())


    
function postTrimmer(req, res, next) {
    
    if (req.method === 'POST' || req.method === 'PATCH') {
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof(value) === 'string')
                req.body[key] = value.trim();
        }
    }
    if (req.method === 'GET') {
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof(value) === 'string')
                req.query[key] = value.trim();
        }
    }
    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,  uniqueSuffix+'.'+file.originalname)
    }
    })
    
const multerMid = multer({
    storage: storage,
    // dest: 'files/',
    limits: {
        // no larger than 5mb.
        fileSize: 2 * 1024 * 1024,
    },
    });
app.use(multerMid.single('uploadFile'));
app.use(postTrimmer);
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
CountryRouter.routesConfig(app);
OrganizationRouter.routesConfig(app);
AccountcategoryRouter.routesConfig(app);
AccountBookRouter.routesConfig(app);
BudgetallocationRouter.routesConfig(app);
app.use(express.static('uploads'))
module.exports = app;