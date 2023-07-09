const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT users', () => {
let newID="";
var auth = {accessToken:""};

it("POST '/users/reg'", async () => {
    const res = await request(app)
    .post('/users/reg')
    .send({
        "name":"uCode Test",
        "email":"test@ucode.ai",
        "password":"123456"
    })
    expect(res.statusCode).toEqual(200)
    
})


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
it("POST '/users/'", async () => {
    const res = await request(app)
    .post('/users')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "firstName":"magna",
"password":"ucode1234",
"email":"aliquip@ucode.ai",
"mobile":"nostrud",
"country":"laboris",
"userType":"ipsum",
"lastName":"velit"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/users/'", async () => {
    const res = await request(app)
    .post('/users')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "firstName":"culpa",
"password":"ucode1234",
"email":"esse@ucode.ai",
"mobile":"laborum",
"country":"proident",
"userType":"irure",
"lastName":"deserunt"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/users/'", async () => {
    const res = await request(app)
    .get('/users?firstName=magna&email=aliquip@uc&mobile=nostrud&country=laboris&userType=ipsum&lastName=velit')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/users/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/users/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/users/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/users/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "firstName":"inclf",
"password":"ucode1234",
"email":"irure@ucode.ai",
"mobile":"cupidatat",
"country":"eiusmod",
"userType":"consectetur",
"lastName":"voluptate"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/users/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/users/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
