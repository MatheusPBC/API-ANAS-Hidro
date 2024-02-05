export class CreateAnaDto {
  readonly integrado: boolean;
  readonly timestamp: number;
  readonly planta: string;
  readonly ponto: string;
  readonly codigoFlu: number;
  readonly codigoPlu: number;
  readonly pluviometria: PluviometriaDto;
  readonly fluviometria: FluviometriaDto;
  readonly defluencia: DefluenciaDto;
}

export class PluviometriaDto {
  readonly valor: number;
  readonly unidade: string;
  readonly dados_extra: PluviometriaDadosExtraDto;
}

export class PluviometriaDadosExtraDto {
  readonly leitura_anterior: number;
  readonly leitura_atual: number;
}

export class FluviometriaDto {
  readonly valor: number;
  readonly unidade: string;
  readonly dados_extra: FluviometriaDadosExtraDto;
}

export class FluviometriaDadosExtraDto {
  readonly leitura: number;
}

export class DefluenciaDto {
  readonly valor: number;
  readonly unidade: string;
  readonly nivel_montante: NivelMontanteDto;
  readonly nivel_jusante: NivelJusanteDto;
  readonly vazao_turbinada: VazaoTurbinadaDto;
  readonly vazao_sanitaria: VazaoSanitariaDto;
  readonly vazao_vertida: VazaoVertidaDto;
}

export class NivelMontanteDto {
  readonly valor: number;
  readonly unidade: string;
}

export class NivelJusanteDto {
  readonly valor: number;
  readonly unidade: string;
}

export class VazaoTurbinadaDto {
  readonly valor: number;
  readonly unidade: string;
  readonly unidades_geradoras: ReadonlyArray<UnidadeGeradoraDto>;
}

export class UnidadeGeradoraDto {
  readonly unidade: string;
  readonly potencia: PotenciaDto;
  readonly rotacao_rotor: RotacaoRotorDto;
  readonly abertura_distribuidor: AberturaDistribuidorDto;
}

export class PotenciaDto {
  readonly valor: number;
  readonly unidade: string;
}

export class RotacaoRotorDto {
  readonly valor: number;
  readonly unidade: string;
}

export class AberturaDistribuidorDto {
  readonly valor: number;
  readonly unidade: string;
}

export class VazaoSanitariaDto {
  readonly valor: number;
  readonly unidade: string;
}

export class VazaoVertidaDto {
  readonly valor: number;
  readonly unidade: string;
}
