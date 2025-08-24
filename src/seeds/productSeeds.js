const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const productos = [
  // TABLES
  {
    name: 'Element Section 8.25"',
    description:
      "Tabla de skateboard Element con gráfico Section, 8.25 pulgadas de ancho, construida con maple canadiense de 7 capas para máxima durabilidad.",
    price: 79.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 15,
    category: "tables",
  },
  {
    name: 'Almost Daewon Song Impact 8.0"',
    description:
      "Tabla profesional Almost con gráfico signature de Daewon Song, 8.0 pulgadas, construcción Impact Light para mejor resistencia.",
    price: 84.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 12,
    category: "tables",
  },
  {
    name: 'Flip Odyssey Decay 8.13"',
    description:
      "Tabla Flip con diseño Odyssey Decay, 8.13 pulgadas, maple premium con presión extra para skateboarding técnico.",
    price: 89.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 10,
    category: "tables",
  },
  {
    name: 'Element Nyjah Reflect 8.0"',
    description:
      "Tabla signature de Nyjah Huston para Element, 8.0 pulgadas con gráfico reflectante y construcción profesional.",
    price: 94.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 8,
    category: "tables",
  },

  // WHEELS
  {
    name: "Spitfire Formula Four 99D 54mm",
    description:
      "Ruedas Spitfire Formula Four con dureza 99D y 54mm de diámetro, perfectas para street skating con agarre excepcional.",
    price: 59.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 25,
    category: "wheels",
  },
  {
    name: "Bones 100's OG Formula 53mm",
    description:
      "Ruedas clásicas Bones 100's con fórmula original, 53mm de diámetro, ideales para skaters que buscan velocidad y control.",
    price: 49.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 30,
    category: "wheels",
  },
  {
    name: "Ricta Clouds 92A 56mm",
    description:
      "Ruedas suaves Ricta Clouds 92A de 56mm, perfectas para cruising y superficies rugosas con rodamiento silencioso.",
    price: 44.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 20,
    category: "wheels",
  },

  // TRUCKS
  {
    name: "Independent Stage 11 149mm",
    description:
      "Trucks Independent Stage 11 de 149mm, construcción forjada con geometría mejorada para mejor respuesta y durabilidad.",
    price: 119.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 18,
    category: "trucks",
  },
  {
    name: "Thunder Hollow Lights 148mm",
    description:
      "Trucks Thunder Hollow Lights de 148mm, diseño hueco para reducir peso manteniendo la resistencia.",
    price: 109.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 22,
    category: "trucks",
  },
  {
    name: "Venture V-Lights 145mm",
    description:
      "Trucks Venture V-Lights de 145mm con aleación liviana y pivote resistente, ideales para street skating.",
    price: 99.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 15,
    category: "trucks",
  },

  // BEARINGS
  {
    name: "Bones Reds Bearings",
    description:
      "Rodamientos clásicos Bones Reds, single shield con lubricación Speed Cream, el estándar de la industria.",
    price: 19.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 50,
    category: "bearings",
  },
  {
    name: "Bones Swiss 6-Ball",
    description:
      "Rodamientos premium Bones Swiss con 6 bolas de acero inoxidable, precisión suiza para máxima velocidad.",
    price: 89.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 25,
    category: "bearings",
  },
  {
    name: "Bones Super Reds",
    description:
      "Rodamientos Bones Super Reds con diseño single shield y lubricación superior, upgrade perfecto de los Reds.",
    price: 29.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 35,
    category: "bearings",
  },

  // GRIP TAPE
  {
    name: "Mob Grip Tape Black",
    description:
      "Lija clásica Mob Grip en negro, adhesivo ultra fuerte con burbujas de aire minimizadas, fácil aplicación.",
    price: 8.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 40,
    category: "grip-tape",
  },
  {
    name: "Jessup Griptape Clear",
    description:
      "Lija transparente Jessup para mostrar el gráfico de la tabla, misma adherencia que la lija tradicional.",
    price: 12.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 20,
    category: "grip-tape",
  },

  // HARDWARE
  {
    name: 'Independent Phillips Hardware 1"',
    description:
      "Tornillos Independent Phillips de 1 pulgada, acero endurecido con cabeza Phillips para fácil instalación.",
    price: 4.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 60,
    category: "hardware",
  },
  {
    name: 'Shake Junt Allen Hardware 7/8"',
    description:
      "Tornillos hexagonales Shake Junt de 7/8 pulgadas con llave Allen incluida, construcción resistente.",
    price: 6.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 45,
    category: "hardware",
  },

  // TOOLS
  {
    name: "Independent Multi-Tool",
    description:
      "Herramienta multifunción Independent con llaves para trucks, tuerca de ruedas y destornillador, imprescindible para cualquier skater.",
    price: 14.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 30,
    category: "tools",
  },

  // CLOTHING
  {
    name: "Element Tree Logo Tee",
    description:
      "Camiseta clásica Element con logo del árbol, 100% algodón, corte regular, disponible en varios colores.",
    price: 24.99,
    image: {
      url: "https://www.obsession.si/images/thumbs/0669781_element-section-825-assorted-825_1000.jpeg",
      public_id: "table-element_x8vqyp",
    },
    stock: 50,
    category: "clothing",
  },
];

const seedProducts = async () => {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    console.log("Eliminando productos existentes...");
    await Product.deleteMany({});
    console.log("✅ Productos existentes eliminados");

    console.log("Creando productos de skate...");
    const productosCreados = await Product.create(productos);
    console.log(
      `✅ ${productosCreados.length} productos de skate creados exitosamente`
    );

    console.log("\n🛹 Productos por categoría:");
    const categorias = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    categorias.forEach((cat) => {
      console.log(`- ${cat._id}: ${cat.count} productos`);
    });

    console.log("\n🎉 Seeds de productos de skate ejecutados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error ejecutando seeds de productos:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, productos };
