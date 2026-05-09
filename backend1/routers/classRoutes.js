const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");

let activeClasses = {};
let classTimers = {};

// START / STOP CLASS
router.post("/toggle", async (req, res) => {
  try {

    const {
      teacherID,
      subjectCode,
      action
    } = req.body;

    if (!teacherID || !subjectCode || !action) {
      return res.status(400).json({
        success: false,
        message: "Missing data"
      });
    }

    const subject = await Subject.findOne({
      code: subjectCode
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // SUBJECT TEACHER CHECK
    if (subject.teacherID !== teacherID) {
      return res.status(403).json({
        success: false,
        message: "Sirf assigned subject teacher class start kar sakta hai"
      });
    }

    // START CLASS
    if (action === "start") {

      const endTime =
        Date.now() + 2 * 60 * 1000;

      activeClasses[teacherID] = {
        teacherID,
        subjectCode,
        semester: subject.semester,
        isActive: true,
        startTime: new Date(),
        endTime
      };

      if (classTimers[teacherID]) {
        clearTimeout(
          classTimers[teacherID]
        );
      }

      classTimers[teacherID] =
        setTimeout(() => {

          delete activeClasses[teacherID];

          delete classTimers[teacherID];

        }, 2 * 60 * 1000);

      return res.json({
        success: true,
        isLive: true,
        isActive: true,
        subjectCode,
        semester: subject.semester,
        endTime,
        message: "Class started ✅"
      });
    }

    // STOP CLASS
    delete activeClasses[teacherID];

    if (classTimers[teacherID]) {

      clearTimeout(
        classTimers[teacherID]
      );

      delete classTimers[teacherID];
    }

    res.json({
      success: true,
      isLive: false,
      isActive: false,
      message: "Class stopped ✅"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// CURRENT STATUS
router.get("/current-status/:teacherID", (req, res) => {

  const status =
    activeClasses[req.params.teacherID];

  if (!status) {
    return res.json({
      isActive: false,
      isLive: false
    });
  }

  res.json({
    isActive: true,
    isLive: true,
    subjectCode: status.subjectCode,
    semester: status.semester,
    endTime: status.endTime
  });
});

// STUDENT ACTIVE CLASS CHECK
router.get("/all-active", (req, res) => {

  const activeTeacherIDs =
    Object.keys(activeClasses);

  if (activeTeacherIDs.length > 0) {

    const firstActive =
      activeClasses[
        activeTeacherIDs[0]
      ];

    return res.json({
      isActive: true,
      isLive: true,
      subjectCode:
        firstActive.subjectCode,
      semester:
        firstActive.semester,
      endTime:
        firstActive.endTime
    });
  }

  res.json({
    isActive: false,
    isLive: false
  });
});

module.exports = router;