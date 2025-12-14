import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import { CreateUserDto } from './src/users/dto/create-user.dto';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const testUser: CreateUserDto = {
      email: 'admin@test.com',
      password: 'password123'
    };

    await usersService.create(testUser);
    console.log('Test user created successfully');
    console.log('Email: admin@test.com');
    console.log('Password: password123');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Test user already exists');
      console.log('Email: admin@test.com');
      console.log('Password: password123');
    } else {
      console.error('Error creating test user:', error);
    }
  } finally {
    await app.close();
  }
}

seed();
