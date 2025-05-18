import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export function fazerDownloadResultado(
  textoHtml: string,
  titulo_do_documento: string
) {
  const container = document.createElement("div");
  container.innerHTML = `<h3>${titulo_do_documento}</h3><div>${textoHtml}</div>`;

  const elements: any[] = [];

  function processNode(node: any): any {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim()) {
        return new TextRun({ text: node.textContent, break: 1 });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const children = Array.from(node.childNodes)
        .map(processNode)
        .filter(Boolean);
      switch (node.tagName.toLowerCase()) {
        case "p":
          return new Paragraph({ children });
        case "strong":
        case "b":
          return new TextRun({ text: node.textContent, bold: true });
        case "em":
        case "i":
          return new TextRun({ text: node.textContent, italics: true });
        case "u":
          return new TextRun({ text: node.textContent, underline: {} });
        case "br":
          return new TextRun({ text: "", break: 1 });
        default:
          return new TextRun({ text: node.textContent });
      }
    }
    return null;
  }

  console.log(elements, "lemento1");

  // Pegar esse array?
  Array.from(container!.childNodes).forEach((node) => {
    const result = processNode(node);
    if (result) elements.push(result);
  });

  console.log(elements, "elemento2");
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Documento gerado automaticamente",
            heading: "Heading1",
          }),
          ...elements,
        ],
      },
    ],
  });

  const dataAgora = Date.now();

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${titulo_do_documento}-${dataAgora}.docx`);
  });
}
