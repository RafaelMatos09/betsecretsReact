# BairroFut

Painel do futebol de bairro: elenco, calendário e súmula na API própria, e a tabela do Campeonato Brasileiro ao lado, sem misturar as duas fontes.

## Tecnologias

### Interface

| Peça | Uso |
| --- | --- |
| React 19 | Telas e estado da interface |
| TypeScript | Tipos do painel, da API e dos relatórios |
| Vite | Servidor de desenvolvimento e build |
| Tailwind CSS 4 | Tema visual do BairroFut |
| React Router 7 | Login, calendário, relatórios e estatísticas |
| Axios | Chamadas à API local e ao Brasileirão |
| Lucide | Ícones do menu e dos relatórios |

### API local (`D:\projetos\betsecretsC-`)

| Peça | Uso |
| --- | --- |
| .NET 8 / ASP.NET Core | Endpoints HTTP |
| PostgreSQL | Times, partidas, calendário, escalação e estatísticas |
| Dapper + Npgsql | SQL direto, sem ORM de entidades |
| JWT + BCrypt | Login e senha |
| Swagger | Documentação em desenvolvimento (`http://localhost:5027/swagger`) |
| Docker / Render | Publicação da API |

### Campeonato Brasileiro

A classificação, a visão geral e os jogos oficiais vêm de uma API externa de campeonato, via proxy do Vite em `/api/campeonato`. Isso fica separado, no menu, do que a API do BairroFut grava.

## Como rodar

1. Suba a API .NET em `http://localhost:5027`.
2. Neste projeto:

```bash
npm install
npm run dev
```

O Vite publica o painel em `http://localhost:5174` e encaminha `/api` para o backend local. O arquivo `.env.development` pode deixar `VITE_API_URL` vazio para usar esse proxy.

## Check-in

### Calendário de jogos — feito

- Tabela `calendario_jogos` e endpoints de cadastro, listagem, confirmação, status, vínculo com partida e exclusão.
- Aba **Calendário** no menu, com mês, mando, horário e status.
- No Time Society, agendar jogo e abrir o calendário do time.
- Salvar a escalação oficializa a partida e grava `escalacao_jogo`.

Ainda falta: resultado ao vivo dentro do calendário, escolha de rodada na hora de agendar e aviso quando a data muda.

### Relatório de jogadores — feito nesta etapa

- Aba **Relatório de jogadores**.
- Junta escalação, partida, gols e cartões.
- Cada jogo mostra a data e o link **Ver no calendário**, que abre o dia correspondente.
- Filtro por campeonato e por time.

Ainda falta: gráfico de evolução do jogador, minutos jogados somados na temporada e comparação entre campeonatos.

### Estatísticas das partidas — feito nesta etapa

- Aba **Estatísticas**, no formato de confronto.
- Chutes, chutes a gol, posse, escanteios, faltas, impedimentos, cartões, passes e laterais.
- Lançamento manual dos números. Se ainda não houver lançamento, chutes e cartões podem vir dos eventos da partida (`chute`, `chute_gol`, `cartao_amarelo`, `cartao_vermelho` e os demais tipos).
- A tabela `estatistica_partida` é criada na primeira consulta, se ainda não existir.
- Cada confronto também leva ao calendário.

Ainda falta: odds, feed ao vivo, mapa de chutes e preenchimento automático a partir de uma súmula importada.

### O que o menu separa

- **Sua API:** Time Society, Calendário, Relatório de jogadores, Estatísticas, Times e campeonatos.
- **Campeonato Brasileiro:** Visão geral, Classificação e Jogos, com Série A, B, C e D.
- **Palpites** e **Conta** continuam à parte.

### Ainda em aberto no produto

- Telas de palpites, ranking e times/campeonatos ainda são apenas o lugar reservado no menu.
- A aba Jogos do Brasileirão ainda não tem a lista própria; as partidas oficiais aparecem na visão geral.
- Classificação do campeonato de bairro calculada pela API local ainda não tem tela no painel.
