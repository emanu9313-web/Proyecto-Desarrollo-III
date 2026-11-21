import { Email } from '../value-objects/email.vo';

export type UserRole = 'STUDENT' | 'TEACHER' | 'STAFF';

export interface UserProps {
  id: string;
  fullName: string;
  email: Email;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
}

export class User {
  private constructor(readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  get id(): string { return this.props.id; }
  get fullName(): string { return this.props.fullName; }
  get email(): Email { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get role(): UserRole { return this.props.role; }
  get isActive(): boolean { return this.props.isActive; }
}

export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email.value,
    role: user.role,
  };
}
