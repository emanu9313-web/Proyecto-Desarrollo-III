import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserRecord>;

@Schema({ timestamps: true, collection: 'users' })
export class UserRecord {
  @Prop({ required: true, trim: true }) fullName!: string;
  @Prop({ required: true, unique: true, lowercase: true, index: true }) email!: string;
  @Prop({ required: true, select: true }) passwordHash!: string;
  @Prop({ required: true, enum: ['STUDENT', 'TEACHER', 'STAFF'] }) role!: string;
  @Prop({ default: true }) isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserRecord);
UserSchema.index({ email: 1 }, { unique: true });
