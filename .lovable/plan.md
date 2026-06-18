# Redesign Premium — Studio de Beleza Elaine Hahn

Reconstrução completa de **todo o site público** com direção de arte editorial de alto padrão (branco / preto suave / bege / dourado leve, serif + sans moderna). O **painel admin não será tocado**.

## Descoberta crítica
As tabelas `gallery_items`, `professionals` e `services` estão **vazias**. Hoje a galeria, a seção "Mãos que assinam" e o fluxo de agendamento renderizam vazio. Por isso o redesign inclui **popular os dados reais** com as imagens do site `studio-elaine.com.br`.

## 1. Dados e imagens reais (base de tudo)
- Baixar para `public/team/`: `Elaine.png` e `Veronica.png` (seção "O Estúdio" do site de referência).
- As 9 imagens de transformações (`destaque-001..009`) já existem em `public/gallery/`.
- Migration de seed (idempotente) populando:
  - `professionals`: **Elaine Hahn** (10+ anos, Cortes/Coloração/Mechas, Pivot Point DCF1/DCF2, Chaves da Cor L'Oréal) e **Verônica Pereira** (18 anos, Design de Mechas, Colorimetria, Terapia Capilar, Escovaria Avançada) — com `photo_url` apontando para `/team/*.png`.
  - `gallery_items`: as 9 transformações.
  - `services`: catálogo real do site (Escova, Corte, Coloração, Mechas, Tratamentos Capilares, Babyliss, Alisamento) por categoria, com duração/preço base.
- Inclui GRANTs/políticas de leitura `anon` somente se ainda não existirem (sem mexer no admin).

## 2. Design system (refino em `src/styles.css`)
- Manter par tipográfico atual (Cormorant Garamond display + Inter), refinar escala/tracking.
- Paleta: branco, preto suave (`ink`), bege/ivory, dourado leve — já presente; ajustar contraste e suavizar dourado.
- Glassmorphism muito sutil, sombras leves (`shadow-luxe`/`editorial`), grid de 12 colunas, ritmo de espaçamento generoso e consistente entre seções.

## 3. Páginas (redesenho seção por seção)

### Home (`src/routes/index.tsx`)
Fluxo psicológico de conversão: impacto → autoridade → desejo → confiança → conexão → ação.
- **Hero** dark editorial: imagem real, headline curta forte, subtítulo refinado, CTAs `AGENDAR HORÁRIO` + `VER TRANSFORMAÇÕES`, parallax/blur sutil.
- **Prova de autoridade**: números discretos + formações (faixa minimalista).
- **Serviços**: cards limpos com hierarquia, destaque para loiros/coloração/tratamentos.
- **Transformações** (maior peso visual): grid editorial estilo portfólio de luxo, alinhamento perfeito, hover sutil.
- **Profissionais**: layout alternado imagem/texto, fotos reais (Elaine/Verônica), texto curto.
- **Sobre** (resumo) + **CTA final** dark.

### Galeria (`src/routes/galeria.tsx`)
- Grid editorial alinhado (proporção uniforme), lightbox refinado com navegação por teclado, lazy-load.

### Serviços (`src/routes/servicos.tsx`)
- Hero editorial + catálogo agrupado por categoria, espaçamento e alinhamento precisos, CTA por serviço.

### Sobre (`src/routes/sobre.tsx`)
- Narrativa institucional curta, valores, profissionais em zigzag editorial com fotos reais.

### Contato (`src/routes/contato.tsx`)
- Cards de canais (WhatsApp em destaque), mapa, bloco de CTA. Refino de espaçamento/hierarquia.

### Agendamento (`src/routes/agendar.tsx` + `src/components/site/BookingFlow.tsx`)
Tratado como **produto digital app-like** (mobile-first):
- Fluxo em 5 passos: Serviço → Profissional → Data → Horário → Revisão.
- Progress bar visível, transições suaves, resumo fixo lateral, feedback por etapa.
- Confirmação: tela de sucesso elegante + **abertura automática do WhatsApp** com mensagem pronta (Dia / Hora / Serviço / Profissional). Remover textos supérfluos ("em baixo de sua reserva").

### Componentes globais
- **Header** (`Header.tsx`): fixo, logo original intacta, menu elegante, botão `AGENDAR` sempre visível (desktop + mobile).
- **Footer** (`Footer.tsx`): clean, logo intacta, links essenciais, contato discreto.
- Garantir que **não** exista botão flutuante de chat no canto inferior direito.

## 4. Performance & responsividade
- Imagens otimizadas (`loading="lazy"`, dimensões), animações discretas via framer-motion, responsividade mobile/tablet/desktop, código limpo.

## Restrições (não negociáveis)
- **Não tocar no admin** (`src/routes/_authenticated/*`, `src/components/admin/*`).
- Não alterar a logo original. Não inventar conteúdo. Manter usuário admin `admin@painel.com`.

## Notas técnicas
- Seed via migration SQL idempotente (`on conflict do nothing`).
- `Elaine.png`/`Veronica.png` baixados para `public/team/` (sem alterar `client.ts`/arquivos auto-gerados).
- Sem mudanças em lógica de backend além do seed de conteúdo.
