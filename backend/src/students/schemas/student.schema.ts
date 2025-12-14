import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  course: string;

  @Prop({ required: true })
  enrollmentDate: Date;

  @Prop({ default: 'Active' })
  status: string;

  @Prop()
  address: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
