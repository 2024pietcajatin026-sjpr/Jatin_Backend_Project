const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');

const router = express.Router();

function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }
  next();
}

// POST /books — create a book
router.post('/', async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// GET /books — list all books
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({ count: books.length, books });
  } catch (error) {
    next(error);
  }
});

// GET /books/:id — get one book
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json({ book });
  } catch (error) {
    next(error);
  }
});

// PUT /books/:id — update a book
router.put('/:id', validateId, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// DELETE /books/:id — delete a book
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json({ message: 'Book deleted successfully', book });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
