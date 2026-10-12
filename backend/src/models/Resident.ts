import mongoose, { Schema, Document } from 'mongoose';

export interface IResident extends Document {
  fullName: string;
  gender?: string; // Mới thêm: Giới tính
  dob?: Date;
  cccd?: string;
  phone?: string;
  occupation?: string; // Mới thêm: Nghề nghiệp / Nơi làm việc / Nơi học tập
  relationship: string;
  residencyStatus: string;
  notes?: string;
  tags: string[];
  householdId: mongoose.Types.ObjectId;
}

const ResidentSchema: Schema = new Schema(
  {
    fullName: { 
      type: String, 
      required: true 
    },
    gender: {
      type: String,
      enum: ['Nam', 'Nữ', 'Khác'],
      default: 'Nam' // Mặc định để tránh lỗi form nếu quên chọn
    },
    dob: { 
      type: Date 
    },
    cccd: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    phone: { 
      type: String 
    },
    occupation: {
      type: String
    },
    relationship: { 
      type: String, 
      required: true 
    },
    residencyStatus: { 
      type: String, 
      required: true 
    },
    notes: { 
      type: String 
    },
    tags: [
      { type: String }
    ],
    householdId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Household', 
      required: true 
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IResident>('Resident', ResidentSchema);