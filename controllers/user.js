import { User } from "../models/User.js";
import { Owner } from "../models/Owner.js";
import { Donor } from "../models/Donor.js";

// get myProfile
export const myProfile = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    // get the User object
    const userId = req.decodedUserId;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Register first." });
    }

    let owner;
    let ownerPublicKey;
    let donor;
    let donorPublicKey;
    let campaigns;
    let donations;

    if(user.role.includes("owner")) {        
        owner = await Owner.findOne({ ownerData: userId }).populate("campaigns");
        campaigns = owner.campaigns;
        ownerPublicKey = owner.publicKey;
    }
    if(user.role.includes("donor")) {
        donor = await Donor.findOne({ donorData: userId}).populate("donations");
        donations = donor.donations;
        donorPublicKey = donor.publicKey;
    }
    
    return res.status(401).send({
        user: user,
        ownerPublicKey: ownerPublicKey,
        donorPublicKey: donorPublicKey,
        campaigns: campaigns,
        donations: donations
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

// get all campaigns of a user
export const userCampaign = async (req, res) => {

};

//  get all donations of a user

// get campaign donors
