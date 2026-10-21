

const cds=require('@sap/cds')
const ax= require('axios')
require('dotenv').config()                    //Which is a .env file

module.exports=cds.service.impl(async function(){

  
function getToken(){
    let token= ax.post(
        "https://69ce3fbftrial.authentication.us10.hana.ondemand.com/oauth/token",
        "grant_type=client_credentials",
        {
            header :{"Content-Type":"application/x-www-form-urlencoded"},          //URL is sending
            auth :{
                username : process.env.client_id,                                  // we can only access using process.env
                password : process.env.client_secret          
            }
        }

    )

    return token
}

})
