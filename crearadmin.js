const bcrypt = require('bcryptjs');
const db = require('./config/db'); // Asegúrate de que la ruta es correcta

async function createAdmin() {
  const adminData = {
    name: 'Admin',
    email: 'admin@ejemplo.com',
    password: 'Admin1234', // Contraseña en texto plano
    role: 'admin'
  };

  try {
    // Genera el hash CORRECTO
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    // Inserta en la base de datos
    const [result] = await db.pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [adminData.name, adminData.email, hashedPassword, adminData.role]
    );

    console.log('✅ Admin creado correctamente. ID:', result.insertId);
    console.log('Hash generado:', hashedPassword);
  } catch (error) {
    console.error('❌ Error al crear admin:', error);
  }
}

createAdmin();