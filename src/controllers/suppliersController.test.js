const fs = require("fs");
const {
  addSupplier,
  getSuppliers,
  deleteSupplier,
} = require("./suppliersController");

// Mocking fs.readFile and fs.writeFile
jest.mock("fs");

describe("suppliersController", () => {
  // Test addSupplier function
  describe("addSupplier", () => {
    it("should add a new supplier successfully", async () => {
      const req = {
        body: {
          name: "New Supplier",
          companyName: "New Company",
          address: "123 New Street",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile.mockImplementationOnce((path, options, callback) => {
        callback(null, JSON.stringify([]));
      });
      fs.writeFile.mockImplementationOnce((path, data, options, callback) => {
        callback(null);
      });

      await addSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        message: "Supplier successfully added",
      });
    });

    it("should handle internal server error while adding supplier", async () => {
      const req = {
        body: {
          name: "New Supplier",
          companyName: "New Company",
          address: "123 New Street",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile.mockImplementationOnce((path, options, callback) => {
        throw new Error("Error reading JSON file");
      });

      await addSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        error: "Internal server error",
      });
    });
  });

  // Test getSuppliers function
  describe("getSuppliers", () => {
    it("should get all suppliers successfully", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile.mockImplementationOnce((path, options, callback) => {
        callback(null, JSON.stringify([{ id: 1, name: "Supplier 1" }]));
      });

      await getSuppliers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, name: "Supplier 1" }]);
    });

    it("should handle internal server error while getting suppliers", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile.mockImplementationOnce((path, options, callback) => {
        throw new Error("Error reading JSON file");
      });

      await getSuppliers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        error: "Internal server error",
      });
    });
  });

  // Test deleteSupplier function
  describe("deleteSupplier", () => {
    it("should delete a supplier successfully", async () => {
      const req = {
        params: {
          id: "1",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile.mockImplementationOnce((path, options, callback) => {
        callback(null, JSON.stringify([{ id: 1, name: "Supplier 1" }]));
      });
      fs.writeFile.mockImplementationOnce((path, data, options, callback) => {
        callback(null);
      });

      await deleteSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        message: "Supplier successfully removed",
      });
    });

    it("should handle internal server error while deleting supplier", async () => {
      const req = {
        params: {
          id: "1",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile.mockImplementationOnce((path, options, callback) => {
        throw new Error("Error reading JSON file");
      });

      await deleteSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        error: "Internal server error",
      });
    });

    it("should handle supplier not found", async () => {
      const req = {
        params: {
          id: "2",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile.mockImplementationOnce((path, options, callback) => {
        callback(null, JSON.stringify([{ id: 1, name: "Supplier 1" }]));
      });

      await deleteSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        error: "Supplier not found",
      });
    });
  });
});
