import tesseract from "node-tesseract-ocr";

const config = {
  lang: "por",
  oem: 1,
  psm: 3,
};

export class PegarDadosFatura {
  // Você pode passar o path (caminho do arquivo) ou o Buffer
  async processarFatura(filePath: string) {
    try {
      // Aqui usamos o 'config' definido acima e o 'filePath' recebido
      const textoExtraido = await tesseract.recognize(filePath, config);

      // 1. Regex para Valor Total
      // Procuro por "TOTAL A PAGAR", pulo qualquer coisa (incluindo quebras de linha) até achar "R$" e o valor
      const valorTotalMatch = textoExtraido.match(
        /TOTAL\s*A\s*PAGAR[\s\S]*?R\$\s*([\d,.]+)/i,
      );

      // 2. Regex para Consumo kWh
      // Na Energisa, o consumo real faturado costuma vir após "Consumo em kWh"
      // 1. Fazemos o match
      const consumoMatch = textoExtraido.match(/Consumo\s*em\s*kWh\s*(\d+)/i);

      let consumoKwh = null;

      // 2. Verificamos se o consumoMatch existe E se o grupo [1] foi capturado
      if (consumoMatch && consumoMatch[1]) {
        const valorLido = consumoMatch[1]; // Aqui o TS já sabe que é string

        // 3. Aplicamos a lógica para remover os zeros extras
        consumoKwh =
          valorLido.length > 3 && valorLido.endsWith("00")
            ? valorLido.slice(0, -2)
            : valorLido;
      }
      // 3. Regex para Código da Instalação (Unidade Consumidora)
      const codigoClienteMatch = textoExtraido.match(
        /CÓDIGO\s*DO\s*CLIENTE[\s\S]*?(\d{2}\/\d+\-\d)/i,
      );

      // 4. Regex para Mês de Referência
      const mesReferenciaMatch = textoExtraido.match(
        /REF:\s*MÊS\s*\/\s*ANO\s*\n\n(.*?)\s*\//i,
      );

      return {
        textoCompleto: textoExtraido,
        valorTotal: valorTotalMatch ? valorTotalMatch[1] : null,
        consumoKwh: consumoKwh, // Usamos a variável tratada aqui
        codigoCliente: codigoClienteMatch ? codigoClienteMatch[1] : null,
      };
    } catch (error) {
      console.error("Erro no OCR:", error);
      throw new Error("Falha ao processar os dados da fatura.");
    }
  }
}
