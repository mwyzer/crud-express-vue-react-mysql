// Import necessary modules
const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");

// Function to find all users
const findUsers = async (req, res) => {
  try {
    // Get all users from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    // Send response
    res.status(200).send({
      success: true,
      message: "Get all users successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to create a user
const createUser = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Insert data
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to find a user by ID
const findUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Get user by ID
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: `User with ID: ${id} not found`,
      });
    }

    // Send response
    res.status(200).send({
      success: true,
      message: `Get user by ID: ${id} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update user
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });

    // Send response
    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//function deleteUser
const deleteUser = async (req, res) => {
  //get ID from params
  const { id } = req.params;

  try {
    //delete user
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    //send response
    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  findUsers,
  createUser,
  findUserById,
  updateUser,
  deleteUser,
};
