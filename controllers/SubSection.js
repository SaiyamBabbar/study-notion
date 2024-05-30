const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create subsection

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req body
    const { sectionId, title, timeDuration, description } = req.body;
    // extract file/body
    const video = req.files.videoFiles;
    // validation
    if (!sectionId || !title || !description || !timeDuration || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // create a sub section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // update section with this sub section object id
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection"); // Populate subSection details

    // Log the updated section
    console.log(updatedSection);

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection created and added to Section successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create SubSection",
      error: error.message,
    });
  }
};

exports.updatesubSection = async (req, res) => {
  try {
    // Data fetch
    const { subSectionId, title, timeDuration, description } = req.body;

    // Data validation
    if (!subSectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    // Update subsection
    const subSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      { title, timeDuration, description },
      { new: true }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: subSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update SubSection, please try again",
      error: error.message,
    });
  }
};

exports.deletesubSection = async (req, res) => {
  try {
    // Get subSectionId from params
    const { subSectionId } = req.params;

    // Find and delete the subsection
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Remove the deleted subsection reference from the parent section
    await Section.findByIdAndUpdate(
      deletedSubSection.section, 
      {
        $pull: { subSection: subSectionId },
      }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete SubSection, please try again",
      error: error.message,
    });
  }
};
