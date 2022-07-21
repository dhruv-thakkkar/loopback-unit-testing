import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<unknown> {
    const userExists = await this.userRepository.findOne({
      where: {email: user.email},
    });
    if (userExists) {
      throw new HttpErrors.Forbidden('User already exists');
    }
    return this.userRepository.create(user);
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: {id: id},
    });
    if (!userExists) {
      throw new HttpErrors.NotFound('User not found');
    }
    return this.userRepository.findById(id, filter);
  }

  @put('/users/{id}')
  @response(200, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<unknown> {
    const userExists = await this.userRepository.findOne({
      where: {id: id},
    });
    if (!userExists) {
      throw new HttpErrors.NotFound('User not found');
    }
    await this.userRepository.replaceById(id, user);
    return {
      message: 'User updated successfully',
    };
  }

  @del('/users/{id}')
  @response(200, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<unknown> {
    const userExists = await this.userRepository.findOne({
      where: {id: id},
    });
    if (!userExists) {
      throw new HttpErrors.NotFound('User not found');
    }
    await this.userRepository.deleteById(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
