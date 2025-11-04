#!/usr/bin/env node

/**
 * 🔧 SCRIPT DE CORREÇÃO AUTOMÁTICA DE IMPORTS
 * 
 * Este script corrige imports com versões específicas nos arquivos TypeScript
 * Exemplo: "@radix-ui/react-accordion@1.2.3" -> "@radix-ui/react-accordion"
 */

const fs = require('fs');
const path = require('path');

// Função para corrigir imports em um arquivo
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Regex para encontrar imports com versões específicas
    const importRegex = /from\s+["']([^"']+@[\d.]+)["']/g;
    
    content = content.replace(importRegex, (match, importPath) => {
      // Remove a versão (tudo depois do @)
      const cleanPath = importPath.replace(/@[\d.]+$/, '');
      modified = true;
      console.log(`  ✅ ${importPath} -> ${cleanPath}`);
      return match.replace(importPath, cleanPath);
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Arquivo corrigido: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

// Função para processar uma pasta recursivamente
function fixImportsInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      totalFixed += fixImportsInDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (fixImportsInFile(fullPath)) {
        totalFixed++;
      }
    }
  }
  
  return totalFixed;
}

// Executar correção
const uiPath = 'src/components/ui';
console.log('🚀 Iniciando correção de imports...');
console.log(`📁 Processando: ${uiPath}`);

const fixedCount = fixImportsInDirectory(uiPath);

console.log(`\n✅ Correção concluída!`);
console.log(`📊 Arquivos corrigidos: ${fixedCount}`);
console.log('🎯 Próximo passo: Verificar compilação TypeScript');