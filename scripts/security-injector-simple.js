/**
 * 🛡️ SECURITY INJECTOR - Pós-processador SIMPLES para injetar segurança
 * Versão simplificada que funciona com ES modules
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// 🚀 Função principal de injeção
function injectSecurity() {
    console.log('🛡️ INICIANDO INJEÇÃO DE SEGURANÇA SIMPLES');
    console.log('==========================================');
    
    const securityScript = '    <script src="security-init.js"></script>';
    let processedFiles = 0;
    
    function processFile(filePath) {
        try {
            console.log(`📝 Processando: ${filePath}`);
            
            let content = readFileSync(filePath, 'utf8');
            
            // Verificar se já tem segurança
            if (content.includes('security-init.js')) {
                console.log(`✅ ${filePath} já protegido`);
                return;
            }
            
            // Verificar se precisa de proteção
            const needsProtection = content.includes('Gabriel Malheiros') || 
                                  content.includes('FAESA') || 
                                  content.includes('<img') ||
                                  content.includes('javascript');
            
            if (!needsProtection) {
                console.log(`⏭️ ${filePath} não precisa de proteção`);
                return;
            }
            
            // Injetar script
            let injected = false;
            
            if (content.includes('</head>')) {
                content = content.replace('</head>', `${securityScript}\n  </head>`);
                injected = true;
            } else if (content.includes('<head>')) {
                content = content.replace('<head>', `<head>\n${securityScript}`);
                injected = true;
            } else if (content.includes('<body')) {
                const bodyIndex = content.indexOf('<body');
                const bodyEnd = content.indexOf('>', bodyIndex) + 1;
                content = content.slice(0, bodyEnd) + `\n${securityScript}\n` + content.slice(bodyEnd);
                injected = true;
            }
            
            if (injected) {
                writeFileSync(filePath, content, 'utf8');
                processedFiles++;
                console.log(`🛡️ Proteção adicionada: ${filePath}`);
            }
            
        } catch (error) {
            console.error(`❌ Erro em ${filePath}:`, error.message);
        }
    }
    
    function processDirectory(dirPath) {
        try {
            const items = readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = join(dirPath, item);
                
                try {
                    const stat = statSync(fullPath);
                    
                    if (stat.isDirectory()) {
                        if (!['node_modules', '.git', '.vscode', 'scripts', 'dist-debug'].includes(item)) {
                            processDirectory(fullPath);
                        }
                    } else if (extname(item) === '.html') {
                        processFile(fullPath);
                    }
                } catch (e) {
                    // Pular arquivos que não conseguimos acessar
                }
            }
        } catch (error) {
            console.error(`❌ Erro no diretório ${dirPath}:`, error.message);
        }
    }
    
    // Processar diretório atual
    const currentDir = process.cwd();
    processDirectory(currentDir);
    
    // Tentar processar dist também
    try {
        const distPath = join(currentDir, 'dist');
        if (statSync(distPath).isDirectory()) {
            console.log('📁 Processando dist...');
            processDirectory(distPath);
        }
    } catch (e) {
        console.log('📁 Dist não encontrado');
    }
    
    console.log('\n📊 RELATÓRIO FINAL');
    console.log('==================');
    console.log(`✅ Arquivos protegidos: ${processedFiles}`);
    console.log('🎉 Injeção de segurança concluída!');
}

// Executar automaticamente
injectSecurity();