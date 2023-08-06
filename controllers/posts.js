import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        //from front end getting user_id, description and picturePath
        const { userId, description, picturePath } = req.body;
        //get all the info of the user by using the userid 
        const user = await User.findById(userId);

        //  creating a new post instance
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picturePath,
            userPicturePath: user.picturePath,
            like: {},
            comments: [],
        });

        // saving the post to the database
        await newPost.save();

        //bring all the post from the Post collection
        const post = await Post.find();

        // Send a success response with the saved user object
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        //fetch all the post from Post collection
        const post = await Post.find();

        // Send a success response with the saved user object
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        //from front end getting user_id
        const { userId } = req.params;
        //get all the info of the user having id saved in userId 
        const user = await User.findById(userId);
        
        //find all the post of the user by using user id in Post table
        const post = await Post.find({ userId });
        
        // Send a success response with the saved user object
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        //from front end getting postid and user_id
        const { id } = req.params;
        const { userId } = req.body;
        //get all the info of the post by id 
        const post = await User.findById(id);
        //if in like of post is there user id 
        const isLiked = post.like.get(userId);

        //if there delete userId 
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            //otherwise set the value of like map object to true
            post.likes.set(userId, true);
        }

        //find the post and update the post and return the updated post 
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes : post.likes },
            { new: true }
        ); 
        
        // Send a success response with the saved user object
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};