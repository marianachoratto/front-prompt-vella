/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import "./App.css";
import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [respostaApi, setRespostaApi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function enviarArquivo() {
    const prompt3 = document.getElementById("prompt-3") as HTMLTextAreaElement;
    const prompt4 = document.getElementById("prompt-4") as HTMLTextAreaElement;

    const inputContext = document.getElementById(
      "contextual-chunks"
    ) as HTMLInputElement;

    const isLocalServer = document.getElementById(
      "is-local-server"
    ) as HTMLInputElement;

    const llmUltimasRequests = document.getElementById(
      "llm-ultimas-requests"
    ) as HTMLSelectElement;

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("prompt_auxiliar", prompt3?.value);
    formData.append("prompt_gerar_documento", prompt4?.value);
    formData.append("llm_ultimas_requests", llmUltimasRequests?.value);
    formData.append(
      "should_have_contextual_chunks",
      String(inputContext.checked)
    );

    setIsLoading(true);
    const url = isLocalServer
      ? "http://localhost:8000/gerar-documento/pdf"
      : "https://luanpoppe-vella-backend.hf.space/gerar-documento/pdf";
    axios
      .post(url, formData)
      .then((res) => {
        setRespostaApi(res.data.resposta.texto_completo);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <h1>Prompt 3</h1>
      <p>Faz um resumo completo do documento todo. É utilizado no 4º prompt</p>
      <textarea
        style={{ height: "200px" }}
        name=""
        id="prompt-3"
        className="form-control"
      ></textarea>
      <h1>Prompt 4</h1>
      <p>
        {" "}
        Prompt que realmente gera o documento. Recebe o prompt específico do
        modelo do usuário enviado pelo front
      </p>
      <textarea
        style={{ height: "200px" }}
        name=""
        id="prompt-4"
        className="form-control"
      ></textarea>
      <input
        type="checkbox"
        defaultChecked
        id="contextual-chunks"
        className="me-2"
      />
      <label htmlFor="contextual-chunks">Contextual-chunk</label>

      <div className="mt-2">
        <input
          type="checkbox"
          defaultChecked={false}
          id="is-local-server"
          className="me-2"
        />
        <label htmlFor="is-local-server">Rodar local? (Luan)</label>
      </div>

      <label className="mt-4 mb-2 d-block" htmlFor="llm-ultimas-requests">
        LLM últimas requests
      </label>
      <select className="form-select" id="llm-ultimas-requests">
        <option selected value="gpt-4o-mini">
          GPT 4o mini
        </option>
        <option value="deepseek-chat">Deepseek Chat</option>
      </select>

      <input
        type="file"
        className="form-control mt-3"
        id="enviarArquivo"
        onChange={(event) => {
          setSelectedFile(event?.target?.files?.[0]);
        }}
      />

      <br />
      <button className="btn btn-success" onClick={enviarArquivo}>
        {isLoading ? (
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          "Enviar prompts"
        )}
      </button>
      {respostaApi && <div className="mt-3 fs-5">{respostaApi}</div>}
    </>
  );
}

export default App;
