export class CreateIntegratedDto {
  readonly datetime: number;
  readonly datetime_send: number;
  readonly datetime_received?: number;
  readonly planta: string;
  readonly ponto: string;
  readonly codigoFlu: number;
  readonly codigoPlu: number;
  readonly pluviometria: number;
  readonly fluviometria: number;
  readonly defluencia: number;
  readonly xml_send?: string;
  readonly xml_received?: string;
  readonly reason_not_sent?: string;
  readonly group_id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
