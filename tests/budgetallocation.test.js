const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT budgetallocation', () => {
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
it("POST '/budgetallocation/'", async () => {
    const res = await request(app)
    .post('/budgetallocation')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "organization":"nonclf",
"fiscalyear":"2024-06-24T09:54:50.796Z",
"allcocatedAmount":"4.97",
"memo":"Nulla deserunt commodo culpa reprehenderit velit eu officia est.",
"category":"enim"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/budgetallocation/'", async () => {
    const res = await request(app)
    .post('/budgetallocation')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "organization":"exercitation",
"fiscalyear":"2024-06-24T09:54:50.796Z",
"allcocatedAmount":"6.26",
"memo":"Anim minim amet ea id duis culpa aliqua.",
"category":"Lorem"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/budgetallocation/'", async () => {
    const res = await request(app)
    .get('/budgetallocation?organization=nonclf&fiscalyear=2024-06-24&allcocatedAmount=4.97&memo=Nulla dese&category=enim')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/budgetallocation/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/budgetallocation/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/budgetallocation/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/budgetallocation/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "organization":"anim",
"fiscalyear":"2024-06-24T09:54:50.797Z",
"allcocatedAmount":"2.79",
"memo":"Irure pariatur culpa laborum sint incididunt proident velit velit consequat nisi cupidatat cupidatat.",
"category":"anim"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/budgetallocation/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/budgetallocation/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
