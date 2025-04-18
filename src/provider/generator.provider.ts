import bcrypt from 'bcrypt';
import { v1 as uuid } from 'uuid';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class GeneratorProvider {
  static uuid(): string {
    return uuid();
  }

  static fileName(ext: string): string {
    return `${GeneratorProvider.uuid()}.${ext}`;
  }

  static getS3PublicUrl(key: string): string {
    if (!key) {
      throw new TypeError('key is required');
    }

    return `https://s3.${process.env.AWS_S3_BUCKET_NAME_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${key}`;
  }

  static getS3Key(publicUrl: string): string {
    if (!publicUrl) {
      throw new TypeError('key is required');
    }

    const exec = new RegExp(
      `(?<=https://s3.${process.env.AWS_S3_BUCKET_NAME_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/).*`,
    ).exec(publicUrl);

    if (!exec) {
      throw new TypeError('publicUrl is invalid');
    }

    return exec[0];
  }

  static generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static generatePassword(): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = lowercase.toUpperCase();
    const numbers = '0123456789';

    let text = '';

    for (let i = 0; i < 4; i++) {
      text += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      text += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
      text += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return text;
  }

  /**
   * generate hash from password or string
   * @param {string} password
   * @returns {string}
   */
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * validate text with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static validateHash(
    password: string | undefined,
    hash: string | undefined | null,
  ): Promise<boolean> {
    if (!password || !hash) {
      return Promise.resolve(false);
    }

    return bcrypt.compare(password, hash);
  }

  static getVariableName<TResult>(getVar: () => TResult): string | undefined {
    const m = /\(\)=>(.*)/.exec(
      getVar.toString().replaceAll(/(\r\n|\n|\r|\s)/gm, ''),
    );

    if (!m) {
      throw new Error(
        "The function does not contain a statement matching 'return variableName;'",
      );
    }

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const fullMemberName = m[1]!;

    const memberParts = fullMemberName.split('.');

    return memberParts.at(-1);
  }

  /**
   * generate random string
   * @param length
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replaceAll(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length));
  }
}
