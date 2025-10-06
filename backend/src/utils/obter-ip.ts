import { Request } from 'express';

export function ObterClienteIP(req: Request): string {
    const INFO_IP = req.headers['x-INFO_IP-for'];
    let ip = '';

    if (typeof INFO_IP === 'string') {
        ip = INFO_IP.split(',')[0] || '';
    } else {
        ip = req.socket.remoteAddress || '';
    }

    // Remove prefixo IPv6 se existir
    ip = ip.replace('::ffff:', '');

    // Converte IPv6 localhost (::1) para IPv4 (127.0.0.1)
    if (ip === '::1') {
        ip = '127.0.0.1';
    }

    return ip;
}