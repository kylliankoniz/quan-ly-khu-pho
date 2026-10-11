import mongoose, { Document, Schema } from 'mongoose';

// 1. Định nghĩa Interface cho TypeScript
export interface IHousehold extends Document {
  houseNumber: string;
  precinct: number; // Chỉ nhận 56 hoặc 57
  headOfHousehold?: mongoose.Types.ObjectId; // Liên kết tới Bảng Nhân Khẩu
  zaloGroupJoined: boolean;
  notes?: string;
}

// 2. Định nghĩa Schema cho Mongoose
const householdSchema = new Schema<IHousehold>(
  {
    houseNumber: { 
      type: String, 
      required: [true, 'Vui lòng nhập số nhà'],
      trim: true
    },
    precinct: { 
      type: Number, 
      required: [true, 'Vui lòng chọn tổ dân phố'],
      enum: [56, 57] 
    },
    headOfHousehold: { 
      type: Schema.Types.ObjectId, 
      ref: 'Resident'
    },
    zaloGroupJoined: { 
      type: Boolean, 
      default: false 
    },
    notes: { 
      type: String,
      trim: true
    },
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model<IHousehold>('Household', householdSchema);