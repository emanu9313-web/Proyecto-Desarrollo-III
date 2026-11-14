export class InvalidEmailDomainError extends Error {
  readonly code = 'INVALID_EMAIL_DOMAIN';

  constructor() {
    super('Solo se permiten correos @correounivalle.edu.co');
    this.name = 'InvalidEmailDomainError';
  }
}

export class InvalidCredentialsError extends Error {
  readonly code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Credenciales inválidas');
    this.name = 'InvalidCredentialsError';
  }
}
