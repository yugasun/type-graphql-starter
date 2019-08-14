import * as crypto from 'crypto';

export function getId(): string {
    const randomNumber = Math.random();
    const hash = crypto.createHash('sha256');
    hash.update(randomNumber.toString());

    return hash.digest('hex');
}

export function getToken(): string {
    const randomNumber = Math.random();
    const hash = crypto.createHash('sha256');
    hash.update(randomNumber.toString());

    return `token-${hash.digest('hex')}`;
}