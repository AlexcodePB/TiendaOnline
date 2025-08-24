class FilterService {
  static buildFilter(query, allowedFilters = {}) {
    const filter = {};
    
    Object.keys(query).forEach(key => {
      const value = query[key];
      
      if (!value || !allowedFilters[key]) return;
      
      const filterConfig = allowedFilters[key];
      
      switch (filterConfig.type) {
        case 'exact':
          filter[key] = value;
          break;
          
        case 'range':
          if (key.startsWith('min')) {
            const field = filterConfig.field;
            if (!filter[field]) filter[field] = {};
            filter[field].$gte = parseFloat(value);
          } else if (key.startsWith('max')) {
            const field = filterConfig.field;
            if (!filter[field]) filter[field] = {};
            filter[field].$lte = parseFloat(value);
          }
          break;
          
        case 'search':
          filter.$text = { $search: value };
          break;
          
        case 'regex':
          filter[filterConfig.field] = { 
            $regex: new RegExp(value, 'i') 
          };
          break;
          
        case 'boolean':
          filter[key] = value === 'true';
          break;
          
        case 'date':
          if (key.includes('After')) {
            const field = filterConfig.field;
            if (!filter[field]) filter[field] = {};
            filter[field].$gte = new Date(value);
          } else if (key.includes('Before')) {
            const field = filterConfig.field;
            if (!filter[field]) filter[field] = {};
            filter[field].$lte = new Date(value);
          }
          break;
          
        case 'stock':
          if (value === 'available') {
            filter.stock = { $gt: 0 };
          } else if (value === 'outOfStock') {
            filter.stock = { $eq: 0 };
          }
          break;
      }
    });
    
    return filter;
  }
  
  static buildSortOptions(sortBy) {
    const sortOptions = {};
    
    if (!sortBy) return { createdAt: -1 };
    
    switch (sortBy) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'name_asc':
        sortOptions.name = 1;
        break;
      case 'name_desc':
        sortOptions.name = -1;
        break;
      case 'date_asc':
        sortOptions.createdAt = 1;
        break;
      case 'date_desc':
      default:
        sortOptions.createdAt = -1;
        break;
    }
    
    return sortOptions;
  }
  
  static getPaginationData(page, limit, total) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const skip = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(total / itemsPerPage);
    
    return {
      skip,
      limit: itemsPerPage,
      pagination: {
        currentPage,
        totalPages,
        total,
        hasNextPage: skip + itemsPerPage < total,
        hasPrevPage: currentPage > 1,
        itemsPerPage
      }
    };
  }
  
  static validateFilterParams(query, allowedFilters) {
    const errors = [];
    
    Object.keys(query).forEach(key => {
      if (['page', 'limit', 'sort'].includes(key)) return;
      
      if (!allowedFilters[key]) {
        errors.push(`Filtro '${key}' no permitido`);
      }
    });
    
    if (query.page && (isNaN(query.page) || parseInt(query.page) < 1)) {
      errors.push('El parámetro page debe ser un número mayor a 0');
    }
    
    if (query.limit && (isNaN(query.limit) || parseInt(query.limit) < 1 || parseInt(query.limit) > 100)) {
      errors.push('El parámetro limit debe ser un número entre 1 y 100');
    }
    
    return errors;
  }
}

module.exports = FilterService;