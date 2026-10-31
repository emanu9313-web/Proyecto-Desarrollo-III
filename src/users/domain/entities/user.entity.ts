export interface UserProps {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {}

  static create(props: UserProps): User {
    return new User(props.id, props.name, props.email, props.createdAt);
  }
}
