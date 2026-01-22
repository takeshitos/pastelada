#!/usr/bin/env node

/**
 * Script de Verificação - Sistema Pastelada GOJ Imac
 * 
 * Este script verifica se todas as variáveis de ambiente necessárias
 * estão configuradas corretamente.
 * 
 * USO:
 * node verificar-setup.js
 */

console.log('🔍 Verificando configuração do Sistema Pastelada...\n')

// Variáveis obrigatórias
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

let allOk = true
const results = []

// Verificar cada variável
requiredVars.forEach(varName => {
  const value = process.env[varName]
  const exists = !!value
  const isPlaceholder = value && (value.includes('placeholder') || value.includes('your-'))
  
  if (!exists) {
    results.push({
      name: varName,
      status: '❌',
      message: 'NÃO CONFIGURADA'
    })
    allOk = false
  } else if (isPlaceholder) {
    results.push({
      name: varName,
      status: '⚠️',
      message: 'USANDO PLACEHOLDER (substitua com valor real)'
    })
    allOk = false
  } else {
    const preview = value.substring(0, 20) + '...'
    results.push({
      name: varName,
      status: '✅',
      message: `Configurada (${preview})`
    })
  }
})

// Exibir resultados
console.log('Variáveis de Ambiente:\n')
results.forEach(result => {
  console.log(`${result.status} ${result.name}`)
  console.log(`   ${result.message}\n`)
})

// Verificar arquivo .env.local
const fs = require('fs')
const path = require('path')
const envPath = path.join(process.cwd(), '.env.local')

console.log('\nArquivo .env.local:')
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo existe')
  
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')
  const hasAnon = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')
  const hasService = envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')
  
  console.log(`   ${hasUrl ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_URL`)
  console.log(`   ${hasAnon ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  console.log(`   ${hasService ? '✅' : '❌'} SUPABASE_SERVICE_ROLE_KEY`)
} else {
  console.log('⚠️  Arquivo não encontrado')
  console.log('   Crie o arquivo .env.local baseado em .env.local.example')
  allOk = false
}

// Verificar conexão com Supabase (se possível)
console.log('\n' + '='.repeat(60))

if (allOk) {
  console.log('\n✅ CONFIGURAÇÃO OK!')
  console.log('\nPróximos passos:')
  console.log('1. Execute: npm run dev')
  console.log('2. Acesse: http://localhost:3000')
  console.log('3. Teste o sistema localmente')
  console.log('4. Configure as mesmas variáveis no Vercel')
  console.log('5. Faça redeploy no Vercel')
} else {
  console.log('\n⚠️  CONFIGURAÇÃO INCOMPLETA')
  console.log('\nO que fazer:')
  console.log('1. Acesse: https://app.supabase.com')
  console.log('2. Vá em Settings → API do seu projeto')
  console.log('3. Copie as credenciais')
  console.log('4. Adicione no arquivo .env.local')
  console.log('5. Execute este script novamente')
  console.log('\nVeja o guia completo em: CONFIGURACAO-VERCEL.md')
}

console.log('\n' + '='.repeat(60) + '\n')

// Exit code
process.exit(allOk ? 0 : 1)
