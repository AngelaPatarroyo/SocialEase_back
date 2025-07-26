const SelfAssessment = require('../models/SelfAssessment');

class SelfAssessmentRepository {
  async create(data) {
    return await SelfAssessment.create(data);
  }

  async findByUserId(userId) {
    return await SelfAssessment.find({ userId });
  }

  async findById(id) {
    return await SelfAssessment.findById(id);
  }

  async update(id, data) {
    return await SelfAssessment.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await SelfAssessment.findByIdAndDelete(id);
  }
}

module.exports = new SelfAssessmentRepository();
