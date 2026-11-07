# Evidencias del laboratorio 12

Aplicación desplegada: https://lab-12-supabase-next.vercel.app

[Word final del laboratorio](../GLAB-S12-Entrega-Final.docx)

- `procedimiento/`: configuración de PostgreSQL en Supabase, TablePlus y pruebas del procedimiento.
- `tarea/`: capturas de la web desplegada, Supabase, consulta JOIN en TablePlus, búsqueda avanzada, estadísticas, CRUD en Thunder Client contra Vercel y vista móvil iPhone 16.
- `../resultados-integracion.json`: 26 pruebas correctas ejecutadas contra Vercel.
- `../verificacion-cierre.json`: conexión y comprobación de que los dos registros temporales eliminados responden 404.

Las capturas `crud-*` muestran POST, GET, PUT y DELETE reales contra Vercel. Los dos DELETE respondieron 204 y se eliminaron únicamente los registros temporales autorizados. Las capturas originales se conservan con su resolución; no se recortaron las nuevas ventanas.

La vista móvil corresponde a emulación de Chrome (393 × 852 píxeles CSS), no a un teléfono físico. La aplicación de demostración tiene operaciones de edición públicas; antes de usar datos sensibles debe añadirse autenticación y autorización.
