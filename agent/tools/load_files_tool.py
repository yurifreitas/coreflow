from langchain_core.tools import tool
from pathlib import Path

@tool
def load_files() -> dict:
    """
    Carrega todos os arquivos relevantes no diretório de front-end e retorna o conteúdo combinado.
    """
    path = Path("/home/yuri/Documents/code2/front-end/src")
    if not path.exists() or not path.is_dir():
        return {"tipo": "erro", "resumo": f"Diretório não encontrado: {path}"}

    arquivos = [f for f in path.glob("**/*") if f.is_file() and f.suffix in [".ts", ".tsx", ".js", ".jsx", ".json"]]
    conteudo_total = ""
   
    for arq in arquivos:
        try:
            texto = arq.read_text(encoding="utf-8")
            conteudo_total += f"\n### Arquivo: {arq.name}\n{texto}\n"
        except Exception as e:
            conteudo_total += f"\n### Arquivo: {arq.name}\n[Erro ao ler arquivo: {e}]\n"

    return {
        "tipo": "codigo",
        "resumo": conteudo_total.strip()
    }
