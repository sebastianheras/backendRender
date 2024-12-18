import { pool, pool1 } from '../db.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');
// const soaPrequest = require('easy-soap-request');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
// const jsdom = require("jsdom");

export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query('Select * from usuariosOrden');
    console.log(result);
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getName = async (req, res) => {
  try {
    const nombreCliente = req.query.nombreCliente;

    const [result] = await pool.query(
      `SELECT * FROM ordentrabajo where nombreCliente LIKE ?`,
      [`%${nombreCliente}%`]
    );
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUsersbyName = async (req, res) => {
  try {
    const nombreCliente = req.query.nombreCliente;
    const [result] = await pool.query(
      `SELECT DISTINCT nombreCliente FROM ordentrabajo WHERE nombreCliente LIKE ?`,
      [`%${nombreCliente}%`]
    );
    console.log(nombreCliente);
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const [result] = await pool.query(
      'Select * from usuariosOrden where name = ? and password = ?',
      [name, password]
    );
    if (
      result[0].name === name &&
      result[0].password === password &&
      (result[0].admin === 1 || result[0].admin === 2)
    ) {
      const user = { name: name, password: password };
      const accessToken = generateAccessToken(user);
      const datos = {
        user: name,
        mensaje: 'USUARIO AUTENTICADO',
        admin: result[0].admin,
        id: result[0].idusuariosOrden,
      };
      let ndatos = { ...datos, accessToken };
      res.status(200).json(ndatos);
    } else if (
      result[0].name === name &&
      result[0].password === password &&
      (result[0].admin === 3 || result[0].admin === 4)
    ) {
      const user = { name: name, password: password };
      const accessToken = generateAccessTokenAdmin(user);
      const datos = {
        user: name,
        mensaje: 'USUARIO SUPERADMINISTRADOR AUTENTICADO',
        admin: result[0].admin,
        id: result[0].idusuariosOrden,
      };
      let ndatos = { ...datos, accessToken };
      res.status(200).json(ndatos);
    } else {
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

function generateAccessToken(user) {
  return jwt.sign(user, 'normalX');
}

function generateAccessTokenAdmin(user) {
  return jwt.sign(user, 'adminX');
}

export function validateToken(req, res, next) {
  const accessToken = req.headers['authorization'];
  if (!accessToken) res.send('Acceso Denegado');
  jwt.verify(accessToken, 'normalX', (err, user) => {
    if (err) {
      res.send('Acceso denegado, token expirado o incorrecto');
    } else {
      next();
    }
  });
}

export function validateTokenAdmin(req, res, next) {
  const accessToken = req.headers['authorization'];
  if (!accessToken) res.send('Acceso Denegado');
  jwt.verify(accessToken, 'adminX', (err, user) => {
    if (err) {
      res.send('Acceso denegado, token expirado o incorrecto');
    } else {
      next();
    }
  });
}

export const getOrdenes = async (req, res) => {
  try {
    const [result] = await pool.query(
      '(Select idordenTrabajo, fecha,nombreCliente,vendedor,direccion,telefono1,email,nombreEmergencia,telefono2,correoEmergencia,chasis,motor,marca,modelo,placa,color,idusuario,plan,financiera,estado,anio,local,valor,facturaNombre,ruc,imei,chip,instalado,credenciales from ordenTrabajo ORDER BY idordenTrabajo DESC)'
    );
    //console.log(result);
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrden = async (req, res) => {
  try {
    const [result] = await pool.query(
      '(Select idordenTrabajo, fecha, nombreCliente,vendedor,direccion,telefono1,email,nombreEmergencia,telefono2,correoEmergencia,chasis,motor,marca,modelo,placa,color,idusuario,plan,financiera,estado,anio,local,valor,facturaNombre,ruc,imei,chip,instalado,credenciales from ordenTrabajo where idordenTrabajo=?)',
      [req.params.id]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: 'ORDEN DE TRABAJO NO ENCONTRADA' });
    }
    res.send(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postOrden = async (req, res) => {
  try {
    //console.log(req.body);
    const {
      fecha,
      nombreCliente,
      vendedor,
      direccion,
      telefono1,
      email,
      nombreEmergencia,
      telefono2,
      correoEmergencia,
      chasis,
      motor,
      marca,
      modelo,
      placa,
      color,
      idusuario,
      plan,
      financiera,
      anio,
      local,
      valor,
      facturaNombre,
      ruc,
      imei,
      chip,
    } = req.body;
    const result = await pool.query(
      'INSERT INTO ordenTrabajo(fecha,nombreCliente,vendedor,direccion,telefono1,email,nombreEmergencia,telefono2,correoEmergencia,chasis,motor,marca,modelo,placa,color,idusuario,plan,financiera,anio,local,valor,facturaNombre,ruc,imei,chip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        fecha,
        nombreCliente,
        vendedor,
        direccion,
        telefono1,
        email,
        nombreEmergencia,
        telefono2,
        correoEmergencia,
        chasis,
        motor,
        marca,
        modelo,
        placa,
        color,
        idusuario,
        plan,
        financiera,
        anio,
        local,
        valor,
        facturaNombre,
        ruc,
        imei,
        chip,
      ]
    );
    //console.log(result);
    res.send('insertando orden');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postEliminado = async (req, res) => {
  try {
    console.log(req.body);
    const { idOrden } = req.body;
    const result = await pool.query(
      'DELETE FROM ordenTrabajo WHERE idordenTrabajo = ?',
      [idOrden]
    );
    console.log(result);
    res.send('insertando observacion eliminado');
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const crearOrden = async (req, res) => {
  try {
    const { estado } = req.body;
    const [result] = await pool.query(
      'Update ordenTrabajo set estado=? where idordenTrabajo=?',
      [estado, req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'ESTADO NO ' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateInstalado = async (req, res) => {
  try {
    const { instalado } = req.body;
    const [result] = await pool.query(
      'Update ordenTrabajo set instalado=? where idordenTrabajo=?',
      [instalado, req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'ESTADO NO ' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCredenciales = async (req, res) => {
  try {
    const { credenciales } = req.body;
    const [result] = await pool.query(
      'Update ordenTrabajo set credenciales=? where idordenTrabajo=?',
      [credenciales, req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'ESTADO NO ' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrdenesUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      '(Select idordenTrabajo, fecha,nombreCliente,vendedor,direccion,telefono1,email,nombreEmergencia,telefono2,correoEmergencia,chasis,motor,marca,modelo,placa,color,idusuario,plan,financiera,estado,anio,local,valor,facturaNombre,ruc,imei,chip,instalado,credenciales from ordenTrabajo where idusuario=? ORDER BY idordenTrabajo DESC)',
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'ORDEN DE TRABAJO NO ELIMINADA' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOrdenId = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM ordenTrabajo WHERE idordenTrabajo = ?',
      [req.params.id]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: 'ORDEN DE TRABAJO NO ENCONTRADA' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const enviarSMS = async (req, res) => {
  const { numero, usuario, mensaje } = req.body;
  console.log(usuario);
  const CodFuncSrvMensajes = 'AS45+-*/12324.';
  const url =
    'http://new.tracker.com.ec:8083/email/wsSMS.asmx?op=EnviarMensaje';
  const xml = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <EnviarMensaje xmlns="http://tempuri.org/">
          <numero>${numero}</numero>
          <mensaje>${mensaje}</mensaje>
          <codigoFuncionamiento>${CodFuncSrvMensajes}</codigoFuncionamiento>
          <Usuario>${usuario}</Usuario>
        </EnviarMensaje>
      </soap:Body>
    </soap:Envelope>`;

  try {
    const response = await axios({
      method: 'post',
      url,
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: 'http://tempuri.org/EnviarMensaje',
      },
      data: xml,
    });
    const resp = response.data.match(
      /<EnviarMensajeResult>(.*?)<\/EnviarMensajeResult>/
    )[1];
    console.log(resp);
    res.send(resp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar orden
export const deleteOrden = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM ordenTrabajo WHERE idordenTrabajo = ?',
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'ORDEN NO ENCONTRADA' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarOrden = async (req, res) => {
  try {
    const {
      fecha,
      nombreCliente,
      vendedor,
      direccion,
      telefono1,
      email,
      nombreEmergencia,
      telefono2,
      correoEmergencia,
      chasis,
      motor,
      marca,
      modelo,
      placa,
      color,
      idusuario,
      plan,
      financiera,
      estado,
      anio,
      local,
      valor,
      facturaNombre,
      ruc,
      imei,
      chip,
      instalado,
      credenciales,
    } = req.body;
    const [result] = await pool.query(
      'Update ordenTrabajo set fecha=?,nombreCliente=?,vendedor=?,direccion=?,telefono1=?,email=?,nombreEmergencia=?,telefono2=?,correoEmergencia=?,chasis=?,motor=?,marca=?,modelo=?,placa=?,color=?,idusuario=?,plan=?,financiera=?,estado=?,anio=?,local=?,valor=?,facturaNombre=?,ruc=?,imei=?,chip=?,instalado=?,credenciales=? where idordenTrabajo=?',
      [
        fecha,
        nombreCliente,
        vendedor,
        direccion,
        telefono1,
        email,
        nombreEmergencia,
        telefono2,
        correoEmergencia,
        chasis,
        motor,
        marca,
        modelo,
        placa,
        color,
        idusuario,
        plan,
        financiera,
        estado,
        anio,
        local,
        valor,
        facturaNombre,
        ruc,
        imei,
        chip,
        instalado,
        credenciales,
        req.params.id,
      ]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'ORDEN ACTUALIZADA' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// FUNCIONES PARA BITACORAS

export const postBitacora = async (req, res) => {
  try {
    console.log(req.body);
    const { deviceId, fecha, mensaje } = req.body;
    const [result] = await pool.query(
      'INSERT INTO bitacoras(deviceId,fecha,mensaje) VALUES (?,?,?)',
      [deviceId, fecha, mensaje]
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBitacora = async (req, res) => {
  try {
    const [result] = await pool.query(
      'Select * from bitacoras where deviceId=? order by fecha desc',
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'BITACORAS NO ENCONTRADA' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postNovedad = async (req, res) => {
  try {
    console.log(req.body);
    const { novedad } = req.body;
    const [result] = await pool.query(
      'INSERT INTO novedad(novedad) VALUES (?)',
      [novedad]
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNovedades = async (req, res) => {
  try {
    const [result] = await pool.query('(Select * from novedad)');
    if (result.length === 0) {
      return res.status(404).json({ message: 'SIN NOVEDADES' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteNovedades = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM novedad WHERE idnovedad = ?',
      [req.params.id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'NOVEDAD NO ENCONTRADA' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDeviceImei = async (req, res) => {
  try {
    const [result] = await pool1.query(
      `SELECT id, name, uniqueId,status,disabled,lastUpdate,positionId,groupId,phone,model,contact,category,attributes,expirationTime,fechainiciocontrato,fechafincontrato,concesionario,financiera,aseguradora,plan,placa,color,motor,chasis,fecharecarga,datosGSM,bloqueo,valorrecarga  FROM traccar2023.tc_devices where uniqueId like '%${req.params.id}%' or chasis like '%${req.params.id}%' or name like '%${req.params.id}%' or placa like '%${req.params.id}%'`
    );
    const convertBuffersToBooleans = (device) => {
      device.disabled = Boolean(device.disabled[0]);
    };
    result.forEach(convertBuffersToBooleans);
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserNameEmail = async (req, res) => {
  try {
    const [result] = await pool1.query(
      `SELECT * FROM traccar2023.tc_users where name like '%${req.params.id}%' or email like '%${req.params.id}%'`
    );
    // Función para convertir los campos de buffers en valores booleanos
    const convertBuffersToBooleans = (user) => {
      user.readonly = Boolean(user.readonly[0]);
      user.administrator = Boolean(user.administrator[0]);
      user.twelvehourformat = Boolean(user.twelvehourformat[0]);
      user.disabled = Boolean(user.disabled[0]);
      user.devicereadonly = Boolean(user.devicereadonly[0]);
      user.limitcommands = Boolean(user.limitcommands[0]);
      user.disablereports = Boolean(user.disablereports[0]);
      user.fixedemail = Boolean(user.fixedemail[0]);
    };

    // Convierte los campos de buffers en valores booleanos
    result.forEach(convertBuffersToBooleans);

    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserID = async (req, res) => {
  try {
    const [result] = await pool1.query(
      `SELECT * FROM traccar2023.tc_user_device where deviceid = ${req.params.id}`
    );
    console.log(result);

    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postObservacions = async (req, res) => {
  try {
    console.log(req.body);
    const { iddispositivo, observacion, fecha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO observaciones(iddispositivo,observacion,fecha) VALUES (?,?,?)',
      [iddispositivo, observacion, fecha]
    );
    console.log(result);
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getObservacionId = async (req, res) => {
  try {
    const [result] = await pool.query(
      `Select * from observaciones where iddispositivo = ${req.params.id}`
    );
    if (result.length === 0) {
      return res.status(404).json({ message: 'SIN OBSERVACION' });
    }
    res.send(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const transporter = nodemailer.createTransport({
  host: 'mail.tracker.com.ec',
  port: 465,
  secure: true,
  auth: {
    user: 'sistemas@tracker.com.ec',
    pass: 'N4h5$80&DWX9',
  },
});

export const postEmail = async (req, res) => {
  const { name, email, phone, message } = req.body;
  const mailOptions = {
    from: email,
    to: 'atencionalcliente@tracker.com.ec',
    subject: 'SOLICITUD DE SERVICIO',
    text: `\n${name} \n ${phone} \n ${message}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('CORREO ENVIADO EXITOSAMENTE');
  });
};
