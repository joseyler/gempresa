const IndiceValor = {
  valor: { type: Number, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  fechaDate: { type: Date, required: true },
};

export interface IndiceValorInterface {
  valor: number;
  fecha: string;
  hora: string;
  fechaDate: string;
}

export default IndiceValor;
