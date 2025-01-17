/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import "./App.css";
import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  function enviarArquivo() {
    const prompt3 = document.getElementById("prompt-3") as HTMLTextAreaElement;
    const prompt4 = document.getElementById("prompt-4") as HTMLTextAreaElement;
    const enviarArquivo = document.getElementById(
      "enviarArquivo"
    ) as HTMLInputElement;
    console.log(prompt3?.value, prompt4?.value, enviarArquivo.value);

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("prompt_auxiliar", prompt3?.value);
    formData.append("prompt_gerar_documento", prompt4?.value);
    axios.post(
      "https://luanpoppe-vella-backend.hf.space/gerar-documento/pdf",
      formData
    );
  }

  return (
    <>
      <h1>Prompt 3</h1>
      <p>Faz um resumo completo do documento todo. É utilizado no 4º prompt</p>
      <textarea name="" id="prompt-3" className="form-control"></textarea>
      <h1>Prompt 4</h1>
      <p>
        {" "}
        Prompt que realmente gera o documento. Recebe o prompt específico do
        modelo do usuário enviado pelo front
      </p>
      <textarea name="" id="prompt-4" className="form-control"></textarea>
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
        Enviar prompts
      </button>
    </>
  );
}

export default App;
