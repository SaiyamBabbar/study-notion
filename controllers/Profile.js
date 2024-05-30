const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    // get data
    const { dateofBirth = "", about = "", contactNumber, gender } = req.body;
    // get userid
    const id = req.user.id;
    // validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "all fields are required!",
      });
    }
    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.addistionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateofBirth = dateofBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    // get id
    const id = req.user.id;
    // validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.addistionalDetails });
    // unenroll user from all enrolled users

    // delete user
    await User.findByIdAndDelete({ _id: id });

    // return response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user cannot be deleted successfully",
      error: error.message,
    });
  }
};

exports.getAllusersDetails = async (req, res) => {
  try {
    // get id
    const is = req.user.id;

    // valifdation
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // return res
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
