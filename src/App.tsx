/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import { useState } from "react";
import { enviarArquivo } from "./utils/enviarArquivo";
import { fazerDownloadResultado } from "./utils/download";

function App() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Changed state name and type
  const [respostaApi, setRespostaApi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<ModoAtivo>("documento");

  return (
    <>
      <h1>Gerar {mode == "documento" ? "Documento Padrão" : "Ementa"}</h1>
      <div className="d-flex justify-content-center align-items-center gap-2">
        <h5>
          Se quiser usar o gerador de{" "}
          {mode == "documento" ? "ementa" : "documento"}:{" "}
        </h5>
        <button
          className="p-2"
          onClick={() => setMode(mode == "documento" ? "ementa" : "documento")}
        >
          clique aqui
        </button>
      </div>
      <hr />
      <p>
        Prompt que realmente gera o documento. Recebe o prompt específico do
        modelo do usuário enviado pelo front.
      </p>
      <div>
        <textarea
          style={{ height: "200px" }}
          name=""
          id="prompt-gerar-documento"
          className="form-control mb-2"
        />
        <div>
          <label htmlFor="prompt-etapa-2">Prompt Etapa 2 (Opcional)</label>
          <textarea
            style={{ height: "100px" }}
            name=""
            id="prompt-etapa-2"
            className="form-control mb-2"
          />
          <label htmlFor="prompt-etapa-3">Prompt Etapa 3 (Opcional)</label>
          <textarea
            style={{ height: "100px" }}
            name=""
            id="prompt-etapa-3"
            className="form-control mb-2"
          />

          {mode == "documento" && (
            <div>
              <input
                type="checkbox"
                defaultChecked
                id="contextual-chunks"
                className="me-2"
              />
              <label htmlFor="contextual-chunks">Contextual-chunk</label>
            </div>
          )}
        </div>
      </div>

      <label className="mt-4 mb-2 d-block" htmlFor="llm-ultimas-requests">
        LLM últimas requests
      </label>
      <select className="form-select" id="llm-ultimas-requests">
        <option selected={mode == "documento"} value="gemini-2.0-flash">
          Google Gemini 2.0 Flash
        </option>
        <option value="gpt-4o-mini">GPT 4o mini</option>
        <option value="deepseek-chat">Deepseek Chat</option>
        <option selected={mode == "ementa"} value="gemini-2.5-pro">
          Google Gemini 2.5 pro
        </option>
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
      <button
        className="btn btn-success"
        onClick={() =>
          enviarArquivo(mode, selectedFiles, setIsLoading, setRespostaApi)
        }
      >
        {isLoading ? (
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          `Enviar prompts gerar ${mode == "documento" ? "DOCUMENTO" : "EMENTA"}`
        )}
      </button>
      {respostaApi && (
        <>
          <section id="resposta-completa">
            <h3>{respostaApi.titulo_do_documento}</h3>
            <div
              className="mt-3 fs-5"
              id="resultado-final"
              dangerouslySetInnerHTML={{ __html: respostaApi.texto_completo }}
            ></div>
          </section>
          <button
            type="submit"
            id="botaoDowload"
            onClick={() =>
              fazerDownloadResultado(
                respostaApi.texto_completo,
                respostaApi.titulo_do_documento
              )
            }
          >
            Download
          </button>
        </>
      )}
    </>
  );
}

export default App;
