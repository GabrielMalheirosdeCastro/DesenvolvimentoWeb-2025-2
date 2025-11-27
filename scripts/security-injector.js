/**
 * 🛡️ SECURITY INJECTOR - Pós-processador para injetar segurança em todas as páginas
 * Adiciona automaticamente o script de segurança a todas as páginas HTML
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 * Versão: 2.0.0 - Auto-injeção de segurança
 */

const { readFileSync, writeFileSync, readdirSync, statSync } = await import('fs');
const { join, extname } = await import('path');

class SecurityInjector {
    constructor() {
        this.securityScript = '    <script src="security-init.js"></script>';
        this.injectionPoint = '</head>';
        this.processedFiles = 0;
        this.errors = [];
    }

    /**
     * 🚀 Processar todos os arquivos HTML no diretório
     */
    processDirectory(dirPath) {
        console.log(`🔍 Processando diretório: ${dirPath}`);
        
        try {
            const items = readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = join(dirPath, item);
                const stat = statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Pular diretórios específicos
                    if (!['node_modules', '.git', '.vscode', 'dist-debug', 'scripts'].includes(item)) {
                        this.processDirectory(fullPath);
                    }
                } else if (extname(item) === '.html') {
                    this.processHTMLFile(fullPath);
                }
            }
            
        } catch (error) {
            console.error(`❌ Erro processando diretório ${dirPath}:`, error.message);
            this.errors.push({ type: 'directory', path: dirPath, error: error.message });
        }
    }

    /**
     * 📝 Processar arquivo HTML específico
     */
    processHTMLFile(filePath) {
        try {
            console.log(`📝 Processando: ${filePath}`);
            
            let content = readFileSync(filePath, 'utf8');
            
            // Verificar se já tem o script de segurança
            if (content.includes('security-init.js')) {
                console.log(`✅ ${filePath} já possui proteção de segurança`);
                return;
            }

            // Verificar se é uma página que precisa de proteção
            if (!this.needsProtection(content)) {
                console.log(`⏭️ ${filePath} não necessita proteção`);
                return;
            }

            // Injetar script de segurança
            const injectedContent = this.injectSecurityScript(content);
            
            if (injectedContent !== content) {
                writeFileSync(filePath, injectedContent, 'utf8');
                this.processedFiles++;
                console.log(`🛡️ Proteção adicionada a: ${filePath}`);
            }
            
        } catch (error) {
            console.error(`❌ Erro processando ${filePath}:`, error.message);
            this.errors.push({ type: 'file', path: filePath, error: error.message });
        }
    }

    /**
     * 🔍 Verificar se página precisa de proteção
     */
    needsProtection(content) {
        // Não processar se for apenas template ou arquivo de configuração
        if (content.includes('{{') || content.includes('{%')) {
            return false;
        }

        // Verificar se tem conteúdo relevante para proteger
        const protectionIndicators = [
            '<img', '<canvas', '<video', '<audio',
            'Gabriel Malheiros', 'FAESA', 'portfolio',
            'javascript', 'download', 'src='
        ];

        return protectionIndicators.some(indicator => 
            content.toLowerCase().includes(indicator.toLowerCase())
        );
    }

    /**
     * 💉 Injetar script de segurança
     */
    injectSecurityScript(content) {
        // Procurar por diferentes pontos de injeção
        let injectedContent = content;
        let injected = false;

        // Tentar injetar antes do fechamento do head
        if (injectedContent.includes('</head>')) {
            injectedContent = injectedContent.replace(
                '</head>',
                `${this.securityScript}\n  </head>`
            );
            injected = true;
        } 
        // Se não tem </head>, tentar após <head>
        else if (injectedContent.includes('<head>')) {
            injectedContent = injectedContent.replace(
                '<head>',
                `<head>\n${this.securityScript}`
            );
            injected = true;
        }
        // Se não tem head, injetar no início do body
        else if (injectedContent.includes('<body')) {
            const bodyIndex = injectedContent.indexOf('<body');
            const bodyEndIndex = injectedContent.indexOf('>', bodyIndex) + 1;
            
            injectedContent = 
                injectedContent.slice(0, bodyEndIndex) + 
                `\n${this.securityScript}\n` +
                injectedContent.slice(bodyEndIndex);
            injected = true;
        }
        // Último recurso: adicionar no início do documento
        else {
            injectedContent = `<script src="security-init.js"></script>\n${injectedContent}`;
            injected = true;
        }

        return injectedContent;
    }

    /**
     * 📊 Gerar relatório
     */
    generateReport() {
        console.log('\n📊 RELATÓRIO DE INJEÇÃO DE SEGURANÇA');
        console.log('=====================================');
        console.log(`✅ Arquivos processados: ${this.processedFiles}`);
        
        if (this.errors.length > 0) {
            console.log(`❌ Erros encontrados: ${this.errors.length}`);
            this.errors.forEach(error => {
                console.log(`   - ${error.path}: ${error.error}`);
            });
        } else {
            console.log('🎉 Nenhum erro encontrado!');
        }
        
        console.log('=====================================\n');
    }
}

// 🚀 EXECUÇÃO PRINCIPAL
function main() {
    console.log('🛡️ INICIANDO INJEÇÃO DE SEGURANÇA');
    console.log('==================================');
    
    const injector = new SecurityInjector();
    const rootDir = process.cwd();
    
    // Processar diretório raiz e dist
    injector.processDirectory(rootDir);
    
    const distPath = join(rootDir, 'dist');
    try {
        if (statSync(distPath).isDirectory()) {
            console.log('📁 Processando diretório dist...');
            injector.processDirectory(distPath);
        }
    } catch (e) {
        console.log('📁 Diretório dist não encontrado, pulando...');
    }
    
    // Gerar relatório
    injector.generateReport();
    
    if (injector.errors.length === 0) {
        console.log('🎉 Injeção de segurança concluída com sucesso!');
        process.exit(0);
    } else {
        console.log('⚠️ Injeção concluída com alguns erros.');
        process.exit(0); // Não falhar o build por causa de erros não críticos
    }
}

// Executar se chamado diretamente
if (process.argv[1].includes('security-injector.js')) {
    main();
}

export default SecurityInjector;