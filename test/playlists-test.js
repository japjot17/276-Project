const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

describe("Get Trending", () => {
  it("should have gotten playlists in /trending", async () => {
    // var userInfo = {
    //   f_uname: "appTester123",
    //   f_firstName: "Mx.",
    //   f_lastName: "Tester",
    //   f_age: 50,
    //   f_pwd: "testpwd123",
    // };
    // var res = await chai.request(server).post("/addUser").send(userInfo);
    // res.should.have.cookie("persongify_auth");
    // res.should.have.status(302);
  });
});
