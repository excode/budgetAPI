const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT accountbook', () => {
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
it("POST '/accountbook/'", async () => {
    const res = await request(app)
    .post('/accountbook')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "particular":"mollit",
"receiptNo":"nisi",
"amount":"1",
"category":"quiclf",
"memo":"Ex quis laboris duis laborum exercitation consectetur duis incididunt et non id nulla veniam est."
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/accountbook/'", async () => {
    const res = await request(app)
    .post('/accountbook')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "particular":"reprehenderit",
"receiptNo":"voluptate",
"amount":"1",
"category":"enim",
"memo":"Reprehenderit sunt veniam et aliquip mollit nulla consectetur."
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/accountbook/'", async () => {
    const res = await request(app)
    .get('/accountbook?organization=deserunt&particular=mollit&receiptNo=nisi&amount=1&category=quiclf&memo=Ex quis la')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/accountbook/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/accountbook/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/accountbook/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/accountbook/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "particular":"dolore",
"receiptNo":"aliqua",
"amount":"1",
"category":"sint",
"memo":"Lorem ex in tempor voluptate ipsum adipisicing ipsum exercitation quis."
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/accountbook/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/accountbook/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
