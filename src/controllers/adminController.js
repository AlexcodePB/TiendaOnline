const Product = require('../models/Product');

const getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });
    
    const simulatedSales = [
      { month: 'Enero', sales: 1200 },
      { month: 'Febrero', sales: 1900 },
      { month: 'Marzo', sales: 1400 },
      { month: 'Abril', sales: 2100 },
      { month: 'Mayo', sales: 1800 },
      { month: 'Junio', sales: 2300 }
    ];

    const stats = {
      users: 120,
      products: totalProducts,
      orders: 256,
      revenue: 15230.50,
      lowStockProducts,
      simulatedSales
    };

    res.json({
      message: "Estadísticas del panel de administración obtenidas con éxito.",
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas', details: error.message });
  }
};

module.exports = {
  getAdminStats,
};
