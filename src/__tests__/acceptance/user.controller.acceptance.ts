import {Client} from '@loopback/testlab';
import {LoopbackUnitTestingApplication} from '../..';
import {setupApplication} from './test-helper';

describe('UserController', () => {
  let app: LoopbackUnitTestingApplication;
  let client: Client;
  let userId: string;
  const someWrongUserId = '62d98da092b8fe0ceca84f3e';
  const randomEmail =
    (Math.random() + 1).toString(36).substring(7) + '@gmail.com';
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes POST /users 200', async () => {
    const res = await client
      .post('/users')
      .send({
        name: 'Unit Test',
        email: randomEmail,
      })
      .expect(200);
    userId = res.body.id;
  });

  it('invokes POST /users 409', async () => {
    await client
      .post('/users')
      .send({
        name: 'Unit Test',
        email: randomEmail,
      })
      .expect(409);
  });

  it('invokes GET /users/count 200', async () => {
    await client.get('/users/count').expect(200);
  });

  it('invokes GET /users 200', async () => {
    await client.get('/users').expect(200);
  });

  it('invokes GET /users/{id} 200', async () => {
    await client.get('/users/' + userId).expect(200);
  });

  it('invokes GET /users/{id} 404', async () => {
    await client.get('/users/' + someWrongUserId).expect(404);
  });

  it('invokes PUT /users 200', async () => {
    await client
      .put('/users/' + userId)
      .send({
        name: 'Unit Test Editted Name',
        email: randomEmail,
      })
      .expect(200);
  });

  it('invokes PUT /users 404', async () => {
    await client
      .put('/users/' + someWrongUserId) //some random wrong id to throw 404
      .send({
        name: 'Unit Test Editted Name',
        email: randomEmail,
      })
      .expect(404);
  });

  it('invokes DELETE /users/{id} 200', async () => {
    await client.del('/users/' + userId).expect(200);
  });

  it('invokes DELETE /users/{id} 404', async () => {
    await client.del('/users/' + someWrongUserId).expect(200);
  });
});
