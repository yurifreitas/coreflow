from langchain_core.tools import tool

@tool
def generator_response(dados: str) -> dict:
    """
    Recebe código + pergunta e responde com sugestões ou correções.
    """
    # Aqui o modelo receberá tudo como um prompt
    return {
        "tipo": "análise",
        "justificativa": f"Analisando o seguinte contexto de código e pergunta:\n\n{dados}"
    }
