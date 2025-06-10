from typing import TypedDict
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph
from langgraph.prebuilt import create_react_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from dotenv import load_dotenv
import os

# 📦 Carregamento de variáveis de ambiente
load_dotenv()
from tools.load_files_tool import load_files
from tools.generator_tool import generator_response

# ====== Estado do fluxo ======
class EntradaInicial(TypedDict):
    input: str
    load_files: str
    generator: str

# ====== Tipos de resposta estruturada ======
class LoadResponse(TypedDict):
    tipo: str
    resumo: str

class GeneratorResponse(TypedDict):
    tipo: str
    justificativa: str



# ====== Inicialização do modelo e memória ======
memory = MemorySaver()
modelo = ChatOllama(model="devstral")

# ====== Prompt base ======
def criar_prompt(papel: str) -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages([
        ("system", f"Você é {papel}"),
        MessagesPlaceholder("messages")
    ])

# ====== Agentes com resposta estruturada ======
agentes = {
    "load_files": create_react_agent(
        model=modelo,
        tools=[],
        prompt=criar_prompt("um especialista em programação busque os arquviso a serem analisados com load_files"),
        response_format=LoadResponse,
        checkpointer=memory
    ),
    "generator": create_react_agent(
        model=modelo,
        tools=[],
        prompt=criar_prompt("um analista senior"),
        response_format=GeneratorResponse,
        checkpointer=memory
    ),
}

# ====== Funções dos nós ======
def agente_load_files(state: EntradaInicial):
    # Primeiro executa a ferramenta manualmente
    raw_tool_result = load_files.invoke({"input": state["input"]})

    # Formata como mensagem de entrada para o agente
    tool_message = HumanMessage(
        content=f"Arquivos carregados: {raw_tool_result}"
    )

    # Agora sim, o agente age com base no resultado da ferramenta
    resp = agentes["load_files"].invoke({"messages": [tool_message]})
    resultado = resp["structured_response"]

    return {
        "load_files": f"{resultado['tipo']}: {resultado['resumo']}"
    }


def agente_generator(state: EntradaInicial):
    # Acesso ao output do agente anterior
    arquivos = state["load_files"]
    entrada = state["input"]

    # Combina no prompt
    prompt = (
        f"📂 Resultado da leitura de arquivos:\n{arquivos}\n\n"
        f"📥 Tarefa solicitada:\n{entrada}"
    )
    msg = HumanMessage(content=prompt)

    # Executa o agente
    resp = agentes["generator"].invoke({"messages": [msg]})
    resultado = resp["structured_response"]

    return {"generator": f"{resultado['tipo']}: {resultado['justificativa']}"}


def gerar_conclusao(state: EntradaInicial):
    print(f"""{state}""")
    return state  # Retorna o estado final

# ====== Montagem do grafo LangGraph ======
graph = StateGraph(state_schema=EntradaInicial)

graph.add_node("n_load_files", agente_load_files)
graph.add_node("n_generator", agente_generator)
graph.add_node("n_conclusao", gerar_conclusao)

graph.add_edge("n_load_files", "n_generator")
graph.add_edge("n_generator", "n_conclusao")

graph.set_entry_point("n_load_files")
graph.set_finish_point("n_conclusao")  # ✅ nó final

# ====== Compilação ======
app = graph.compile()

# ====== Execução ======
entrada = {
    "input": "Preciso melhorar a escalabilidade desse codigo, quero conseguir visualizar o nos conectados aos blocos e subblocos"
}
res = app.invoke(entrada)
