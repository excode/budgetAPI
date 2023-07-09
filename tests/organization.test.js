const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT organization', () => {
let newID="";
var auth = {accessToken:""};

it("Login", async () => {
const login = await request(app)
    .post('/auth')
    .send({
        email: userInfo.email,
        password: userInfo.password
    });
    if(login.statusCode==201){
        auth = login.body;
        console.log(auth.accessToken);
    }
    expect(login.statusCode).toEqual(201)
})      
it("POST '/organization/'", async () => {
    const res = await request(app)
    .post('/organization')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"consequat",
"type":"consectetur",
"address":"Nisi id fugiat pariatur ullamco do non ullamco veniam id do esse culpa.",
"city":"excepteur",
"state":"excepteur",
"country":"exclf",
"logo":"",
"email":"laboris@ucode.ai9"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/organization/'", async () => {
    const res = await request(app)
    .post('/organization')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"anim",
"type":"utclf",
"address":"Consectetur qui minim dolore.",
"city":"adipisicing",
"state":"anim",
"country":"duis",
"logo":"",
"email":"do@ucode.ai3"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/organization/'", async () => {
    const res = await request(app)
    .get('/organization?name=consequat&type=consectetu&city=excepteur&state=excepteur&country=exclf&email=laboris@uc')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/organization/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/organization/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/organization/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/organization/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"sunt",
"type":"irure",
"address":"Aliquip non eiusmod tempor officia.",
"city":"consectetur",
"state":"veniam",
"country":"utclf",
"logo":"",
"email":"consequat@ucode.ai4"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/organization/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/organization/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
