const fs = require("fs");

// Path to the JSON file containing the supplier data
const filePath = "./bd.json";

// Function to check if the supplier already exists
const checkDuplicateSupplier = (req, res, next) => {
  try {
    const newSupplierName = req.body.name;

    // Read JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          error: "Error reading JSON file" + err,
        });
      }

      // Convert data to a JavaScript object
      const suppliers = JSON.parse(data);

      // Check if the supplier already exists by name
      const existingSupplier = suppliers.find(
        (supplier) => supplier.name === newSupplierName
      );

      if (existingSupplier) {
        return res.status(400).json({
          code: 400,
          error: "The supplier is already in existence",
        });
      }

      // If the supplier does not exist, go to the next to controller
      next();
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: "Internal server error",
    });
  }
};

module.exports = {
  checkDuplicateSupplier,
};
