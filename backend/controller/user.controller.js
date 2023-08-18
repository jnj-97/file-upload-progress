const AuthMiddleWare = require("../services/auth.service");

class User
{
    async authenticate(req,res)
    {
        try 
        {
            const {email}=req.body;
            if(!email)
            {
                return res.status(404).send('Email not found');
            }
            const token=await AuthMiddleWare.prototype.jwtToken(email);
            res.json({token});
        } catch (error) 
        {
            console.log(error);
            res.status(500).send('internal server error');
        }
    }
    async Profile(req,res)
    {
        try 
        {
            res.json({profile:req.user});    
        } catch (error) {
            console.log(error);
            res.status(500).send('internal server error');
        }
    }
}
module.exports=User;