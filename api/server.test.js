const db = require('../data/dbConfig');
const Users = require('./users/users-model.js');
const server = require('./server.js');
const request = require('supertest');


// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

afterAll(async () => {
    await db.destroy();
});

describe('POST /auth/register', () => {
   test('If missing username, or password', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'austintj'});
    expect(res.body.message).toBe("username and password required");
    
   })
   test('If properly registered', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'austinvisuals', password: 'visuals'});
    expect(res.body.username).toBe("austinvisuals");

})
})