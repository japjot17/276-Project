const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

describe("Token API for users that are NOT logged in", () => {
  it("should be an empty token", async () => {
    chai
      .request(server)
      .get("/token-api")
      .end((err, res) => {
        res.body.should.be.empty;
      });
  });
});

describe("Token API for users that ARE logged in", () => {
  var userInfo = {
    f_uname: "appTester123",
    f_pwd: "testpwd123",
  };

  it("should be a valid token", async () => {
    var agent = chai.request.agent(server);
    agent
      .post("/verify-login")
      .send(userInfo)
      .then(function (res) {
        res.should.have.cookie("persongify_auth");
        res.should.have.status(200);

        return agent.get("/token-api").then(function (res) {
          res.body.should.be.a("json");
        });
      });
    agent.close();
  });
});

describe("Trending page for users who are NOT logged in", () => {
  it("should redirect with status 303", async () => {
    chai
      .request(server)
      .get("/trending")
      .end((err, res) => {
        res.should.have.status(303);
      });
  });
});

describe("Saved playlists page for users who are NOT logged in", () => {
  it("should redirect with status 303", async () => {
    chai
      .request(server)
      .get("/playlists")
      .end((err, res) => {
        res.should.have.status(303);
      });
  });
});

describe("Account info page for users who are NOT logged in", () => {
  it("should redirect with status 303", async () => {
    chai
      .request(server)
      .get("/account")
      .end((err, res) => {
        res.should.have.status(303);
      });
  });
});

describe("Create playlist page for users who are NOT logged in", () => {
  it("should redirect with status 303", async () => {
    chai
      .request(server)
      .get("/songs")
      .end((err, res) => {
        res.should.have.status(303);
      });
  });
});

describe("Year Review page for users who are NOT logged in", () => {
  it("should redirect with status 303", async () => {
    chai
      .request(server)
      .get("/review")
      .end((err, res) => {
        res.should.have.status(303);
      });
  });
});