import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SignInDTO, SignUpDTO } from 'src/auth/dto';
import { EditUserDTO } from 'src/user/dto';
import { CreateBookmarkDTO } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    // remember what is in main.ts present should be placed here to
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    // start the app
    await app.init();
    await app.listen(5000);
    // define db
    prisma = app.get(PrismaService);
    // cleanup db
    await prisma.cleanDB();
    // set base url
    pactum.request.setBaseUrl('http://localhost:5000');
  });

  afterAll(async () => {
    await app.close();
  });

  // at least one test is required
  //tests
  describe('auth', () => {
    describe('sign-up', () => {
      const dto: SignUpDTO = {
        email: 'shayan.ziaarabshahi.work@gmail.com',
        hash: '12345678',
      };
      it('should throw if hash is absent', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ email: dto.email })
          .expectStatus(400)
          .inspect(); // will give you response data
      });
      it('should throw if email is absent', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ hash: dto.hash })
          .expectStatus(400);
      });
      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('sign-in', () => {
      const dto: SignInDTO = {
        email: 'shayan.ziaarabshahi.work@gmail.com',
        hash: '12345678',
      };
      it('should throw if hash is absent', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if email is absent', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ hash: dto.hash })
          .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody(dto)
          .expectStatus(200)
          .stores('user_access_token', 'access_token');
        // stores access_token in body in user_access_token variable
      });
    });
  });

  describe('user', () => {
    describe('get-me', () => {
      it('should get me', () => {
        //S in $S means store
        return pactum
          .spec()
          .withBearerToken('$S{user_access_token}')
          .get('/user/me')
          .expectStatus(200);
      });
    });
    describe('edit-user', () => {
      const dto: EditUserDTO = {
        firstname: 'shayan',
        lastname: 'arabshahi',
        email: 'shayan.ziaarabshahi.work@gmail.com',
      };
      it('should edit user', () => {
        return pactum
          .spec()
          .withBearerToken('$S{user_access_token}')
          .patch('/user/edit-user')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstname)
          .expectBodyContains(dto.lastname);
      });
    });
  });

  describe('bookmark', () => {
    const dto: CreateBookmarkDTO = {
      title: 'shayan',
      description: 'arabshahi',
      link: '/',
    };

    describe('create-bookmark', () => {
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark')
          .withBearerToken('$S{user_access_token}')
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmark_id', 'id');
      });
    });

    describe('get-bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .withBearerToken('$S{user_access_token}')
          .get('/bookmark')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
  
    describe('get-bookmark', () => {
      it('should get bookmark', () => {
        return pactum
          .spec()
          .withPathParams('id', '$S{bookmark_id}')
          .withBearerToken('$S{user_access_token}')
          .get('/bookmark/{id}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmark_id}')
      });
    });

    describe('edit-bookmark', () => {
      const dto: CreateBookmarkDTO = {
        title: 'edited_shayan',
        description: 'edited_arabshahi',
        link: '/edited',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .withPathParams('id', '$S{bookmark_id}')
          .withBearerToken('$S{user_access_token}')
          .withBody(dto)
          .patch('/bookmark/{id}')
          .expectStatus(200)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('delete-bookmark', () => {
      it('should delete bookmark',() => { 
        return pactum
          .spec()
          .withPathParams('id', '$S{bookmark_id}')
          .withBearerToken('$S{user_access_token}')
          .delete('/bookmark/{id}')
          .expectStatus(204) 
      });
    });

    describe('get bookmarks', () => {
      it('should get empty bookmarks',() => { 
        return pactum
          .spec()
          .withBearerToken('$S{user_access_token}')
          .get('/bookmark')
          .expectStatus(200)
          .expectJsonLength(0)
      });
    });
  });
});
