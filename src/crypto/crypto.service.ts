// src/common/crypto/crypto.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly ivLength = 16;

  constructor(private configService: ConfigService) {
    const secret = this.configService.get('CARD_ENCRYPTION_KEY'); 
    this.key = Buffer.from(secret, 'base64');
  }

  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
      return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
      throw new InternalServerErrorException('Error');
    }
  }

  decrypt(encrypted: string): string {
    try {
      const [ivHex, dataHex] = encrypted.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const encryptedText = Buffer.from(dataHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
      return decrypted.toString('utf8');
    } catch (error) {
      throw new InternalServerErrorException('Error');
    }
  }
}
