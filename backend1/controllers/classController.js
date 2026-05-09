const ClassStatus = require("../models/ClassStatus");

// START CLASS
exports.startClass = async (req, res) => {
  try {
    await ClassStatus.updateOne(
      {},
      { isActive: true, startedAt: new Date() },
      { upsert: true }
    );

    res.json({ message: "Class Started ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// END CLASS
exports.endClass = async (req, res) => {
  try {
    await ClassStatus.updateOne(
      {},
      { isActive: false }
    );

    res.json({ message: "Class Ended ❌" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET STATUS (optional)
exports.getStatus = async (req, res) => {
  const status = await ClassStatus.findOne();
  res.json({ isActive: status?.isActive || false });
};