const { SHA256 } = require('crypto-js');
const jwt =require('jsonwebtoken');


/*------------Hashing to store password into DataBase------------- */
var password='koti123';
var hashPassword=SHA256(password+'somesecret').toString();
console.log('Normal Password : '+password);
console.log('Hashing Password : '+hashPassword);
console.log('------------------------------------------')

/*----------------JWT------------------------------*/
//create jwt without expiring time.
var data={
    id:'mkoteswararao08@gmail.com'
}
const token=jwt.sign(data,'koti');
console.log('token is : '+token);



//create jwt with expires in some time.
/** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js). 
 *  Eg: 60, "2 days", "10h", "7d"
 *  --> if we mention time inside the qoutes('') or string format then we need to mention '1h', '2d', '2 days'..etc
 *  --> suppose if we mention directly number then it will indicates seconds 60, 60*5 , 60 *60 ,....etc.
 */

const token2=jwt.sign({
    id:'mkoteswararao08@yahoo.com'
},'molabanti',{ expiresIn:60} )

console.log('token2 is : '+token2);

console.log(jwt.decode(token2));

/*
  --> Passing VerifyCallback is optional. 

  --> if we pass verifycallback then verification is done in Asynchronously. 
  --> Asynchronously verify given token using a secret or a public key to get a decoded token token - JWT 
      string to verify secretOrPublicKey - A string or buffer containing either the secret for HMAC algorithms,
      or the PEM encoded public key for RSA and ECDSA.

  --> if don't pass verifycallback then verification is done in Synchronously.
  --> Synchronously verify given token using a secret or a public key to get a decoded token token - JWT 
      string to verify secretOrPublicKey - Either the secret for HMAC algorithms,
      or the PEM encoded public key for RSA and ECDSA.      
*/
jwt.verify(token,'koti',(err,decode)=>{
    if(err){
        console.log('error occured while verify : '+err)
        console.log(err.message)
        console.log(err.name)
    }
    else{
        console.log('verfiy : ')
        console.log(decode)     
    }
});


const decoded=jwt.decode(token);
console.log('Decoded : ');
console.log(decoded);


jwt.sign( {userId : 'mkoteswararao'}, 'molabanti', { algorithm: "HS256", expiresIn:60*5}, (err,token)=>{
            if(err){
               console.log(err)
            }
            else{
                console.log(token)}
            }
 );

 /* -->using jwt 
       -> jwt can be send via URL, Post Request, HTTP Header.
       -> Fast Transmission
       -> token contains information about user.
       -> Avoiding query the database more than once.
          first time when user enter the loginid and password , it will checks with database. and 
          converts data into token, so from next request on words we won't check with database,
          we will verify token.
    --> JWT Format is:
           header.payload.signature      
    --> JWT contains three parts. they are 
          1) HEADER: ALGORITHM & TOKEN TYPE 
          2) PAYLOAD: DATA
          3) SIGNATURE
        1)=> It contains type of algorithm used and token type.
             ex: {
                     "alg": "HS256",
                     "typ": "JWT"
                 }
          => this part is converted using base64UrlEncode. and this is first part in jwt.
          => algorithm is used to generate signature. Based on this algorithm only 
             signature will be generated. 
          => the value of the “alg” key specifies which hashing algorithm is being used to create 
             the JWT signature component   
        2)=> It contains claims. claims are user details or additional metadata.
             ex:  {
                     "userId": "mkoteswararao08@gmail.com",
                     "iat": 1566800747,
                      "exp": 1566801047
                  }   
          => this part is also converted using base64UrlEncode. and this is second part in jwt.
        3)=> It is a combination of  base64 Header and base64 Payload with secret.
              ex:  HMACSHA256(
                        base64UrlEncode(header) + "." +
                        base64UrlEncode(payload),
                        secretcode   
                       ) 
          => signature algorithm
                   data = base64urlEncode( header ) + “.” + base64urlEncode( payload )
                   hashedData = hash( data, secret )
                   signature = base64urlEncode( hashedData )
          => What this algorithm does is base64url encodes the header and the payload created in steps 1 and 2. 
             The algorithm then joins the resulting encoded strings together with a period (.) in between them.
             In our pseudo code, this joined string is assigned to data.   
          => The data string is hashed with the secret key using the hashing algorithm specified in the JWT header.
          => The resulting hashed data is assigned to hashedData. 
             This hashed data is then base64url encoded to produce the JWT signature.   
    -->JWT VERIFY
         ->jwt.verify(token,'secretcode') method is going to verify whether the given token is 
           valid or not. 
         ->this method first forms signature using base64urlEncode header and base64urlEncode payload which 
           are present in token and with help of secretcode what we provided as a second parameter.
         ->After that it will checks both signatures. signature that is produced and signature present is token.
         ->suppose if some one changes expired token details like header or payload, based on this 
           signature of token will changes but they don't known the secret code. so if they sent that token
           to server, based on header, payload and secret code jwt.verify method will generates signature. 
           after that it will checks that signature with signature present inside the token. 
           they don't known the secret code so they can't produce right signature and place inside the
           token.
    --> It is important to understand that the purpose of using JWT is NOT to hide or obscure data
        in any way. The reason why JWT are used is to prove that the sent data was actually created 
        by an authentic source.   
    --> Since JWT are signed and encoded only, and since JWT are not encrypted,
        JWT do not guarantee any security for sensitive data.     
    --> Since the application(server) knows the secret key, when the user makes a JWT-attached API call 
        to the application, the application can perform the same signature algorithm as on the JWT. 
        The application can then verify that the signature obtained from it’s own hashing operation
        matches the signature on the JWT itself. 
        If the signatures match, then that means the JWT is valid which indicates that the API call 
        is coming from an authentic source. 
        Otherwise, if the signatures don’t match, then it means that the received JWT is invalid,
        which may be an indicator of a potential attack on the application.       
 */