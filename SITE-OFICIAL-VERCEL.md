# 🌐 Site Oficial - Desenvolvimento Web 2025-2

## 📍 Endereço Oficial do Projeto

**🔗 Site Principal:** https://desenvolvimento-web-2025-2.vercel.app

Este é o endereço oficial e funcional do projeto desenvolvido como atividade da disciplina de Desenvolvimento Web na FAESA.

## 🎯 Informações Importantes

### ✅ Site Funcionando
- **URL Vercel:** https://desenvolvimento-web-2025-2.vercel.app
- **Status:** ✅ Online e funcional
- **Deploy:** Automático via Vercel
- **SSL:** ✅ Certificado válido

### ❌ Redirecionamentos Não Configurados
- **gabrielmalheiros.com.br:** ❌ Não configurado
- **www.gabrielmalheiros.com.br:** ❌ Não configurado
- **portfolio.gabrielmalheiros.com.br:** ❌ Não configurado

## 📊 Ambientes de Deploy

### 1. 🚀 Vercel (Principal)
- **URL:** https://desenvolvimento-web-2025-2.vercel.app
- **Status:** ✅ Ativo
- **Deploy:** Automático via Git
- **Performance:** Otimizada

### 2. 📁 GitHub Pages (Backup)
- **URL:** https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2
- **Status:** ✅ Ativo
- **Deploy:** Via GitHub Actions
- **Uso:** Backup e demonstração

## 🔧 Configuração Técnica

O sistema detecta automaticamente o ambiente e configura as URLs corretas:

```typescript
// Detecção automática de ambiente
if (hostname === 'desenvolvimento-web-2025-2.vercel.app') {
  autoUrl = `${protocol}//${hostname}`;
  environment = 'vercel';
  document.documentElement.setAttribute('data-environment', 'vercel');
}
```

## 📝 Para Avaliação Acadêmica

**Professor/Avaliador:** Use o link oficial do Vercel para acessar o projeto:

**🎯 https://desenvolvimento-web-2025-2.vercel.app**

- Interface responsiva ✅
- React + TypeScript ✅
- CSS3 moderno ✅
- Performance otimizada ✅

## 🛠️ Comandos para Deploy

```powershell
# Deploy automático
npm run build
git add .
git commit -m "feat: atualização"
git push origin main

# Vercel faz deploy automático em ~30 segundos
```

## 📞 Contato

**Aluno:** Gabriel Malheiros de Castro  
**Instituição:** FAESA  
**Email:** gabriel.malheiros@edu.faesa.br  
**GitHub:** @GabrielMalheirosdeCastro  

---

**Última atualização:** 2025-01-10  
**Versão do documento:** 1.0  