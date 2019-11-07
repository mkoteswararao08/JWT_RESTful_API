const mysql=require('mysql');
const jwt=require('jsonwebtoken');
var connection=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Koti123@',
    database : 'node_db', 
});

connection.connect(function(err) {         //passing callback is optional. we can call connection.connect() also.
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });


exports.add=function (req,res){
     console.log('post method');
     console.log(req.body)
    var id=req.body.id;
    var name=req.body.name;
    var age=req.body.age;
    // var email=req.body.email;
    // var password=req.body.password;
    var user={
        id:id,
        name:name,
        age: age 
    } 
    connection.query('INSERT INTO user SET ?',user, function(error, results, fields){   
        if (error){
            throw error;
            res.send();
        } 
        else{
            console.log("added rows are : "+results.affectedRows);
            res.send(user);
      }              
    });


    /*-------if you want to check authorization only for one api(may be at insertion only)*/
    // // check for basic auth header
    // if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    //     return res.status(401).json({ message: 'Missing Authorization Header' });
    // }

    // // verify auth credentials
    // const base64Credentials =  req.headers.authorization.split(' ')[1];
    // const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    // console.log('credentials-->', credentials)
    // const [username, password] = credentials.split(':');
    
    // validation(username,password,callback);
//     function callback(userresult){
//         if(userresult){
//             connection.query('INSERT INTO user SET ?',user, function(error, results, fields){   
//                 if (error){
//                     throw error;
//                     res.send();
//                 } 
//                 else{
//                     console.log("added rows are : "+results.affectedRows);
//                     res.send(user);
//                 }
//            });
//         }
//         else{
//             res.send('Authorization Header is wrong'); 
//         }     
//    }
}

exports.update = function updateUser(req,res){
    var id=req.params.id;
    var name=req.body.name;
    var age=req.body.age;
    connection.query('UPDATE user SET name = ?, age= ? WHERE id = ?',[name,age,id], function (error, results, fields) {
        if (error) {
            throw error;
        }
        else{
            console.log("updated rows are :"+results.affectedRows); 
            console.log("updated User is :");
            console.log(req.body) 
            res.send(req.body); 
        } 
      });
}

exports.retrieve=function retrieveUser(req,res){
    
       connection.query('select * from user',function (error, results, fields) {
            if (error){
               throw error;
            }
            else{    
               var userlist= JSON.parse(JSON.stringify(results))
               console.log('The Retrieve users are: ', JSON.parse(JSON.stringify(results)));
            //    res.send(userlist);  
               res.send(results);              
            }
      });
}

exports.Singleretrieve=function retrieveSingleUser(req,res){
     var id = req.params.id;
    connection.query('select * from user where id = ?',[id],function (error, results, fields) {
         if (error){
            throw error;
         }
         else{    
            console.log('The Retrieve user is: ', JSON.parse(JSON.stringify(results)));  
            res.send(results);              
         }
   });
}

exports.delete=function deleteUser(req,res){
    var id=req.params.id;
    console.log(req.params);
    console.log("deleted user id : "+id);
    connection.query('DELETE FROM user WHERE id =?',[id],function (error, results, fields) {
        if (error){
            throw error;
        }
        else{
            console.log('Number of Rows deleted : '+results.affectedRows);
            res.send(req.params);     
        }
      });  
}

exports.register=function registerUser(req,res){ 
   var user={
    userId:req.body.email,
    password:req.body.password,
    role:req.body.role
   } 
   connection.query('INSERT INTO login_table SET ?',user, function(error, results, fields){   
        if (error){
            throw error;
            res.send();
        } 
        else{
            console.log("added rows are : "+results.affectedRows);
            res.send(user);
        }
    });
}

exports.validate=function validation(req,res){
    email=req.body.email;
    password=req.body.password;
    connection.query('select * from login_table where userId= ? AND  password=?',[email,password],function (error, results, fields) {
        if (error){
           throw error;
        }
        else{  
            if(results.length==0){
                console.log('The Retrieve user is: ', JSON.parse(JSON.stringify(results)));  
                res.json({
                    success: false,
                    message: 'Authorization is Invalid'
                    });
            }
            else{
            console.log('The Retrieve user is: ', JSON.parse(JSON.stringify(results)));
            var token=jwt.sign({userId: results[0].userId, role:results[0].role},'molabanti',{ algorithm: "HS256",expiresIn:'60min'});
            res.json({
                success: true,
                message: 'Authentication successful!',
                token: token
                   });
            }        
        }
    });
}