import superagent from 'superagent';
import assert from 'assert';
import { startServer as startServerFunction } from '../index';
import dotenv from 'dotenv';

dotenv.config();

const api = `http://localhost:${process.env.TESTPORT}`;

describe('API tests', () => {
    let server: any;
    let token: string = "";
    let firstId: string = "";
    let secondId: string = "";

    // Starting the server before all tests.
    before((done) => {
        const config = {
            port: Number(process.env.TESTPORT)
        };
        server = startServerFunction(config, () => {
            // Server started successfully callback
            done();
        });
    });

    // AUTH tests
    describe("AUTH tests", () => {
        const firstUser = `user_${Math.random().toString(36).substring(7)}@gmail.com`;
        const secondUser = `user_${Math.random().toString(36).substring(7)}@gmail.com`;

        it("Creates firstUser.", (done) => {
            superagent
                .post(`${api}/auth/signup`)
                .set('Content-Type', 'application/json')
                .send({
                    "email": firstUser,
                    "password": "randompass",
                    "username": "Tango",
                    "info": "I'm great!",
                    "age": 18
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201);
                    done();
                });
        });

        it("Creates secondUser.", (done) => {
            superagent
                .post(`${api}/auth/signup`)
                .set('Content-Type', 'application/json')
                .send({
                    "email": secondUser,
                    "password": "randompass",
                    "username": "Danger",
                    "info": "I'm great!",
                    "age": 22
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201);
                    done();
                });
        });

        it("Logs in with the newly created account.", (done) => {
            superagent
                .post(`${api}/auth/login`)
                .set('Content-Type', 'application/json')
                .send({
                    "email": firstUser,
                    "password": "randompass"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    token = res.body.token;
                    firstId = res.body.user._id;
                    done();
                });
        });

        it("Verifies the account.", (done) => {
            superagent
                .post(`${api}/auth/verify`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });

        it("Get friends.", (done) => {
            superagent
                .get(`${api}/auth/getfriends/${firstId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(Array.isArray(res.body.data.friends), true);
                    done();
                });
        });

        it("Gets friendId by email.", (done) => {
            superagent
                .post(`${api}/auth/getuserid`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "email": secondUser
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201);
                    secondId = res.body.userId;
                    done();
                });
        });

        it("Gets all users.", (done) => {
            superagent
                .post(`${api}/auth/findall`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "value": "test"
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201);
                    done();
                });
        });

        it("Sends a friend request.", (done) => {
            superagent
                .post(`${api}/auth/friendrequest`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "id": firstId,
                    "friendname": secondUser
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });

        it("Accepts a user's friend request.", (done) => {
            superagent
                .post(`${api}/auth/addfriend`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "id": secondId,
                    "friendname": firstUser
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });
    });

    // MESSAGE tests
    describe("MESSAGE tests", () => {

        it("Gets all messages between two users.", (done) => {
            superagent
                .post(`${api}/message/getmessages`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json')
                .send({
                    "membersId": [
                        firstId,
                        secondId
                    ]
                })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });

        it("Creates a chat.", (done) => {
            superagent
                .post(`${api}/message/createchat`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json')
                .send({
                    "membersId": [
                      firstId,
                      secondId
                    ],
                    "messagesId": []
                  })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });

        it("Creates a message.", (done) => {
            superagent
                .post(`${api}/message/createmessage`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json')
                .send({
                    "from": firstId,
                    "to": secondId,
                    "message": "Hello there"
                  })
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });
    });

    // Shut down the server after all tests.
    after((done) => {
        if (server) {
            server.close(() => done());
        } else {
            done();
        }
    });
});
