import mongoose, { Schema, Document } from 'mongoose';

export interface IResident extends Document {
  fullName: string;
  phone?: string;
  dob?: Date;
  cccd?: string;
  relationship: string;
  residencyStatus: string;
  tags: string[];
  householdId: mongoose.Types.ObjectId;
}

const ResidentSchema: Schema = new Schema(
  {
    fullName: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String 
      // Đã bỏ required
    },
    dob: { 
      type: Date 
      // Đã bỏ required
    },
    cccd: { 
      type: String, 
      unique: true, 
      sparse: true // Quan trọng: Cho phép nhiều document không có CCCD mà không bị lỗi trùng lặp
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