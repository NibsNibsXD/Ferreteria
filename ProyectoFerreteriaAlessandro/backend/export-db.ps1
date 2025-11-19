# Script para exportar la base de datos PostgreSQL en Windows
# Ferretería Alessandro

# Variables (ajustar según tu configuración)
$DB_NAME = "ferreteria_alessandro_db"
$DB_USER = "postgres"
$DB_HOST = "localhost"
$DB_PORT = "5432"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$OUTPUT_FILE = "ferreteria_alessandro_$TIMESTAMP.sql"

Write-Host "Exportando base de datos $DB_NAME..." -ForegroundColor Cyan

# Exportar la base de datos desde el contenedor Docker
docker exec -t ferreteria_alessandro_db pg_dump -U $DB_USER -d $DB_NAME --clean --if-exists | Out-File -FilePath $OUTPUT_FILE -Encoding UTF8

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Base de datos exportada exitosamente: $OUTPUT_FILE" -ForegroundColor Green
    Write-Host "Puedes enviar este archivo para compartir la base de datos" -ForegroundColor Yellow
} else {
    Write-Host "✗ Error al exportar la base de datos" -ForegroundColor Red
    exit 1
}
