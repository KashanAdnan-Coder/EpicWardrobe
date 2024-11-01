import Product from "../models/product.model.mjs";
import { v2 as cloudinary } from 'cloudinary';

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a product image"
            });
        }

        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            imageUrl: result.secure_url
        });

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // If new image is uploaded
        if (req.file) {
            // Delete old image from cloudinary
            const urlArray = product.imageUrl.split('/');
            const imageId = urlArray[urlArray.length - 1].split('.')[0];
            await cloudinary.uploader.destroy(imageId);

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.imageUrl = result.secure_url;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete image from cloudinary
        const urlArray = product.imageUrl.split('/');
        const imageId = urlArray[urlArray.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(imageId);

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add review
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const review = {
            user: req.user._id, // Assuming you have user authentication middleware
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);

        // Update overall rating
        const avg = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        product.ratings = avg;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Review added successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get product reviews
const getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Filter out the review to be deleted
        const reviews = product.reviews.filter(
            review => review._id.toString() !== req.params.reviewId.toString()
        );

        // Update ratings
        let ratings = 0;
        if (reviews.length > 0) {
            ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        }

        // Update product
        await Product.findByIdAndUpdate(req.params.id, {
            reviews,
            ratings
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addReview,
    getProductReviews,
    deleteReview
};
