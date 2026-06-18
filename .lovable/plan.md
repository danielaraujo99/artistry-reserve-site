
# Redesenho Premium Completo — Estúdio Elaine Hahn

Refazer o site público em nível agência internacional, reformular painel admin, criar tela de login premium (somente login, sem cadastro), corrigir o erro de runtime e provisionar a conta `admin@painel.com`.

## 1. Diagnóstico

**Site público (prints enviados):** hero com foto inadequada (bancada), seções soltas todas no mesmo card escuro, serviços viraram pílulas sem preço/descrição, galeria sem ritmo, agendamento em modal apertado, footer pobre.

**Erro runtime `/admin/appointments`:** `Invariant: Expected to find a match below the root match in SPA mode` — causado por estrutura SSR-off + Outlet sem fallback. Vou auditar `_authenticated/route.tsx`, `admin.tsx` e cada rota filha.

**Logo:** PNG com fundo branco — vai mal sobre header escuro.

## 2. Logo

- Reprocessar `/public/logo.png` removendo fundo branco (versão transparente).
- Criar variante clara para usar sobre fundo escuro (header admin, footer).

## 3. Conta admin

- Criar `admin@painel.com / admin1` via Supabase Admin API.
- Inserir role `admin` em `user_roles` para esse user_id.
- Confirmar e-mail automaticamente (sem fluxo de verificação).
- Feito por server function única executada uma vez (idempotente).

## 4. Tela de login (`/auth`)

- Layout split-screen: à esquerda imagem editorial (foto real do studio com gradiente sutil) + frase de marca; à direita card com logo, título "Acesso restrito", campos e-mail/senha, botão primário "Entrar", link discreto "Esqueci minha senha".
- **Remover totalmente** abas/tabs e formulário de cadastro.
- Estados: loading no botão, mensagem de erro inline, toast de sucesso.
- Responsivo: split colapsa em mobile, mantendo logo + card centralizado.
- Tipografia e tokens iguais ao resto do projeto (Cormorant + Inter, paleta ivory/gold/charcoal).

## 5. Site público — nova arquitetura

Separar âncoras em rotas reais (SEO + UX):

```
/                Home
/servicos        Catálogo completo
/galeria         Masonry editorial com lightbox
/sobre           Estúdio + profissionais em profundidade
/contato         Endereço, mapa, horários, WhatsApp
/agendar         Página dedicada de agendamento (sem modal)
```

Cada rota com `head()` próprio (title, description, og:title, og:description). Hero substituído por composição editorial real (fotos da galeria) com layout split + stats + CTAs.

