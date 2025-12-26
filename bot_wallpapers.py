import json
import requests
import os
import random
import time
from datetime import datetime

# --- CONFIGURAÇÕES ---
PASTA_IMAGENS = "/mnt/chromeos/GoogleDrive/MyDrive/wallpapers_site"
ARQUIVO_JSON = "wallpapers.json"
TEMPO_ESPERA = 60 # Tempo em segundos (60 = 1 minuto). Mude para 3600 para ser 1 hora.

# Temas que a IA pode escolher
TEMAS = ["cyberpunk", "nature", "technology", "space", "abstract", "city", "neon", "gaming"]

def baixar_imagem_ia():
    tema = random.choice(TEMAS)
    print(f"\n🤖 IA: Buscando imagem sobre... {tema.upper()}!")

    timestamp = int(time.time())
    nome_arquivo = f"wallpaper_{tema}_{timestamp}.jpg"
    caminho_completo = os.path.join(PASTA_IMAGENS, nome_arquivo)

    # USANDO PICSUM (Mais estável que Unsplash)
    url_download = f"https://picsum.photos/seed/{timestamp}/3840/2160"

    try:
        resposta = requests.get(url_download, allow_redirects=True)
        if resposta.status_code == 200:
            with open(caminho_completo, 'wb') as f:
                f.write(resposta.content)
            print(f"✅ Download concluído: {nome_arquivo}")
            return nome_arquivo, tema
        else:
            print("❌ Erro ao baixar imagem.")
            return None, None
    except Exception as e:
        print(f"❌ Erro crítico: {e}")
        return None, None

def atualizar_banco_dados(nome_imagem, tema):
    try:
        with open(ARQUIVO_JSON, 'r', encoding='utf-8') as f:
            dados = json.load(f)
    except FileNotFoundError:
        dados = []

    novo_wallpaper = {
        "titulo": f"{tema.capitalize()} #{random.randint(100, 999)}",
        "miniatura": nome_imagem,
        "downloads": {
            "Ultra 4K": nome_imagem
        }
    }

    dados.insert(0, novo_wallpaper) # Adiciona no topo

    with open(ARQUIVO_JSON, 'w', encoding='utf-8') as f:
        json.dump(dados, f, indent=4, ensure_ascii=False)
    
    print("📝 JSON atualizado!")

# --- VERSÃO GITHUB ACTIONS (SEM LOOP INFINITO) ---
if __name__ == "__main__":
    print("--- 🚀 ROBÔ INICIADO (MODO TAREFA ÚNICA) ---")
    
    # Ele tenta baixar 1 imagem
    imagem, tema_escolhido = baixar_imagem_ia()
    
    if imagem:
        atualizar_banco_dados(imagem, tema_escolhido)
        print("✅ Tarefa cumprida! Encerrando script.")
    else:
        print("❌ Falha na tarefa.")