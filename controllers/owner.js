import { Campaign } from "../models/Campaign.js";
import { Owner } from "../models/Owner.js";
import { User } from "../models/User.js";

/*
this will be called when a new Campaign contract is deployed.
Event emitted:
event CampaignContractCreated(address campaignContract, address owner, uint256 goalAmount);
  
request.body:
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
    try{
        // check if user is logged in
        if(!req.decodedUserId){
            return res.status(401).send({ message: "Access denied." });
        }

        // get the User object
        const userId = req.decodedUserId;
        let user = await User.findById(userId);
        if(!user){
            return res.status(401).send({ message: "Register first." });
        }

        // validate body
        if(
            !req.body.contractAddress ||
            !req.body.ownerPublicKey ||
            !req.body.goalAmount ||
            !req.body.title ||
            !req.body.description ||
            !req.body.tags
        ) {
            return res.status(400).send({
                message: "Send all fields: contractAddress, ownerPublicKey, goalAmount, title, description, tags"
            })
        }
        
        // create new Owner
        const owner = await Owner.findOne({ ownerData: userId });
        if(!owner) {
            const newOwner = await Owner.create({
                publicKey: req.body.ownerPublicKey,
                ownerData: user,
            });
            owner = newOwner;
        }

        // create new Campaign 
        const newCampaign = {
            contractAddress: req.body.contractAddress,
            owner: owner,
            title: req.body.title,
            description: req.body.description,
            goalAmount: req.body.goalAmount,
            currentAmount: 0,
            finalAmount: 0,
            campaignState: "active",
            tags: req.body.tags
        }
        const campaign = await Campaign.create(newCampaign);

        // update owner's "campaigns" field
        owner.campaigns.push(campaign);
        await owner.save();

        // update "role" field of User
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId},
            { $set: {role: "owner"}},
            {new: true}
        );

        if(!updatedUser){
            return res.status(404).send({ message: "User not found."});
        }

        return res.status(201).send({
            owner: owner,
            campaign: campaign,
            updatedUser: updatedUser
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
};