

const cds=require('@sap/cds')
const ax= require('axios')
require('dotenv').config()                    //Which is a .env file

module.exports=cds.service.impl(async function(){

  
async function getToken(){
    let token= await ax.post(
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

    return res.data.access_token;
}

async sendNotification(){
    let send= ax.post(
        process.env.url,

        {
            eventType : "Singleperson",
            subject :  "Regarding For Onboard",
            severity : "Hello",
            category : "",

            body : `hi , this is im . Nice to meeting you `

            resource:{
                resourceName : "ourApplicationName",
                resourceType : "Some Name"
            }

            tags :{   // want more things to daiplsy . like link at all use these

            }

        },
        {
            headers :{
                Authorization :`Bearer${token}`,
                "Content-Type" : "application/json"
            }
        }
    )
}


})
