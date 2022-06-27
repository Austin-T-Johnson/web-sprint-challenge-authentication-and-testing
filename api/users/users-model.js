const db = require('../../data/dbConfig.js')


async function add(user) {
    const [id] = await db("users").insert(user)
    return findById(id)
  }

  function findBy(filter) {
    return db('users').select('id', 'username', 'password').where(filter).first();
  }

function findById(id) {
    return db('users').select('id', 'username', 'password').where('users.id', id).first();
}

module.exports = {
    add,
    findBy,
    findById,
    
    
}