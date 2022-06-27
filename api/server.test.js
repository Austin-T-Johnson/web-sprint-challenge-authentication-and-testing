const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { JWT_SECRET } = require('../config/index.js');

const db = require('../data/dbConfig');
const User = require('./users/users-model.js');
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
   test('If missing password', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'austintj'});
   expect(res.body.message).toBe("username and password required");
   
   })
   test('If missing username', async () => {
    let res = await request(server).post('/api/auth/register').send({ password: '1234'});
   expect(res.body.message).toBe("username and password required");
   })
   
   test('If properly registered', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: 'austinvisuals', password: 'visuals'});
    expect(res.body.username).toBe("austinvisuals");
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('username')
    expect(res.body).toHaveProperty('password')

})
})

describe('POST /auth/login', () => {
    test('If missing password', async () => {
        let res = await request(server).post('/api/auth/login').send({ username: 'Ziggy' });
        expect(res.body.message).toBe("username and password required");
    })
    test('If missing username', async () => {
        let res = await request(server).post('/api/auth/login').send({ username: '', password: 1234 });
        expect(res.body.message).toBe("username and password required");
    })
    
    test('If incorrect username or password is passed in', async () => {
        let res = await request(server).post('/api/auth/login').send({ username: 'ZiggyMon', password: 'energy'});
    expect(res.body.message).toBe("invalid credentials");
    expect(res.status).toBe(401)
    })
})

describe('GET /jokes', () => {
    test('if missing token in req header', async () => {
        let res = await request(server).get('/api/jokes');
        expect(res.body.message).toBe("token required");
        expect(res.status).toBe(401)
    })
//    
        function generateToken(user) {
            const payload = {
              subject: user.id,
              username: user.username,
             
            };
            const options = {
              expiresIn: '5m',
            };
            return jwt.sign(payload, JWT_SECRET, options);
          }

    test('if token exists in authorization header', async () => {
       
       
        let result = await request(server).get('/api/jokes').set('Authorization', generateToken({ id: 1, username:'austin' }))
       
        expect(result.status).toBe(200)
    })
})

