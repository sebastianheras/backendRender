import { Router } from 'express';
import {
  getUsers,
  getOrdenesUser,
  getOrdenes,
  postOrden,
  getOrden,
  postLogin,
  validateToken,
  crearOrden,
  enviarSMS,
  deleteOrdenId,
  actualizarOrden,
  postBitacora,
  postNovedad,
  getNovedades,
  getBitacora,
  deleteNovedades,
  getDeviceImei,
  validateTokenAdmin,
  getUserNameEmail,
  getUserID,
  postObservacions,
  getObservacionId,
  postEliminado,
  updateInstalado,
  updateCredenciales,
  postEmail,
  getName,
} from '../controller/taskcontroller.js';
import emailRateLimit from '../controller/rateLimit.js';

const router = Router();

router.get('/bitacora/:id', getBitacora);

// router.post('/events', postEvents)

router.get('/nombre', getName);

router.post('/auth', postLogin);

router.post('/send/email', emailRateLimit, postEmail);

router.get('/users', validateToken, getUsers);

router.get('/ordenes', validateToken, getOrdenes);

router.get('/ordenes/:id', validateToken, getOrdenesUser);

router.get('/orden/:id', validateToken, getOrden);

router.post('/orden', postOrden);

router.patch('/orden/:id', validateToken, crearOrden);

router.patch('/instalado/:id', validateToken, updateInstalado);

router.patch('/credenciales/:id', validateToken, updateCredenciales);

router.post('/soapReq', enviarSMS);

router.delete('/orden/:id', validateToken, deleteOrdenId);

router.put('/orden/:id', actualizarOrden);

//router.delete('/orden/:id', deleteOrden);

router.post('/bitacora', postBitacora);

router.post('/novedad', postNovedad);

router.get('/novedad', getNovedades);

router.delete('/novedad/:id', deleteNovedades);

router.get('/deviceImei/:id', validateTokenAdmin, getDeviceImei);

router.get('/userEmail/:id', validateTokenAdmin, getUserNameEmail);

router.get('/userID/:id', validateTokenAdmin, getUserID);

router.post('/observacion', validateTokenAdmin, postObservacions);

router.get('/observacion/:id', validateTokenAdmin, getObservacionId);

router.delete('/eliminarOrden', validateToken, postEliminado);

export default router;
