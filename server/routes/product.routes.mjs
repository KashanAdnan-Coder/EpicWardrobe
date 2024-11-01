import express from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, addReview, getProductReviews, deleteReview } from "../controller/product.controller.mjs";
import upload from "../utils/multer.mjs";

const router = express.Router();

// Product routes
router.post("/", upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

// Review routes
router.post("/:id/reviews", addReview);
router.get("/:id/reviews", getProductReviews);
router.delete("/:id/reviews/:reviewId", deleteReview);

export default router;

