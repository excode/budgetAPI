const request = require('supertest')
const app = require('../server')
const userInfo = require('./userInfo')
describe('END-POINT accountcategory', () => {
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
it("POST '/accountcategory/'", async () => {
    const res = await request(app)
    .post('/accountcategory')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "accountType":"labore",
"parentCategory":"exclf",
"category":"quis",
"isParentCategory":"false"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("POST '/accountcategory/'", async () => {
    const res = await request(app)
    .post('/accountcategory')
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "accountType":"laborum",
"parentCategory":"ullamco",
"category":"amet",
"isParentCategory":"false"
    })
    expect(res.statusCode).toEqual(200)
    newID=res.statusCode==200?res.body["id"]:"";
    
})
it("GET '/accountcategory/'", async () => {
    const res = await request(app)
    .get('/accountcategory?accountType=labore&parentCategory=exclf&category=quis&isParentCategory=false')
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
    
})

it("GET '/accountcategory/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .get('/accountcategory/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(200)
}else{
    console.log("**GET[ID] TEST HAS BEEN SKIPED")
}
    
})
it("PATCH '/accountcategory/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .patch('/accountcategory/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send({
        "accountType":"deserunt",
"parentCategory":"exclf",
"category":"officia",
"isParentCategory":"false"
    })
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**PATCH TEST HAS BEEN SKIPED")
    }
})

it("DELETE '/accountcategory/"+newID+"'", async () => {
    if(newID!=""){
    const res = await request(app)
    .delete('/accountcategory/'+newID)
    .auth(auth.accessToken, { type: 'bearer' })
    .send()
    expect(res.statusCode).toEqual(204)
    }else{
        console.log("**DELETE TEST HAS BEEN SKIPED")
    }
})

})
  
