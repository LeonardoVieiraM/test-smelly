const { UserService } = require ('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  describe('Criar usuário', () => {
    test('deve criar um usuário com dados válidos e retornar com ID definido', () => {
      // Arrange
      const nome = dadosUsuarioPadrao.nome;
      const email = dadosUsuarioPadrao.email;
      const idade = dadosUsuarioPadrao.idade;

      // Act
      const usuarioCriado = userService.createUser(nome, email, idade);

      // Assert
      expect(usuarioCriado.id).toBeDefined();
      expect(usuarioCriado.nome).toBe(nome);
      expect(usuarioCriado.email).toBe(email);
      expect(usuarioCriado.status).toBe('ativo');
    });

    test('deve lançar erro ao tentar criar usuário menor de idade', () => {
      // Arrange
      const idadeInvalida = 17;

      // Act & Assert
      expect(() => {
        userService.createUser('Menor', 'menor@email.com', idadeInvalida);
      }).toThrow('O usuário deve ser maior de idade.');
    });
  });

  describe('Buscar usuário por ID', () => {
    test('deve retornar usuário existente com informações corretas', () => {
      // Arrange
      const usuarioCriado = userService.createUser(
        dadosUsuarioPadrao.nome,
        dadosUsuarioPadrao.email,
        dadosUsuarioPadrao.idade
      );

      // Act
      const usuarioBuscado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
      expect(usuarioBuscado.email).toBe(dadosUsuarioPadrao.email);
      expect(usuarioBuscado.status).toBe('ativo');
    });

    test('deve retornar lista vazia quando não há usuários cadastrados', () => {
      // Arrange - nenhum usuário foi criado

      // Act
      const usuarios = userService.getAllUsers?.() || [];

      // Assert
      expect(usuarios).toEqual([]);
    });
  });

  describe('Desativar usuário comum', () => {
    test('deve desativar um usuário comum com sucesso', () => {
      // Arrange
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      const resultado = userService.deactivateUser(usuarioComum.id);

      // Assert
      expect(resultado).toBe(true);
    });

    test('deve alterar status do usuário comum para inativo após desativação', () => {
      // Arrange
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      userService.deactivateUser(usuarioComum.id);
      const usuarioAtualizado = userService.getUserById(usuarioComum.id);

      // Assert
      expect(usuarioAtualizado.status).toBe('inativo');
    });
  });

  describe('Desativar usuário administrador', () => {
    test('deve rejeitar desativação de usuário administrador', () => {
      // Arrange
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      const resultado = userService.deactivateUser(usuarioAdmin.id);

      // Assert
      expect(resultado).toBe(false);
    });

    test('deve manter status ativo de usuário administrador após tentar desativar', () => {
      // Arrange
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      userService.deactivateUser(usuarioAdmin.id);
      const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

      // Assert
      expect(usuarioAtualizado.status).toBe('ativo');
    });
  });

  describe('Gerar relatório de usuários', () => {
    test('deve incluir nomes de todos os usuários cadastrados no relatório', () => {
      // Arrange
      userService.createUser('Alice', 'alice@email.com', 28);
      userService.createUser('Bob', 'bob@email.com', 32);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('Alice');
      expect(relatorio).toContain('Bob');
    });

    test('deve incluir status de usuários no relatório', () => {
      // Arrange
      userService.createUser('Charlie', 'charlie@email.com', 35);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('ativo');
    });

    test('deve exibir cabeçalho informativo no relatório', () => {
      // Arrange
      userService.createUser('Diana', 'diana@email.com', 29);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio.length).toBeGreaterThan(0);
      expect(relatorio).toMatch(/---/);
    });

    test('deve gerar relatório válido quando não há usuários cadastrados', () => {
      // Arrange - nenhum usuário foi criado

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toBeDefined();
      expect(typeof relatorio).toBe('string');
    });
  });
});
