-- Cole este script no Supabase SQL Editor para verificar a estrutura
-- Acesse: https://supabase.com/dashboard/project/_/sql/new

-- 1. Verificar estrutura da tabela profiles
\d profiles

-- 2. Verificar todas as colunas e tipos
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Verificar se há RLS policies na tabela
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 4. Listar todos os perfis com barbeiros
SELECT id, full_name, phone, Email, role, created_at
FROM profiles
WHERE role = 'barber'
ORDER BY created_at DESC;

-- 5. Listar TODOS os perfis (incluindo clientes)
SELECT id, full_name, phone, Email, role, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 20;

-- 6. Verificar se a coluna 'Email' existe (com maiúscula)
SELECT EXISTS(
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'profiles' AND column_name = 'Email'
) AS email_maiuscula_existe;

-- 7. Verificar se a coluna 'email' existe (com minúscula)
SELECT EXISTS(
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'profiles' AND column_name = 'email'
) AS email_minuscula_existe;
