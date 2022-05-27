const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "nasa",
  port: 5432,
});

async function nuevoUsuario(email, nombre, password) {
  const result = await pool.query(
    `INSERT INTO usuarios (email, nombre, password, auth) values ('${email}', '${nombre}', '${password}', false) RETURNING *`
  );
  const usuario = result.rows[0];
  return usuario;
}

async function getUsuarios() {
  try {
    const result = await pool.query(`SELECT * FROM usuarios`);
    return result.rows;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getUsuarioByEmail(email) {
  try {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE email = '${email}'`
    );
    return result.rows[0];
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function setUsuarioStatus(id, auth) {
  try {
    const result = await pool.query(
      `UPDATE usuarios SET auth = ${auth} WHERE id = ${id} RETURNING *`
    );
    const usuario = result.rows[0];
    return usuario;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports = {
  nuevoUsuario,
  getUsuarios,
  getUsuarioByEmail,
  setUsuarioStatus,
};

// CREATE DATABASE nasa;
// \c nasa
// CREATE TABLE usuarios (id SERIAL, email varchar(50), nombre varchar(50), password varchar(50), auth BOOLEAN);
