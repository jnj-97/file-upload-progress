const {Web3Storage,getFilesFromPath}=require('web3.storage')
const path=require('path')
const fs=require('fs')
require('dotenv').config()
class IPFS{
    
    async uploadImage(filepath){
        return new Promise(async (resolve,reject)=>{
            try{
                // const bufferImage = Buffer.from(base64string.split(";base64,")[1], "base64");
                // const tempPath = path.join(__dirname, "temp.png");
                // fs.writeFileSync(tempPath, bufferImage);
                const storage=new Web3Storage({token:process.env.WEB3_TOKEN})
                const file=await getFilesFromPath(filepath)
                const cid=await storage.put(file,{wrapWithDirectory:false})
                fs.unlinkSync(filepath);
                resolve(cid)
            }
            catch(err){
                reject(err)
            }
        })
    }
    
    async deleteImage(cid){
        return new Promise(async(resolve,reject)=>{
            try{
            const storage=new Web3Storage({token:process.env.WEB3_TOKEN})
            await storage.delete(cid);
            resolve()
            }
            catch(err)
            {
                reject(err)
            }
        })
    }
    
}
module.exports=IPFS
 