const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

describe('Generate songs', () =>{

    it('should enter sufficient parameters on POST request for /songs' , async()=>{

        var seeds = 
            {
                limit: '3',
                genre: 'hip-hop',
                danceability: '0.8',
                energy: '0.9',
                acousticness: '0.8',
                seed_artist: 'kendrick lamar',
                seed_song: 'first class',
                button: 'add'
              }

        var agent = chai.request.agent(server);
        agent.post("/songs").send(seeds).then((res) =>{
            res.body.should.be.json;
            res.should.have.status(200);
        })
        agent.close();
    });
})


describe('Clear Songs', () => {
    it('should empty the songs in the array on POST requrest for /delete', async() => {
        var songs = ["Liquor Locker"];
        var artists = ["VIC MENSA"];
        var audios = ["5YbrqNUUleF39Ai3b3ruQy"];
        var agent = chai.request.agent(server);
        agent.post("/delete").send(songs, artists, audios).then((res) => {
            res.body.should.be.equall([]);
            res.should.have.status(200);
            
        })
        agent.close();
    });
})