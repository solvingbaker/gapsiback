const fs = require("fs");

// Path to the JSON file containing the supplier data
const filePath = "./bd.json";

// Function to add a new supplier
const addSupplier = (req, res) => {
  try {
    // Read the new supplier's data from the request body
    const newSupplier = req.body;

    // Read JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          error: "Error reading JSON file" + err,
        });
      }

      // Convert the data to a JavaScript object
      const suppliers = JSON.parse(data);

      // Obtener los datos del proveedor del cuerpo de la solicitud
      const { name, companyName, address } = req.body;

      // Generar un nuevo ID para el proveedor
      const id =
        suppliers.length > 0 ? suppliers[suppliers.length - 1].id + 1 : 1;

      // Crear el nuevo proveedor
      const newSupplier = {
        id,
        name: name, 
        companyName: companyName,
        address: address,
      };

      // Add the new supplier to the list
      suppliers.push(newSupplier);

      // Write the updated list of suppliers in the JSON file
      fs.writeFile(
        filePath,
        JSON.stringify(suppliers, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return res.status(500).json({
              code: 500,
              error: "Error writing to JSON file: " + err,
            });
          }
          res.status(201).json({
            code: 201,
            message: "Supplier successfully added",
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: "Internal server error",
    });
  }
};

// Function to obtain all suppliers
const getSuppliers = (req, res) => {
  try {
    // Read JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          error: "Error writing to JSON file: " + err,
        });
      }

      // Convert the data to a JavaScript object
      const suppliers = JSON.parse(data);

      // Send the list of suppliers as a response
      res.status(200).json(suppliers);
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: "Internal server error",
    });
  }
};

// Function to remove a supplier
const deleteSupplier = (req, res) => {
  try {
    const { id } = req.params;

    // Read JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          error: "Error writing to JSON file: " + err,
        });
      }

      // Convert the data to a JavaScript object
      let suppliers = JSON.parse(data);

      // Check if the supplier exists
      const index = suppliers.findIndex(
        (supplier) => supplier.id === parseInt(id)
      );
      if (index === -1) {
        return res.status(404).json({
          code: 404,
          error: "Supplier not found",
        });
      }

      // Remove the supplier from the list
      suppliers.splice(index, 1);

      // Write the updated list of suppliers in the JSON file
      fs.writeFile(
        filePath,
        JSON.stringify(suppliers, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return res.status(500).json({
              code: 500,
              error: "Internal server error",
            });
          }
          res.status(200).json({
            code: 200,
            message: "Supplier successfully removed",
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: "Internal server error",
    });
  }
};

module.exports = {
  addSupplier,
  getSuppliers,
  deleteSupplier,
};
