## 🔍 INSTRUÇÕES PARA DEBUG - Problema: Role "barber" não está sendo salvo

Criei logs detalhados no código para identificar exatamente onde está o problema.

### ✅ O que foi corrigido:

1. **Email inconsistente** - A coluna é `Email` (maiúscula) mas estava sendo acessada como `email`
2. **Email não estava sendo salvo em clientes** - Adicionado ao formulário público de cadastro
3. **Console.logs detalhados** - Para rastrear cada passo do cadastro de barbeiro

---

## 📋 Como testar:

### 1. Abrir o navegador Dev Tools
- Pressione **F12** ou **Ctrl+Shift+I** (Windows/Linux)
- Clique na aba **"Console"**

### 2. Ir para a página de admin de barbeiros
- Acesse: http://localhost:3001/admin/barbers
- Clique em **"+ Novo Barbeiro"**

### 3. Preencher o formulário com dados de teste
```
Nome: João da Silva
Email: joao@test.com
Telefone: (11) 99999-9999
Senha: Senha123!
```

### 4. Clicar em "Cadastrar Barbeiro"
- **Observar os logs no console** - Deve mostrar vários logs com "===", "Step 1", "Step 2", etc.

### 5. Compartilhar os logs comigo
- Abrir o console inteiro
- Copiar TODO O CONTEÚDO que aparecer
- Colar na resposta

---

## 🔧 Possíveis Problemas que os logs podem revelar:

### ❌ Se aparecer um erro durante "Criando usuário no Auth"
- Pode ser email duplicado
- Pode ser erro de autenticação

### ❌ Se aparecer um erro durante "Criando profile"
- Pode ser falta de permissão RLS
- Pode ser um campo obrigatório faltando
- Pode ser constraint na tabela

### ❌ Se o role for salvo como "client" em vez de "barber"
- Há um DEFAULT constraint ou trigger que está mudando o valor
- Há um problema com a política RLS

### ❌ Se o role aparecer como NULL
- O upsert não está atualizando aquele campo

---

## 🗄️ Verificar banco manualmente (alternativo):

Se preferir, também criei um arquivo **VERIFICAR_SCHEMA.sql** que você pode rodar no Supabase:

1. Vá para: https://supabase.com/dashboard/project/_/sql/new
2. Cole o conteúdo de `VERIFICAR_SCHEMA.sql`
3. Execute cada query e compartilhe os resultados

Isso vai nos mostrar:
- Estrutura exata da tabela `profiles`
- Se há RLS policies
- Quais barbeiros estão no banco

---

## 💡 Se ainda assim não funcionar:

Há um ALERTA IMPORTANTE no código que detecta se o role não foi salvo corretamente:

```
⚠️ ALERTA: Role não foi salvo como "barber"!
```

Se aparecer isso, significa que o upsert executa sem erro, mas não está realmente salvando o valor de `role: 'barber'`.
