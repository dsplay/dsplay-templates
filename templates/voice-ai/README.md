![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - VAPI Agents Integration

Este é um template React para integração com agentes VAPI na plataforma DSPLAY - Digital Signage. O template permite a criação de experiências interativas com assistentes virtuais, incluindo visualização de áudio em tempo real e efeitos visuais dinâmicos.

## Características

- Integração com VAPI AI para assistentes virtuais
- Visualização de áudio em tempo real
- Efeitos visuais dinâmicos com SVG
- Suporte a múltiplos idiomas (i18n)
- Interface responsiva
- Animações suaves com KUTE.js

## Configuração do Template

O template utiliza as seguintes variáveis no arquivo `dsplay-data.js`:

```javascript
var dsplay_template = {
    // ID do assistente VAPI
    assistant_id: "your-agent-id",
    // Chave de API do VAPI
    api_key: "your-vapi-api-key",
    
    // Cores do gradiente para efeitos visuais
    gradiente_color_1: "#FD28DA", // Cor principal do gradiente
    gradiente_color_2: "#EE8997", // Cor secundária do gradiente
    
    // Imagem de fundo do template
    background_media: "../test-assets/blur.jpg"
};
```

### Descrição das Variáveis

- `assistant_id`: Identificador único do assistente VAPI configurado
- `api_key`: Chave de API necessária para autenticação com o serviço VAPI
- `gradiente_color_1`: Cor principal utilizada nos efeitos visuais e gradientes
- `gradiente_color_2`: Cor secundária utilizada para criar contraste nos efeitos visuais
- `background_media`: Caminho para a imagem de fundo do template

## Iniciando o Projeto

```bash
# Clone o repositório
git clone https://github.com/dsplay/template-vapi.git

# Entre no diretório
cd template-vapi

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

## Desenvolvimento

Durante o desenvolvimento, você pode usar o arquivo `dsplay-data.js` localizado na pasta `public` para testar diferentes configurações.

> O arquivo `dsplay-data.js` é um mock com dados de teste durante o desenvolvimento. O DSPLAY Player App substituirá automaticamente este arquivo com conteúdo real em tempo de execução.

### Usando Variáveis do Template

Para acessar as variáveis do template em seus componentes React, utilize o hook `useTemplateVal`:

```jsx
import { useTemplateVal } from '@dsplay/react-template-utils';

function SeuComponente() {
  const assistantId = useTemplateVal('assistant_id');
  const apiKey = useTemplateVal('api_key');
  const gradienteColor1 = useTemplateVal('gradiente_color_1');
  const gradienteColor2 = useTemplateVal('gradiente_color_2');
  const backgroundMedia = useTemplateVal('background_media');
  
  // ... resto do código
}
```

## Assets de Teste

Para usar assets de teste (imagens, vídeos, etc) durante o desenvolvimento:

1. Coloque os arquivos na pasta `public/test-assets`
2. Referencie-os no `dsplay-data.js` usando o caminho relativo:

```javascript
var dsplay_template = {
    background_media: '../test-assets/sua-imagem.jpg'
};
```

> A pasta `public/test-assets` é automaticamente excluída do build de produção.

## Build de Produção

Para criar um build de produção do template, pronto para ser enviado ao DSPLAY:

```bash
npm run zip
```

Isso irá gerar um arquivo `template.zip` pronto para ser implantado no [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Mais Informações

Para mais informações sobre templates HTML do DSPLAY, visite: https://developers.dsplay.tv/docs/html-templates