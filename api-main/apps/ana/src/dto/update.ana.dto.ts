import { PluviometriaDto } from './create.ana.dto';
import { FluviometriaDto } from './create.ana.dto';
import { DefluenciaDto } from './create.ana.dto';

export class UpdateAnaDto {
  readonly integrado?: boolean;
  readonly timestamp?: number;
  readonly planta?: string;
  readonly ponto?: string;
  readonly codigoFlu?: number;
  readonly codigoPlu?: number;
  readonly pluviometria?: PluviometriaDto;
  readonly fluviometria?: FluviometriaDto;
  readonly defluencia?: DefluenciaDto;
}
