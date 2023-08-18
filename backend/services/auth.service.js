const JWT=require('jsonwebtoken');
class AuthMiddleWare
{
    jwtToken(email)
    {
        return new Promise(function(reslove,reject)
        {
            try 
            {
                const payload={email};
                JWT.sign(payload,(process.env.JWT_SECRET),{expiresIn:3600},
                (err,token)=>
                {
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        reslove(token);
                    }
                })
            } 
            catch (error) 
            {
                reject(error)
            }
        })
    }
}
module.exports=AuthMiddleWare;