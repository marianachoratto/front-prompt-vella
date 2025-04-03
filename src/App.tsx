/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import "./App.css";
import { useState } from "react";

function App() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Changed state name and type
  const [respostaApi, setRespostaApi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function enviarArquivo() {
    // const prompt3 = document.getElementById("prompt-3") as HTMLTextAreaElement;
    const prompt4 = document.getElementById("prompt-4") as HTMLTextAreaElement;

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
    // formData.append("prompt_auxiliar", prompt3?.value);
    formData.append("prompt_gerar_documento", prompt4?.value);
    formData.append("llm_ultimas_requests", llmUltimasRequests?.value);
    formData.append(
      "should_have_contextual_chunks",
      String(inputContext.checked)
    );

    setIsLoading(true);
    const url =
      ambiente.value == "local"
        ? "http://localhost:8000/gerar-documento/pdf"
        : ambiente.value == "tests"
        ? "https://luanpoppe-vella-backend-tests.hf.space/gerar-documento/pdf"
        : ambiente.value == "producao"
        ? "https://luanpoppe-vella-backend.hf.space/gerar-documento/pdf"
        : "";
    axios
      .post(url, formData)
      .then((res) => {
        setRespostaApi(res.data.resposta);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {/* <h1>Prompt 3</h1>
      <p>Faz um resumo completo do documento todo. É utilizado no 4º prompt</p>
      <textarea
        style={{ height: "200px" }}
        name=""
        id="prompt-3"
        className="form-control"
      ></textarea> */}
      <h1>Prompt 4</h1>
      <p>
        {" "}
        Prompt que realmente gera o documento. Recebe o prompt específico do
        modelo do usuário enviado pelo front.
      </p>
      <div>
        <textarea
          style={{ height: "200px" }}
          name=""
          id="prompt-4"
          className="form-control"
        ></textarea>
      </div>
      <input
        type="checkbox"
        defaultChecked
        id="contextual-chunks"
        className="me-2"
      />
      <label htmlFor="contextual-chunks">Contextual-chunk</label>

      <label className="mt-4 mb-2 d-block" htmlFor="llm-ultimas-requests">
        LLM últimas requests
      </label>
      <select className="form-select" id="llm-ultimas-requests">
        <option selected value="gemini-2.0-flash">
          Google Gemini 2.0 Flash
        </option>
        <option value="gpt-4o-mini">GPT 4o mini</option>
        <option value="deepseek-chat">Deepseek Chat</option>
      </select>

      <label className="mt-4 mb-2 d-block" htmlFor="ambiente">
        Ambiente:
      </label>
      <select className="form-select" id="ambiente">
        <option value="local">Local (Luan)</option>
        <option selected value="tests">
          Ambiente de Testes
        </option>
        <option value="producao">Produção</option>
      </select>

      <input
        type="file"
        className="form-control mt-3"
        id="enviarArquivo"
        multiple
        onChange={(event) => {
          setSelectedFiles(event?.target?.files);
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
      {respostaApi && (
        <section>
          <h3>{respostaApi.titulo_do_documento}</h3>
          <div className="mt-3 fs-5">{respostaApi.texto_completo}</div>
        </section>
      )}
    </>
  );
}

export default App;
