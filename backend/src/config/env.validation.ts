import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from 'class-validator';
import path from 'node:path';

class EnvironmentVariables {
  @IsOptional()
  @IsIn(['development', 'test', 'production'])
  NODE_ENV?: 'development' | 'test' | 'production';

  @IsInt()
  @Min(1)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @IsInt()
  @Min(1)
  DB_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  UPLOAD_PATH!: string;

  @IsString()
  @IsNotEmpty()
  ALLOWED_ORIGINS!: string;

  @IsInt()
  @Min(1)
  THROTTLE_TTL!: number;

  @IsInt()
  @Min(1)
  THROTTLE_LIMIT!: number;
}

export type ValidatedEnv = EnvironmentVariables;

export function validateEnv(config: Record<string, unknown>): ValidatedEnv {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }

  const uploadPath = path.resolve(validated.UPLOAD_PATH);
  const projectRoot = path.resolve(process.cwd());

  if (!path.isAbsolute(uploadPath)) {
    throw new Error('UPLOAD_PATH must be an absolute path.');
  }

  if (uploadPath === projectRoot || uploadPath.startsWith(`${projectRoot}${path.sep}`)) {
    throw new Error('UPLOAD_PATH must be outside the project root.');
  }

  return {
    ...validated,
    UPLOAD_PATH: uploadPath,
  };
}
