import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minLength: [3, "Product name must be at least 3 characters"],
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        minLength: [10, "Description must be at least 10 characters"],
        maxLength: [1000, "Description cannot exceed 1000 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
        validate: {
            validator: Number.isFinite,
            message: "Price must be a valid number"
        }
    },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
        validate: {
            validator: Number.isInteger,
            message: "Stock must be a whole number"
        }
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, "Product image URL is required"],
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: "Please enter a valid image URL"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    strict: true,
    strictQuery: true,
    timestamps: true
});

// Pre-save middleware to update 'updatedAt' timestamp
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
