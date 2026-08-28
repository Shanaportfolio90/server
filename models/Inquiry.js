import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
    brandWebsite: { type: String, required: true },
    contactName: { type: String, required: true },
    contactDesignation: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phoneNo: { type: String, required: true },
    connectPurpose: { type: String, required: true },
    promotionalBudget: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Pending', 'Reviewed', 'Contacted'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);
