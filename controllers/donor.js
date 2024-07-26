import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";
import { Donor } from "../models/Donor.js";
import { User } from "../models/User.js";

/*
request.body:
{
    "contractAddress": "0xbc1615972af72d8f2f856967aec76d1e5856ffe9",
    "donorPublicKey": "0xFC5272061F97D5F907C25bC9e7dda26C712Ac803",
    "donationAmount": 5,
}  
*/
export const donateCampaign = async (req, res) => {
  try {
    // check if user is logged in
    if (!req.decodedUserId) {
      return res.status(401).send({ message: "Access denied." });
    }

    // get the User object
    const userId = req.decodedUserId;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(401).send({ message: "Register first." });
    }

    // validate body
    if (
        !req.body.contractAddress ||
        !req.body.donorPublicKey ||
        !req.body.donationAmount 
      ) {
        return res.status(400).send({
          message:
            "Send all fields: contractAddress, donorPublicKey, currentAmount, donationAmount",
        });
    }

    // add or update donor to Donors collection
    // check if the user is already registered as a Donor
    let campaign = await Campaign.findOne({ contractAddress: req.body.contractAddress });
    if(!campaign) {
        return res.status(404).send({ message: "Campaign not found." });
    }
    if(campaign.campaignState == "inactive") {
        return res.status(404).send({ message: "Campaign is inactive. "});
    }

    let donor = await Donor.findOne({ donorData: userId });
    let donation;
    if(!donor) {
        // donor doesn't already exist
        // register donor with the correct fields
        donor = await Donor.create({
            publicKey: req.body.donorPublicKey,
            donorData: user._id,
        });

        // add the donation to the Donation collection
        donation = await Donation.create({
            donor: donor._id,
            campaign: campaign._id,
            donationAmount: req.body.donationAmount
        });

        // add the donor's donation
        donor.donations.push(donation._id);
        await donor.save();
    } else if (donor) {
        // donor exists in Donor
        donation = await Donation.create({
            donor: donor._id,
            campaign: campaign._id,
            donationAmount: req.body.donationAmount
        });
    }        
    
    // update user
    user.role.push("donor");
    await user.save();
    
    // update campaign
    const currentAmount = campaign.currentAmount;
    campaign.currentAmount = currentAmount + req.body.donationAmount;
    campaign.donors.push(donor._id);
    campaign.donations.push(donation._id);
    await campaign.save();

    // check if goalAmount is reached
    let goalReached = false;
    if( campaign.currentAmount >= campaign.goalAmount) {
        goalReached = true;
    }
    
    return res.status(201).send({
        donor: donor,
        donationAmount: req.body.donationAmount,
        donation: donation,
        campaign: campaign,
        goalReached: goalReached
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};