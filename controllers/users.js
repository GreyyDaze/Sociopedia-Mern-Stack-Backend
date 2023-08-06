import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        //from front end getting user_id and friendID
        const { id } = req.params;
        //get all the info of the user by id 
        const user = await User.findById(id);

        //send the data of user back
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        //from front end getting user_id
        const { id } = req.params;
        //get all the info of the user by id from User table
        const user = await User.findById(id);

        //get array of user friends and then using map get each friend information from User table
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        //obtain user info from resolved promises array in this format and return in this format
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        //from front end getting user_id and friendID
        const { id, friendId } = req.params;
        //get all the info of the user by id 
        const user = await User.findById(id);
        //get all the info of the friend by id 
        const friend = await User.findById(id);

        //check if array of friends id of user include friendId
        if (user.friends.includes(friendId)) {
            //return id from array which is not equal to friendId and return array
            user.friends = user.friends.filter((id) => id !== friendId);
            //return id from array which is not equal to user_id and return array
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            //push friendId in user info
            user.friends.push(friendId);
            //push userId in friend info
            friend.friends.push(id);
        }
        //update database now as user and friend object modified
        await user.save();
        await friend.save();

        // doing this for frontend
        //get array of user friends and then using map get each friend information from User table
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        //obtain user info from resolved promises array in this format and return in this format
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        //send the data of  userfriends back
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};