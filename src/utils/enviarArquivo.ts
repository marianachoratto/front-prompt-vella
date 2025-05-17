/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export let respostaApiDownload: any;
export function enviarArquivo(
  mode: ModoAtivo,
  selectedFiles: any,
  setIsLoading: any,
  setRespostaApi: any
) {
  const promptGerarDocumento = document.getElementById(
    "prompt-gerar-documento"
  ) as HTMLTextAreaElement;
  const promptGerarDocumentoEtapa2 = document.getElementById(
    "prompt-etapa-2"
  ) as HTMLTextAreaElement;
  const promptGerarDocumentoEtapa3 = document.getElementById(
    "prompt-etapa-3"
  ) as HTMLTextAreaElement;

  const inputContext = document.getElementById(
    "contextual-chunks"
  ) as HTMLInputElement;

  const ambiente = document.getElementById("ambiente") as HTMLSelectElement;

  const llmUltimasRequests = document.getElementById(
    "llm-ultimas-requests"
  ) as HTMLSelectElement;

  const formData = new FormData();
  // Loop through selected files and append them
  if (selectedFiles) {
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
      console.log(`PDF ${i} enviado`);
    }
  }

  formData.append("prompt_gerar_documento", promptGerarDocumento?.value);
  formData.append("llm_ultimas_requests", llmUltimasRequests?.value);

  if (mode == "documento") {
    formData.append(
      "should_have_contextual_chunks",
      String(inputContext.checked)
    );
  }

  if (promptGerarDocumentoEtapa2.value)
    formData.append(
      "prompt_gerar_documento_etapa_2",
      promptGerarDocumentoEtapa2.value
    );
  if (promptGerarDocumentoEtapa3.value)
    formData.append(
      "prompt_gerar_documento_etapa_3",
      promptGerarDocumentoEtapa3.value
    );

  setIsLoading(true);
  const modoAtivo = mode == "documento" ? "gerar-documento" : "gerar-ementa";
  const url =
    ambiente.value == "local"
      ? `http://localhost:8000/${modoAtivo}/pdf`
      : ambiente.value == "tests"
      ? `https://luanpoppe-vella-backend-tests.hf.space/${modoAtivo}/pdf`
      : ambiente.value == "producao"
      ? `https://luanpoppe-vella-backend.hf.space/${modoAtivo}/pdf`
      : "";
  axios
    .post(url, formData)
    .then((res) => {
      if (mode == "documento") {
        setRespostaApi(res.data.resposta);
      } else if (mode == "ementa") {
        setRespostaApi(res.data);
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
}
