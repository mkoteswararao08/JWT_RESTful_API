const express=require('express');
const app=express();
var curd=require('./crud_operations');
const bodyParser=require('body-parser');
const cors=require('cors');
const jwt=require('jsonwebtoken');
app.use(cors());

const port= process.env.PORT || 3001 ;

// app.use(express.static('D:/Visual_Studio_Code/NodeJs/Node_RESTful_API/angular-Node-BaseApp'))
app.use(bodyParser.urlencoded({extended:false }));
app.use(bodyParser.json());

app.post('/api/register',curd.register);

app.post('/api/login', curd.validate);


function checkToken(req,res,next){
    if(!req.headers.authorization || req.headers.authorization.indexOf('Bearer ')===-1){
        return res.status(401).send({
            success: false,
            message: 'Auth token is not supplied'
          });
    }

    const token=  req.headers.authorization.split(' ')[1];
    jwt.verify(token,'molabanti',(err,decoded)=>{           //
         if(err){
            console.log('error occured while verify : '+err)
            console.log(err.message)
            console.log(err.name)
             res.send({
                success: false,
                message: 'Token is not valid',
                error:err
                 })
         }else{
             console.log('token after decoded is : ')
             console.log(decoded);
             next();
         }
    })
}

app.use(checkToken);

app.get('/',(req,res)=>{
    console.log("this is the way to get query parameters present in url:"+req.query.id);
    res.send('Hi Node RESTful_API');
})

app.post('/api/addUser',curd.add);

app.get('/api/user', curd.retrieve);

app.get('/api/user/:id', curd.Singleretrieve);

app.delete('/api/delete/:id', curd.delete);

app.put('/api/update/:id',curd.update);



app.listen(port,()=>{console.log(`Example app listening on port ${port}!`)});

