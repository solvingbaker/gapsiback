const fs = require("fs");
const supertest = require("supertest");
const app = require("../../app"); 
const { checkDuplicateSupplier } = require("./suppliersMiddleware");

// Mock de fs.readFile
jest.mock("fs");

describe("checkDuplicateSupplier middleware", () => {
  it("should call next if the supplier does not exist", async () => {
    const req = {
      body: {
        name: "New Supplier",
      },
    };
    const res = {};
    const next = jest.fn();

    // Mock de fs.readFile para que devuelva una lista vacía de proveedores
    fs.readFile.mockImplementationOnce((path, options, callback) => {
      callback(null, JSON.stringify([]));
    });

    await checkDuplicateSupplier(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if the supplier already exists", async () => {
    const req = {
      body: {
        name: "Existing Supplier",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock de fs.readFile para que devuelva una lista con un proveedor existente
    fs.readFile.mockImplementationOnce((path, options, callback) => {
      callback(null, JSON.stringify([{ name: "Existing Supplier" }]));
    });

    await checkDuplicateSupplier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: 400,
      error: "The supplier is already in existence",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle internal server error", async () => {
    const req = {
      body: {
        name: "New Supplier",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mock de fs.readFile para que lance un error
    fs.readFile.mockImplementationOnce((path, options, callback) => {
      throw new Error("Error reading JSON file");
    });

    await checkDuplicateSupplier(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: 500,
      error: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
