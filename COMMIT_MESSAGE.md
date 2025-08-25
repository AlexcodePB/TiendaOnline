feat: Implementar sistema de filtros avanzados y correcciones de seguridad

## 🚀 Nuevas Implementaciones

### Sistema de Filtros Reutilizable
- **FilterService** (`src/services/filterService.js`): Módulo centralizado para filtros, paginación y ordenamiento
- Soporte para 6 tipos de filtros: exact, range, search, regex, boolean, date, stock
- Validación automática de parámetros con mensajes de error descriptivos
- Ordenamiento por múltiples campos (precio, nombre, fecha)
- Paginación mejorada con metadata completa

### Filtros Avanzados para Productos
- **Nuevos filtros**: `inStock`, `stock`, `sort` con múltiples opciones
- **Ordenamiento**: price_asc/desc, name_asc/desc, date_asc/desc
- Refactorización completa usando FilterService
- Filtros aplicados tanto en `/products` como `/products/category/:category`

### Filtros para Usuarios (Solo Admin)
- **Filtros implementados**: role, search (nombre), email, createdAfter, createdBefore
- Paginación completa con ordenamiento
- Exclusión automática de passwords en respuestas
- Validación de parámetros con errores específicos

### Correcciones de Seguridad
- **userController**: Agregada autorización admin para deleteUser
- **productController**: Validación de estructura de imagen {url, public_id}
- Consistencia completa entre modelo, controlador y seeds

### Documentación Actualizada
- README con ejemplos completos de todos los filtros
- Documentación de parámetros de ordenamiento y paginación
- Ejemplos de curl actualizados con nuevas funcionalidades

## 🛠️ Archivos Modificados
- `src/services/filterService.js` (nuevo)
- `src/controllers/productController.js` (refactorizado)
- `src/controllers/userController.js` (filtros + seguridad)
- `README.md` (documentación completa)

🤖 Generado con [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>