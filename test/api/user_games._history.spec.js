const request = require('supertest')
const app = require("../../app")
const { sequelize }= require('../../models')
const { QueryTypes } = require('sequelize') 
require("../../controllers/api/usergamesController")

describe('Endpoint for API user games ', () => {
    beforeAll(async () => {
      await request(app).post('/api/v1/register').send({ username: 'man1', email: 'piaaasan@mail.com', password: 'luthfiyahsakinah19', role_id:2,sign_with:'Form App'  });
      await request(app).post('/api/v1/register').send({ username: 'woman2', email: 'piaaasan2@mail.com', password: 'luthfiyahsakinah19', role_id:2,sign_with:'Form App'  });
      await request(app).post('/api/v1/register').send({ username: 'man3', email: 'piaaasan3@mail.com', password: 'luthfiyahsakinah19', role_id:2,sign_with:'Form App'  });
      await request(app).post('/api/v1/register').send({ username: 'luthfiyahsakinah190702', email: 'luthfiyahsakinah190702@mail.com', password: 'luthfiyahsakinah190702', role_id:1,sign_with:'Form App'  });
      const login = await request(app).post('/api/v1/login').send({ username: 'luthfiyahsakinah190702', password: 'luthfiyahsakinah190702' });
        token = login.body.data.token;
        //const token = login.body.data
    });

    afterAll(async () => {
        try { 
            await sequelize.query("TRUNCATE user_games, user_games_biodata, user_games_history RESTART IDENTITY;", { type: QueryTypes.RAW }); 
          } catch (error) { 
            console.log(error) 
          }
    });

    //api user-games-history
  it('should not view user games history', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-history')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })
  it('should view user games history', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-history')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')  
  })

  it('POST /api/v1/user-game-history/ : Should not insert user games history not authorized', async () => {
    const res = await request(app)
      .post('/api/v1/user-game-history')
      .send({
        user_id: 7,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })


  it('POST /api/v1/user-game-history/ : Should insert user games history', async () => {
    const res = await request(app)
      .post('/api/v1/user-game-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')  
  })

  it('POST /api/v1/user-game-history/ : Should insert user games history', async () => {
    const res = await request(app)
      .post('/api/v1/user-game-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1,
        score: 100,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('message')  
  })

  it('POST /api/v1/user-game-history/ : Should not insert user games history because uid not found', async () => {
    const res = await request(app)
      .post('/api/v1/user-game-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1,
        score: 10,
        session_start: "2022-04-09 25:10:00",
        session_end: "2022-04-09 179:40:00"
      })
    expect(res.statusCode).toEqual(500)
    expect(res.body).toHaveProperty('message')  
  })
  it('POST /api/v1/user-game-history/ : Should not insert user games history', async () => {
    const res = await request(app)
      .post('/api/v1/user-game-history')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(500)
    expect(res.body).toHaveProperty('message')  
  })
  it('POST /api/v1/user-game-history/ : Should not insert user games history because user id not found', async () => {
    const res = await request(app)
      .post('/api/v1/user-game-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1234,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('message')  
  })

  //GET BY ID 
  it('/api/v1/user-game-history/id : should not view user games history by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-game-history?id=4')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })
  it('/api/v1/user-game-history/id : should view user games history by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-game-history?id=1')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
  })
  it('/api/v1/user-game-history/id : should not view user games history by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-game-history?id=10000000')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(404)
  })

  it('/api/v1/user-game-history/id : should not view user games history by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-game-history')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(500)
  })

  //PUT
  it('PUT /api/v1/user-game-history/id : Should not update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-game-history?id=4')
      .send({
        user_id: 1,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })

  it('PUT /api/v1/user-game-history/id : Should update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-game-history?id=1')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(200)
  })

  it('PUT /api/v1/user-game-history/id : Should not update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-game-history?id=4')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(400)
  })

  it('PUT /api/v1/user-game-history/id : Should not update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-game-history?id=4')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 700000000,
        score: 10,
        session_start: "202204-09 10:10:00",
        session_end: "2022-0409 12:40990"
      })
    expect(res.statusCode).toEqual(404)
  })

  it('PUT /api/v1/user-game-history/id : Should not update user games history because id not find', async () => {
    const res = await request(app)
      .put('/api/v1/user-game-history?id=40000')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 70000000,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(404)
  })
  
  // //DELETE
  // it('DELETE /api/v1/user-game-history/id : Should not delete user games history', async () => {
  //   const res = await request(app)
  //     .delete('/api/v1/user-game-history?id=9')
  //   expect(res.statusCode).toEqual(401)
  //   expect(res.body).toHaveProperty('message')  
  // })

  // it('DELETE /api/v1/user-game-history/id : Should delete user games history', async () => {
  //   const res = await request(app)
  //     .delete('/api/v1/user-game-history?id=1')
  //     .set('Authorization',`Bearer ${token}`)
  //   //expect(res.statusCode).toEqual(404)
  //   expect(res.statusCode).toEqual(200) //harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
  // })

  // it('DELETE /api/v1/user-game-history/id : Should not delete user games history because id not find', async () => {
  //   const res = await request(app)
  //     .delete('/api/v1/user-game-history?id=1000')
  //     .set('Authorization',`Bearer ${token}`)
  //   expect(res.statusCode).toEqual(404)
  // })

})

