import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  DefluenciaDto,
  FluviometriaDto,
  PluviometriaDto,
} from '../dto/create.ana.dto';

export type AnaDocument = HydratedDocument<Ana>;

interface Defluencia {
  valor: number;
  unidade: string;
  nivel_montante: NivelMontante;
  nivel_jusante: NivelJusante;
  vazao_turbinada: VazaoTurbinada;
  vazao_sanitaria: VazaoSanitaria;
  vazao_vertida: VazaoVertida;
}

interface Fluviometria {
  valor: number;
  unidade: string;
  dados_extra: FluviometriaDadosExtra;
}

interface VazaoVertidaDadosExtra {
  leitura: number;
}

interface VazaoSanitariaDadosExtra {
  leitura: number;
}

// interface Potencia {
//   valor: number;
//   unidade: string;
// }

// interface AberturaDistribuidor {
//   valor: number;
//   unidade: string;
// }

// interface RotacaoRotor {
//   valor: number;
//   unidade: string;
// }

interface VazaoSanitaria {
  valor: number;
  unidade: string;
  dados_extra: VazaoSanitariaDadosExtra;
}

// interface UnidadeGeradora {
//   unidade: string;
//   potencia: Potencia;
//   rotacao_rotor: RotacaoRotor;
//   abertura_distribuidor: AberturaDistribuidor;
// }

interface VazaoTurbinadaDadosExtra {
  leitura: number;
}

class VazaoTurbinada {
  valor: number;
  unidade: string;
  dados_extra: VazaoTurbinadaDadosExtra;
}

interface VazaoVertida {
  valor: number;
  unidade: string;
  dados_extra: VazaoVertidaDadosExtra;
}

interface FluviometriaDadosExtra {
  leitura: number;
}

interface PluviometriaDadosExtra {
  leitura_anterior: number;
  leitura_atual: number;
}

class NivelJusante {
  valor: number;
  unidade: string;
}

interface Pluviometria {
  valor: number;
  unidade: string;
  dados_extra: PluviometriaDadosExtra;
}

interface NivelMontante {
  valor: number;
  unidade: string;
}

@Schema({ timestamps: true })
export class Ana {
  @Prop({ default: false })
  integrado: boolean;

  @Prop()
  timestamp: number;

  @Prop()
  planta: string;

  @Prop()
  ponto: string;

  @Prop()
  codigoFlu: number;

  @Prop()
  codigoPlu: number;

  @Prop({ type: PluviometriaDto })
  pluviometria: Pluviometria;

  @Prop({ type: FluviometriaDto })
  fluviometria: Fluviometria;

  @Prop({ type: DefluenciaDto })
  defluencia: Defluencia;
}

export const AnaSchema = SchemaFactory.createForClass(Ana);
