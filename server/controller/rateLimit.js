import {rateLimit} from 'express-rate-limit';

const emailRateLimit = rateLimit({
    windowMs: 60*60*1000,
    max:3,
    message: 'NUMERO DE SOLICITUDES SUPERADO',
    headers:true,
})

export default emailRateLimit;