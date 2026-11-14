import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRepository } from '../../application/ports/auth.ports';
import { UserRecord } from './user.schema';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(@InjectModel(UserRecord.name) private readonly model: Model<UserRecord>) {}

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.model.findOne({ email: email.value }).exec();
    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<User | null> {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;
    const record = await this.model.findById(id).exec();
    return record ? this.toDomain(record) : null;
  }

  async save(user: User): Promise<void> {
    await this.model.updateOne(
      { email: user.email.value },
      { $setOnInsert: {
        fullName: user.fullName,
        email: user.email.value,
        passwordHash: user.passwordHash,
        role: user.role,
        isActive: user.isActive,
      } },
      { upsert: true },
    ).exec();
  }

  private toDomain(record: UserRecord & { _id: { toString(): string } }): User {
    return User.create({
      id: record._id.toString(),
      fullName: record.fullName,
      email: Email.create(record.email),
      passwordHash: record.passwordHash,
      role: record.role as UserRole,
      isActive: record.isActive,
    });
  }
}