**Seções da Home:**
1. Hero split com badge de formações
2. Faixa de marcas (Pivot Point, L'Oréal, SOFT, ICloiral)
3. Serviços em destaque (4 cards com imagem, nome, preço)
4. Mosaico galeria asymmetric (6 fotos → /galeria)
5. Preview profissionais (foto + nome → /sobre)
6. Depoimentos editoriais
7. CTA full-bleed final

**Página `/servicos`:** grid 2 col com categoria, nome, descrição real, duração, preço, botão "Agendar este serviço" (deep link).

**Página `/galeria`:** masonry CSS columns + lightbox.

**Página `/sobre`:** história do estúdio + zigzag Elaine/Verônica com bio completa, especialidades em chips, CTA agendar.

**Página `/contato`:** grid endereço/horários/telefones + mapa embed + WhatsApp.

**Página `/agendar` (sem modal):**
- Layout 2 col desktop: esquerda sticky com resumo da reserva, direita stepper 4 passos (Serviço → Profissional → Data/Hora → Dados).
- Mobile: stepper full-width, resumo embaixo.
- Suporta `?service=ID&pro=ID`.
- Salva em `appointments` + abre WhatsApp pré-preenchido + tela de confirmação.

## 6. Header / Footer públicos

- **Header**: logo transparente + nav real (Início, Serviços, Galeria, Sobre, Contato) + botão "AGENDAR" gold. Mobile: drawer lateral completo. Glass blur ao rolar.
- **Footer**: 4 colunas (marca, navegação, contato, horários) + barra inferior com social/copyright.

## 7. Painel admin — reformulação completa

**Correção do invariant:** auditar `_authenticated/route.tsx` (gate ssr:false), garantir `<Outlet />` em `admin.tsx`, e garantir que cada rota filha tem `component` válido. Reproduzir e fixar.

**Layout (organizado, sem nada centralizado isolado):**
- Sidebar fixa esquerda (240px) usando shadcn `Sidebar` com `collapsible="icon"` — logo no topo (versão clara sobre fundo escuro), nav com ícones e labels, perfil + logout no rodapé.
- Topbar: SidebarTrigger + breadcrumb + busca rápida + avatar.
- Conteúdo: container full-width com padding consistente, grid 12 colunas, cards padronizados.

**Páginas:**

1. **Dashboard (`/admin`)**: KPIs (agendamentos hoje, faturamento mês, novos clientes, ticket médio) + gráfico de barras receita 6 meses + gráfico linha agendamentos 30 dias + lista próximos agendamentos + top serviços. Tudo com Recharts, layout grid responsivo.

2. **Agendamentos (`/admin/appointments`)**: tabela com filtros (status, profissional, data range, busca cliente), ações inline (confirmar/cancelar/concluir), drawer lateral com detalhes, botão "Novo agendamento manual".

3. **Clientes (`/admin/clients`)**: tabela com busca, histórico ao clicar, total gasto, última visita, contato direto WhatsApp.

4. **Serviços (`/admin/services`)**: cards editáveis com nome, categoria, duração, preço, ativo/inativo. Form de criar/editar em drawer.

5. **Galeria (`/admin/gallery`)**: grid das fotos atuais (vindas de `/public/gallery/`), upload de novas para bucket Supabase Storage, reordenar, ativar/desativar, editar título.

6. **Financeiro (`/admin/finance`)**:
   - Aba Visão geral: KPIs (receita, despesas, lucro, margem), gráfico área receita vs despesa 12 meses, gráfico pizza categorias de despesa.
   - Aba Receitas: tabela de transações income (auto-criadas de agendamentos concluídos + manuais).
   - Aba Despesas: cadastro de despesas categorizadas (fornecedores, aluguel, produtos, salário, marketing, etc).
   - Aba Contas a pagar: lista de contas com vencimento, status (pendente/pago/atrasado), marcar como pago, alerta visual para próximas/atrasadas.

**Storage:** criar bucket `gallery` (public) para upload das fotos pelo admin.

**Migração:** adicionar tabela `bills` (contas a pagar) com vencimento, valor, categoria, fornecedor, status, recorrência opcional. Tudo com RLS exigindo role admin.

## 8. Responsividade

Padrão `grid-cols-[minmax(0,1fr)_auto]` em headers de cards, `min-w-0` em textos, `shrink-0` em ícones, breakpoints sm/md/lg/xl. Testes em 375/768/1280.

## 9. Dependências

- `framer-motion` para animações de entrada (fade-up, parallax leve).
- Manter Recharts (já instalado).

## 10. Arquivos

**Criar:**
- `src/routes/servicos.tsx`, `galeria.tsx`, `sobre.tsx`, `contato.tsx`, `agendar.tsx`
- `src/components/site/Hero.tsx`, `ServiceCard.tsx`, `GalleryMasonry.tsx`, `ProfessionalBlock.tsx`, `Testimonials.tsx`, `CtaBand.tsx`, `BookingFlow.tsx`, `Lightbox.tsx`
- `src/components/admin/AdminSidebar.tsx`, `AdminTopbar.tsx`, `KpiCard.tsx`, `RevenueChart.tsx`, `BookingsChart.tsx`, `BillsTable.tsx`
- `src/routes/_authenticated/admin.bills.tsx` (contas a pagar)
- `src/lib/seed-admin.functions.ts` (criar conta admin idempotente)
- Migração: tabela `bills` + bucket `gallery`

**Editar:**
- `src/routes/index.tsx` — home nova
- `src/routes/auth.tsx` — login premium, sem cadastro
- `src/components/site/Header.tsx`, `Footer.tsx`, `Logo.tsx`
- `src/routes/_authenticated/admin.tsx` — novo layout sidebar
- `src/routes/_authenticated/admin.index.tsx` — dashboard novo
- `src/routes/_authenticated/admin.appointments.tsx`, `clients.tsx`, `services.tsx`, `gallery.tsx`, `finance.tsx` — reformular
- `src/styles.css` — tokens adicionais
- `src/components/site/BookingDialog.tsx` — remover ou converter para redirect para `/agendar`
- `public/logo.png` — versão transparente

## 11. Ordem de execução

1. Migração (bills + bucket + qualquer ajuste) — aguarda aprovação
2. Processar logo transparente
3. Criar conta admin via server function
4. Refazer auth (login premium)
5. Refazer site público (rotas + componentes)
6. Refazer painel admin (sidebar + páginas + financeiro completo)
7. Corrigir invariant e validar `/admin/*`
8. Checar build + preview health + responsividade

## 12. Fora de escopo

- Pagamento online
- Notificações por email automáticas
- App mobile

Pode aprovar para implementar?
