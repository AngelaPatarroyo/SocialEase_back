const SelfAssessment = require('../models/SelfAssessment');

class SelfAssessmentRepository {
  async create(data, session = null) {
    return await SelfAssessment.create([data], session ? { session } : {});
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
