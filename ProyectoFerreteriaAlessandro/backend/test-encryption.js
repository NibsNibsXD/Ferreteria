const bcrypt = require('bcrypt');

async function testEncryption() {
  console.log('\n=== Prueba de Encriptación con bcrypt ===\n');

  // Contraseña de prueba
  const password = 'MiContraseña123';
  console.log('Contraseña original:', password);

  // Generar salt y hash
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  console.log('\nSalt generado:', salt);

  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Contraseña encriptada:', hashedPassword);

  // Verificar que la contraseña coincide
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('\n¿Contraseña correcta?', isMatch);

  // Probar con contraseña incorrecta
  const wrongPassword = 'ContraseñaIncorrecta';
  const isWrongMatch = await bcrypt.compare(wrongPassword, hashedPassword);
  console.log('¿Contraseña incorrecta funciona?', isWrongMatch);

  // Probar múltiples encriptaciones de la misma contraseña
  console.log('\n=== Encriptaciones múltiples de la misma contraseña ===');
  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash(password, 10);
  const hash3 = await bcrypt.hash(password, 10);
  
  console.log('Hash 1:', hash1);
  console.log('Hash 2:', hash2);
  console.log('Hash 3:', hash3);
  console.log('\n¿Todos son diferentes?', hash1 !== hash2 && hash2 !== hash3);
  console.log('¿Todos validan correctamente?', 
    await bcrypt.compare(password, hash1) && 
    await bcrypt.compare(password, hash2) && 
    await bcrypt.compare(password, hash3)
  );

  console.log('\n✅ Encriptación funcionando correctamente!\n');
}

testEncryption().catch(console.error);
