const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

// TODO: check request object somehow?
// e.g. req.should.have.param(parameter)

describe("User Signup", () => {
  it("should have added the user on POST /addUser", () => {
    var userInfo = {
      f_uname: "appTester123",
      f_firstName: "Mx.",
      f_lastName: "Tester",
      f_age: 50,
      f_pwd: "testpwd123",
    };
    
    var agent = chai.request.agent(server);
    agent
      .post("/addUser")
      .send(userInfo)
      .then((res) => {
        res.should.have.cookie("persongify_auth");
        res.should.have.status(302);
        res.should.redirect;
      })
    agent.close();
  });

  // TODO: write test for failed userAdd? (status 500)
});

describe("User Login", () => {
  it("should successfully log in on POST /verify-login", async () => {
    var userInfo = {
      f_uname: "appTester123",
      f_pwd: "testpwd123",
    };

    var agent = chai.request.agent(server);
    agent
      .post("/verify-login")
      .send(userInfo)
      .then((res) => {
        res.should.have.cookie("persongify_auth");
        res.should.have.status(302);
        res.should.redirectTo(/^[\s\S]*\/spotify-login$/);
      })
    agent.close();
  });

  it("should fail to log in on POST /verify-login", async () => {
    var userInfo = {
      f_uname: "randomStranger",
      f_pwd: "wrongPassword",
    };

    var agent = chai.request.agent(server);
    agent
      .post("/verify-login")
      .send(userInfo)
      .then((res) => {
        res.should.not.have.cookie("persongify_auth");
        res.should.have.status(303);
        res.should.redirectTo(/^[\s\S]*\/login$/)
      })
    agent.close();
  });
});

describe("User Logout", () => {
  it("should log out current user on GET /logout", async () => {
    var agent = chai.request.agent(server);
    agent
      .get("/logout")
      .then((res) => {
        res.should.not.have.cookie("persongify_auth");
        res.should.not.have.cookie("spotify_auth");
        res.should.have.status(302);
        res.should.redirectTo(/^[\s\S]*\/home$/);
      })
    agent.close();
  });
});

describe("Redirects for logged out users", () => {
  it("should redirect to login on GET /spotify-login", async () => {
    var agent = chai.request.agent(server);
    agent
      .get("/spotify-login")
      .then((res) => {
        res.should.not.have.cookie("persongify_auth");
        res.should.have.status(303);
        res.should.redirectTo(/^[\s\S]*\/login$/);
      })
    agent.close();
  });
  it("should redirect to login on GET /trending", async () => {
    var agent = chai.request.agent(server);
    agent
      .get("/trending")
      .then((res) => {
        res.should.not.have.cookie("persongify_auth");
        res.should.have.status(303);
        res.should.redirectTo(/^[\s\S]*\/login$/);
      })
    agent.close();
  });
  it("should redirect to login on GET /songs", async () => {
    var agent = chai.request.agent(server);
    agent
      .get("/songs")
      .then((res) => {
        res.should.not.have.cookie("persongify_auth");
        res.should.have.status(303);
        res.should.redirectTo(/^[\s\S]*\/login$/);
      })
    agent.close();
  });
});
