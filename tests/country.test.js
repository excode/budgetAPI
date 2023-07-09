const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT country', () => {
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
it("POST '/country/'", async () => {
    const res = await request(app)
    .post('/country')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"dolor",
"code":"utclf",
"dialCode":"dolor"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/country/'", async () => {
    const res = await request(app)
    .post('/country')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"amet",
"code":"commodo",
"dialCode":"etclf"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/country/'", async () => {
    const res = await request(app)
    .get('/country?name=dolor&code=utclf&dialCode=dolor')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/country/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/country/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/country/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/country/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "name":"velit",
"code":"labore",
"dialCode":"anim"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/country/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/country/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
