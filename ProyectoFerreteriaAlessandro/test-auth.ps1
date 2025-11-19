# Script de Prueba de Autenticacion - Ferreteria Alessandro
# Ejecuta estos comandos en PowerShell uno por uno

Write-Host "Probando Sistema de Autenticacion" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# 1. Probar que la API esta funcionando
Write-Host "1. Probando conexion a la API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/test" -Method Get
    Write-Host "OK - API funcionando: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# 2. Registrar un nuevo usuario
Write-Host "2. Registrando nuevo usuario..." -ForegroundColor Yellow
$nuevoUsuario = @{
    nombre = "Usuario Prueba"
    correo = "prueba@ferreteria.com"
    contrasena = "Password123"
    id_rol = 2
    id_sucursal = 1
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method Post -Body $nuevoUsuario -ContentType "application/json"
    Write-Host "OK - Usuario registrado: $($response.usuario.nombre)" -ForegroundColor Green
    Write-Host "   Correo: $($response.usuario.correo)" -ForegroundColor Gray
    Write-Host "   ID: $($response.usuario.id_usuario)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "AVISO - Usuario ya existe (esto es normal)" -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: $_" -ForegroundColor Red
    }
}
Write-Host ""

# 3. Hacer login
Write-Host "3. Iniciando sesion..." -ForegroundColor Yellow
$credenciales = @{
    correo = "prueba@ferreteria.com"
    contrasena = "Password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $credenciales -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "OK - Login exitoso!" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.usuario.nombre)" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host ""
    
    # 4. Acceder a ruta protegida
    Write-Host "4. Accediendo a ruta protegida..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" -Method Get -Headers $headers
    Write-Host "OK - Acceso exitoso a ruta protegida!" -ForegroundColor Green
    Write-Host ""
    
    # 5. Intentar acceder sin token
    Write-Host "5. Probando seguridad (sin token)..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/usuarios" -Method Get
        Write-Host "ERROR - Se pudo acceder sin token!" -ForegroundColor Red
    } catch {
        Write-Host "OK - Seguridad funcionando: Acceso denegado sin token" -ForegroundColor Green
    }
    Write-Host ""
    
    # 6. Listar usuarios (con token)
    Write-Host "6. Listando usuarios (con autenticacion)..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/usuarios" -Method Get -Headers $headers
        Write-Host "OK - Usuarios obtenidos: $($response.usuarios.Count) encontrados" -ForegroundColor Green
    } catch {
        Write-Host "AVISO - No se pudieron listar usuarios: $_" -ForegroundColor Yellow
    }
    Write-Host ""
    
} catch {
    Write-Host "ERROR en login: $_" -ForegroundColor Red
}

Write-Host "`nPruebas completadas!" -ForegroundColor Cyan

