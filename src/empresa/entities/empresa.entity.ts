import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id: number;

  @Column({
    name: 'codEmpresa',
    length: 100,
  })
  public codempresa: string;

  @Column({
    name: 'empresaNombre',
    length: 100,
  })
  public empresaNombre: string;

  constructor(codempresa: string, empresaNombre: string) {
    this.codempresa = codempresa;
    this.empresaNombre = empresaNombre;
  }

  public getId(): number {
    return this.id;
  }

  public getCodempresa(): string {
    return this.codempresa;
  }

  public setCodempresa(codempresa: string) {
    this.codempresa = codempresa;
  }

  public getEmpresaNombre(): string {
    return this.empresaNombre;
  }

  public setEmpresaNombre(empresaNombre: string) {
    this.empresaNombre = empresaNombre;
  }


}
