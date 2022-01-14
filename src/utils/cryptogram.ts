import * as crypto from 'crypto'

export function makeSalt(): string {
    return crypto.randomBytes(3).toString('base64');
}

/**
 * Encrypt password
 * @param password 加密前密码
 * @param salt 密码盐
 */
export function encryptPassword(password: string, salt: string): string {
    if (!password || !salt) {
        return '';
    }
    const tempSalt = Buffer.from(salt, 'base64');
    return (
        crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha256').toString('base64')
    );
}