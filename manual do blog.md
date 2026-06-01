# Manual do Blog

## Introdução
Este manual é um guia prático para quem vai usar o blog. Ele explica passo a passo como criar, editar e publicar posts com SEO, slug amigável, alt de imagem e canonical.

---

## 1. Acessar o Admin
1. Abra o navegador e acesse: `/blog/#/admin`
2. Faça login com usuário e senha.
3. Após o login, escolha entre as abas:
   - `Novo post`
   - `Editar post`
   - `Excluir`

---

## 2. Criar um novo post
1. Clique em **Novo post**.
2. Preencha o campo **Título**.
3. Preencha o campo **Meta Title**:
   - Ele deve ser escrito manualmente.
   - Use um título objetivo que apareça bem nos buscadores.
4. Escreva a **Meta Description**:
   - Resuma o post em 1-2 frases.
   - Use no máximo 155 caracteres.
5. Confira o **Slug**:
   - Ele é gerado automaticamente a partir do título.
   - Use apenas letras, números e hífens.
   - Se quiser, você pode ajustar manualmente.
6. Adicione **Tags** se desejar.
7. Digite o **conteúdo** do post no editor.
8. Para inserir uma imagem no conteúdo:
   - Clique no ícone de imagem no editor.
   - Informe o texto alternativo (`alt`) no diálogo.
   - Escolha a imagem e insira.
9. Faça upload da **imagem de capa**.
10. Preencha o campo **Alt text da imagem de capa**.
11. Clique em **Postar**.

---

## 3. Editar um post existente
1. Clique em **Editar post**.
2. Escolha o post na lista.
3. Altere os campos desejados:
   - Título
   - Meta Title
   - Meta Description
   - Slug
   - Conteúdo
   - Imagem de capa
4. Para adicionar ou trocar imagens no conteúdo, use o botão de inserir imagem e informe o `alt` no diálogo antes do upload.
5. Clique em **Atualizar**.

---

## 4. Excluir um post
1. Clique em **Excluir**.
2. Selecione o post que deseja remover.
3. Confirme a exclusão.

---

## 5. O que é importante lembrar
- **Título**: use algo claro e direto.
- **Meta Title**: é o título que aparece no Google.
- **Meta Description**: é o resumo que aparece no Google.
- **Slug**: é a URL amigável do post.
- **Alt de imagem**: sempre preencha para acessibilidade.
- **Canonical**: o sistema já gera automaticamente a URL oficial do post.

---

## 6. Como o post aparece na URL
- O endereço do post usa o slug: `/blog/#/posts/seu-slug-aqui`
- Exemplo:
  - Título: `Erro de pedido em restaurante`
  - Slug: `erro-de-pedido-restaurante`
  - URL final: `/blog/#/posts/erro-de-pedido-restaurante`

---

## 7. Dicas rápidas
- Não deixe a Meta Description em branco.
- Evite slugs muito longos.
- Use palavras simples e diretas.
- Preencha `alt` para todas as imagens inseridas no conteúdo.
- Verifique a imagem de capa antes de postar.

---

## 8. Comportamento automático
- O blog gera o slug automaticamente a partir do título.
- Se o post não tiver slug, o sistema gera pelo título.
- A tag canonical é criada automaticamente no `<head>` para proteger a URL oficial.
