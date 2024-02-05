export class UpdateStationDto {
  readonly usina: string;
  readonly nome: string;
  readonly login: string;
  readonly senha: string;
  readonly situacao: 'homologacao' | 'producao' | 'sem_envio';
  readonly codigoFlu: number;
  readonly codigoPlu?: number | null;
}
