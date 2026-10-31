import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "users", versionKey: false })
export class UserRecord {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  })
  email!: string;

  @Prop({ type: Date, required: true })
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserRecord);
