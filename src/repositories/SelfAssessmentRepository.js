const SelfAssessment = require('../models/SelfAssessment');

class SelfAssessmentRepository {
  async create(data, session = null) {
    const result = await SelfAssessment.create([data], session ? { session } : {});
    return result[0]; // Return the created document, not the array
  }

  async findByUserId(userId) {
    return await SelfAssessment.find({ userId }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await SelfAssessment.findById(id);
  }

  async update(id, data) {
    return await SelfAssessment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return await SelfAssessment.findByIdAndDelete(id);
  }
}

module.exports = new SelfAssessmentRepository();
