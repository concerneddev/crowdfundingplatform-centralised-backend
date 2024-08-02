import { Campaign } from "../models/Campaign.js";
import { Owner } from "../models/Owner.js";
import { User } from "../models/User.js";

// create new Campaign and Owner fields.
/*
this will be called when a new Campaign contract is deployed.
Event emitted:
event CampaignContractCreated(address campaignContract, address owner, uint256 goalAmount);
  
request.body
{
    "contractAddress": "0xbc1615972af72d8f2f856967aec76d1e5856ffe9",
    "ownerPublicKey": "0x518EDf622626C876D894eF4E9F31CCA936C8A7F7",
    "title": "New Campaign",
    "description": "This is a new test campaign. I am testing in development.",
    "goalAmount": "100",
    "tags": ["new", "test", "demo"]
}    
 */
export const createCampaign = async (req, res) => {
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
      !req.body.ownerPublicKey ||
      !req.body.goalAmount ||
      !req.body.title ||
      !req.body.description ||
      !req.body.tags
    ) {
      return res.status(400).send({
        message:
          "Send all fields: contractAddress, ownerPublicKey, goalAmount, title, description, tags",
      });
    }

    // create new Owner
    let owner = await Owner.findOne({ ownerData: userId });
    if (!owner) {
      const newOwner = await Owner.create({
        publicKey: req.body.ownerPublicKey,
        ownerData: user,
      });
      owner = newOwner;
    }

    // create new Campaign
    const newCampaign = {
      contractAddress: req.body.contractAddress,
      owner: owner._id,
      title: req.body.title,
      description: req.body.description,
      goalAmount: req.body.goalAmount,
      currentAmount: 0,
      finalAmount: 0,
      campaignState: "active",
      tags: req.body.tags,
    };
    const campaign = await Campaign.create(newCampaign);

    // update owner's "campaigns" field
    owner.campaigns.push(campaign._id);
    await owner.save();

    // !!! MODIFY THIS LATER !!!
    user.role.push("owner");
    await user.save();

    return res.status(201).send({
      owner: owner,
      campaign: campaign,
      updatedUser: user
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

/*
owner can withdraw funds from the campaign
after a successful withdrawl, contract will emit this event:
emit CampaignClosed(s_finalAmount);

req.body
{
    "contractAddress": "0xbc1615972af72d8f2f856967aec76d1e5856ffe9",
    "finalAmount" : "10"
}
*/
export const withdrawCampaign = async (req, res) => {
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

    // check if the request is made by the owner
    const owner = await Owner.findOne({ ownerData: userId });
    if (!owner) {
      return res.status(401).send({ message: "Not the owner. " });
    }

    // validate fields
    if (
        !req.body.contractAddress ||
        !req.body.finalAmount
      ) {
        return res.status(400).send({
          message:
            "Send all fields: contractAddress, finalAmount",
        });
    }
    
    // update Campaign
    const contractAddress = req.body.contractAddress;
    const finalAmount = req.body.finalAmount;
    
    const updatedCampaign = await Campaign.findOneAndUpdate(
        { 
            contractAddress: contractAddress,
            owner: owner._id, // campaign belongs to the user
            campaignState: { $ne: "inactive" }, // campaign is active
        },
        { $set: { currentAmount: 0, finalAmount: finalAmount, campaignState: "inactive" }},
        { new: true }
    );

    if(!updatedCampaign) {
        return res.status(404).send({ 
            message: "Campaign not found, User not the owner or Campaign is inactive" 
        });
    }

    return res.status(201).send({
        updatedCampaign: updatedCampaign
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};