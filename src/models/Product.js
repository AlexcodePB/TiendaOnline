const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    description: {
      type: String,
      required: [true, "La descripción del producto es requerida"],
      trim: true,
      minlength: [10, "La descripción debe tener al menos 10 caracteres"],
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio del producto es requerido"],
      min: [0, "El precio no puede ser negativo"],
      validate: {
        validator: function (value) {
          return Number.isFinite(value) && value >= 0;
        },
        message: "El precio debe ser un número válido mayor o igual a 0",
      },
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    stock: {
      type: Number,
      required: [true, "El stock del producto es requerido"],
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value) && value >= 0;
        },
        message: "El stock debe ser un número entero mayor o igual a 0",
      },
    },
    category: {
      type: String,
      required: [true, "La categoría del producto es requerida"],
      trim: true,
      enum: {
        values: [
          "tables",
          "wheels",
          "trucks",
          "bearings",
          "grip-tape",
          "hardware",
          "tools",
          "clothing",
          "accessories",
        ],
        message: "La categoría debe ser una de las opciones válidas",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model("Product", productSchema);
