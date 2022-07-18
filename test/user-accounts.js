const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

describe('User Signup', () => {
    it('should have added the user on POST /addUser', async() => {
        var userInfo = {
            f_uname: "appTester123",
            f_firstName: "Mx.",
            f_lastName: "Tester",
            f_age: 50,
            f_pwd: "testpwd123",
        }
        var res = await chai.request(server).post("/addUser").send(userInfo);
        res.should.have.status(201);
    });

    // TODO: write test for failed userAdd? (status 500)
});

describe('User Login', () => {
    it('should successfully log in on POST /verify-login', async() => {
        var userInfo = {
            f_uname: "appTester123",
            f_pwd: "testpwd123",
        }
        var res = await chai.request(server).post("/verify-login").send(userInfo);
        res.should.have.status(200);
        // TODO: check for cookie
    })

    it('should fail to log in on POST /verify-login', async() => {
        var userInfo = {
            f_uname: "randomStranger",
            f_pwd: "wrongPassword",
        }
        var res = await chai.request(server).post("/verify-login").send(userInfo);
        res.should.have.status(401);
    })
})

// TODO: can users access features when not logged in?
// TODO: user logout