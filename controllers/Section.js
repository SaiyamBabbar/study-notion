const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });
    // update course with section objectid
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create a Section",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, SectionId } = req.body;

    // data validation
    if (!sectionName || !SectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // update section
    const section = await Section.findByIdAndUpdate(
      SectionId,
      { sectionName },
      { new: true }
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "unable to update a Section,please try again",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // get id
    const { SectionId } = req.params;
    // use findbyidanddelete
    await Section.findByIdAndDelete(SectionId);
    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "unable to delete a Section,please try again",
      error: error.message,
    });
  }
};
