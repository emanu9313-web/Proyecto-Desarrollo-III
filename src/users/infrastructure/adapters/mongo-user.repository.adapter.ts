import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/ports/repositories/user.repository";
import { UserRecord } from "../schemas/user.schema";

@Injectable()
export class MongoUserRepositoryAdapter implements UserRepository {
  constructor(
    @InjectModel(UserRecord.name)
    private readonly userModel: Model<UserRecord>,
  ) {}

  async save(user: User): Promise<User> {
    const record = new this.userModel({
      _id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
    const saved = await record.save();
    return this.toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.userModel.findOne({ email }).exec();
    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: UserRecord): User {
    return User.create({
      id: record._id,
      name: record.name,
      email: record.email,
      createdAt: record.createdAt,
    });
  }
}
