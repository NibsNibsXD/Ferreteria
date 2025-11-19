#!/usr/bin/env node

/**
 * Script de prueba para el sistema de autenticación
 * Ejecutar con: node testAuth.js
 */

const { hashPassword, comparePassword, validatePassword } = require('./utils/passwordUtils');

async function testPasswordUtils() {
  console.log('🔐 Probando utilidades de contraseñas...\n');

  // Prueba 1: Validación de contraseña
  console.log('📋 Prueba 1: Validación de contraseñas');
  const passwords = [
    'corta',           // Muy corta
    'PasswordSegura123', // Válida
    ''                 // Vacía
  ];

  passwords.forEach(pwd => {
    const result = validatePassword(pwd);
    console.log(`  "${pwd}": ${result.isValid ? '✅' : '❌'} ${result.message}`);
  });

  // Prueba 2: Encriptación de contraseña
  console.log('\n🔒 Prueba 2: Encriptación de contraseña');
  const passwordOriginal = 'MiPasswordSegura123';
  console.log(`  Contraseña original: ${passwordOriginal}`);
  
  try {
    const hashedPassword = await hashPassword(passwordOriginal);
    console.log(`  ✅ Contraseña encriptada: ${hashedPassword}`);
    console.log(`  📏 Longitud del hash: ${hashedPassword.length} caracteres`);

    // Prueba 3: Comparación de contraseñas
    console.log('\n🔍 Prueba 3: Comparación de contraseñas');
    
    const correctPassword = 'MiPasswordSegura123';
    const wrongPassword = 'PasswordIncorrecta';

    const matchCorrect = await comparePassword(correctPassword, hashedPassword);
    console.log(`  Contraseña correcta: ${matchCorrect ? '✅ Coincide' : '❌ No coincide'}`);

    const matchWrong = await comparePassword(wrongPassword, hashedPassword);
    console.log(`  Contraseña incorrecta: ${matchWrong ? '✅ Coincide' : '❌ No coincide'}`);

    // Prueba 4: Múltiples hash de la misma contraseña
    console.log('\n🎲 Prueba 4: Unicidad de hash');
    const hash1 = await hashPassword(passwordOriginal);
    const hash2 = await hashPassword(passwordOriginal);
    console.log(`  Hash 1: ${hash1.substring(0, 30)}...`);
    console.log(`  Hash 2: ${hash2.substring(0, 30)}...`);
    console.log(`  ¿Son diferentes? ${hash1 !== hash2 ? '✅ Sí' : '❌ No'}`);
    console.log('  (Esto es correcto: cada hash debe ser único debido al salt aleatorio)');

    // Prueba 5: Tiempo de encriptación
    console.log('\n⏱️  Prueba 5: Tiempo de encriptación');
    const iterations = 5;
    console.log(`  Encriptando ${iterations} contraseñas...`);
    const startTime = Date.now();
    
    for (let i = 0; i < iterations; i++) {
      await hashPassword(`password${i}`);
    }
    
    const endTime = Date.now();
    const avgTime = (endTime - startTime) / iterations;
    console.log(`  ✅ Tiempo promedio: ${avgTime.toFixed(2)}ms por contraseña`);

    console.log('\n✨ Todas las pruebas completadas exitosamente!\n');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testPasswordUtils();
