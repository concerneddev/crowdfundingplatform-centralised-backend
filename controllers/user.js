import { User } from "../models/User.js";
import { Owner } from "../models/Owner.js";
import { Donor } from "../models/Donor.js";
import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";

// get profile of other user or logged in user
export const profile = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    // get the User objects
    let userId;
    if (req.params.id) {
      userId = req.params.id;
    } else if (req.decodedUserId) {
      userId = req.decodedUserId;
    } else {
      return res.status(401).send({ message: "Invalid link." });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Register first." });
    }

    let owner;
    let ownerPublicKey;
    let donor;
    let donorPublicKey;
    let campaigns = [""];
    let donations = [""];
    let publicKey;

    if (user.role.includes("owner")) {
      owner = await Owner.findOne({ ownerData: userId }).populate({
        path: "campaigns",
        populate: { path: "donations" },
      });
      campaigns = owner.campaigns;
      ownerPublicKey = owner.publicKey;
    }

    if (user.role.includes("donor")) {
      donor = await Donor.findOne({ donorData: userId }).populate("donations");
      donations = donor.donations;
      donorPublicKey = donor.publicKey;
    }

    if (donorPublicKey) {
      publicKey = donorPublicKey;
    } else if (ownerPublicKey) {
      publicKey = ownerPublicKey;
    } else {
      publicKey = null;
    }

    return res.status(201).send({
      user: user,
      publicKey: publicKey,
      campaigns: campaigns,
      donations: donations,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

// get all campaigns of a user
export const userCampaigns = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    // get the User object
    let userId;
    if (req.params.id) {
      userId = req.params.id;
    } else if (req.decodedUserId) {
      userId = req.decodedUserId;
    } else {
      return res.status(401).send({ message: "Invalid link." });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User doesn't exist!" });
    }

    let owner;
    let ownerPublicKey;
    let campaigns;

    if (user.role.includes("owner")) {
      owner = await Owner.findOne({ ownerData: userId }).populate("campaigns");
      campaigns = owner.campaigns;
      ownerPublicKey = owner.publicKey;
    }

    return res.status(201).send({
      ownerPublicKey: ownerPublicKey,
      campaigns: campaigns,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

//  get all donations of a user
export const userDonations = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    // get the User object
    let userId;
    if (req.params.id) {
      userId = req.params.id;
    } else if (req.decodedUserId) {
      userId = req.decodedUserId;
    } else {
      return res.status(401).send({ message: "Invalid link." });
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User doesn't exist!" });
    }

    let donor;
    let donorPublicKey;
    let donations;

    if (user.role.includes("donor")) {
      donor = await Donor.findOne({ donorData: userId }).populate("donations");
      console.log(donor);
      donations = donor.donations;
      donorPublicKey = donor.publicKey;
    }

    return res.status(201).send({
      donorPublicKey: donorPublicKey,
      donations: donations,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// list of campaigns arranged in recency
export const campaignsListRecent = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort("-createdAt").populate("donations")
    if (!campaigns) {
      return res.status(404).send({ message: "Campaign not found. " });
    }

    console.log("Backend: campaigns: ", campaigns);

    return res.status(200).send(campaigns);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

// get a campaign by id
export const campaignById = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    let donations;
    const campaignId = req.params.id;
    console.log("Controller_user: campaignId: ", campaignId);
    const campaign = await Campaign.findById(campaignId).populate("owner");
    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found. " });
    }

    donations = campaign.donations;
  

    console.log(campaign);
    return res.status(201).send({
      campaign: campaign,
      donations: donations,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// donations of a campaign
export const campaignDonations = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId).populate("donations");
    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found. " });
    }

    const donations = campaign.donations;

    return res.status(201).send({
      donations: donations,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

// campaigns by tags
export const campaignsByTag = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    const tag = req.params.tag;
    const campaigns = await Campaign.find({ tags: { $in: [tag] } }).populate(
      "donations"
    );

    if (!campaigns) {
      return res.status(404).send({ message: "No campaigns with that tag." });
    }

    return res.status(201).send({
      campaigns: campaigns,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

export const donationById = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    const donationId = req.params.id;
    const donation = await Donation.findById(donationId).populate({
      path: "donor",
      populate: { path: "donorData" },
    });
    if (!donation) {
      return res.status(404).send({ message: "Campaign not found. " });
    }

    return res.status(201).send({
      donation: donation,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};
