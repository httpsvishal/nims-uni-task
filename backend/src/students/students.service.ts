import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Student } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>,
  ) {}



  async create(dto: CreateStudentDto) {
    const student = await this.studentModel.create({
      ...dto,
      enrollmentDate: new Date(dto.enrollmentDate),
    });
    
    // Transform _id to id for frontend compatibility
    return {
      ...student.toObject(),
      id: student._id.toString(),
    };
  }




  async findAll(page = 1, limit = 10, search = '') {
    const query = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { course: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const data = await this.studentModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.studentModel.countDocuments(query);

    // Transform _id to id for frontend compatibility
    const transformedData = data.map(student => ({
      ...student.toObject(),
      id: student._id.toString(),
    }));

    return {
      data: transformedData,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findById(id: string) {
    const student = await this.studentModel.findById(id);
    if (!student) return null;
    
    // Transform _id to id for frontend compatibility
    return {
      ...student.toObject(),
      id: student._id.toString(),
    };
  }



  async update(id: string, dto: UpdateStudentDto) {
    // Convert enrollmentDate string to Date object if provided
    const updateData = {
      ...dto,
      ...(dto.enrollmentDate && { enrollmentDate: new Date(dto.enrollmentDate) }),
    };
    
    // Remove enrollmentDate from dto to avoid passing both string and Date versions
    delete (updateData as any).enrollmentDate;
    
    const student = await this.studentModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!student) return null;
    
    // Transform _id to id for frontend compatibility
    return {
      ...student.toObject(),
      id: student._id.toString(),
    };
  }

  delete(id: string) {
    return this.studentModel.findByIdAndDelete(id);
  }
}
