import {juggler} from '@loopback/repository';

export const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'db',
  connector: 'mongodb',
  url: 'mongodb://localhost:27017/Test',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'Test',
  useNewUrlParser: true,
});
