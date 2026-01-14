import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {

  let app: INestApplication;
  let token: any;
  let usuarioId: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // =======================
  // TESTES DE CADASTRO
  // =======================

  it('01 - Deve Cadastrar um novo Usuário', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(201);

    usuarioId = resposta.body.id;
  });

  it('02 - Não Deve Cadastrar um Usuário Duplicado', async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(400);
  });

  it('03 - Não Deve Cadastrar Usuário sem Nome', async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: '',
        usuario: 'teste@teste.com',
        senha: '123456',
        foto: '-',
      })
      .expect(400);
  });

  it('04 - Não Deve Cadastrar Usuário com Email Inválido', async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Teste',
        usuario: 'email-invalido',
        senha: '123456',
        foto: '-',
      })
      .expect(400);
  });

  it('05 - Não Deve Cadastrar Usuário com Senha Curta', async () => {
    await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Teste',
        usuario: 'teste2@teste.com',
        senha: '123',
        foto: '-',
      })
      .expect(400);
  });

  // =======================
  // TESTES DE AUTENTICAÇÃO
  // =======================

  it('06 - Deve Autenticar o Usuário (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      })
      .expect(200);

    token = resposta.body.token;
  });

  it('07 - Não Deve Autenticar Usuário com Senha Incorreta', async () => {
    await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'senhaerrada',
      })
      .expect(401);
  });

  // =======================
  // TESTES PROTEGIDOS (JWT)
  // =======================

  it('08 - Deve Listar todos os Usuários', async () => {
    await request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .expect(200);
  });

  it('09 - Não Deve Listar Usuários sem Token', async () => {
    await request(app.getHttpServer())
      .get('/usuarios/all')
      .expect(401);
  });

  it('10 - Deve Atualizar um Usuário', async () => {
    await request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root Atualizado',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: '-',
      })
      .expect(200)
      .then(resposta => {
        expect('Root Atualizado').toEqual(resposta.body.nome);
      });
  });

});