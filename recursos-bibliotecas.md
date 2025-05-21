# 📚 Bibliotecas e Recursos - Karaokê Competitivo

Este documento lista as principais bibliotecas, APIs e recursos recomendados para o desenvolvimento do projeto de Karaokê Competitivo.

## 🎵 Análise de Áudio e Detecção de Pitch

### Web Audio API
A API nativa do navegador para processamento de áudio em tempo real.
- **Uso**: Captura de áudio do microfone, análise de frequência, processamento de sinal
- **Link**: [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Exemplo**:
```javascript
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
```

### Pitchfinder
Biblioteca JavaScript para detecção de frequência fundamental (pitch).
- **Uso**: Implementação de algoritmos como YIN, AMDF para detecção precisa de tom
- **Link**: [GitHub - Pitchfinder](https://github.com/peterkhayes/pitchfinder)
- **Instalação**: `npm install pitchfinder`
- **Exemplo**:
```javascript
import { YIN } from "pitchfinder";
const detectPitch = YIN({ sampleRate: audioContext.sampleRate });
const pitch = detectPitch(audioData);
```

### Tonal.js
Biblioteca de teoria musical para JavaScript.
- **Uso**: Conversão entre frequências (Hz) e notas musicais, análise de tom
- **Link**: [GitHub - Tonal](https://github.com/tonaljs/tonal)
- **Instalação**: `npm install @tonaljs/tonal`
- **Exemplo**:
```javascript
import { Note, Distance } from "@tonaljs/tonal";
const noteName = Note.fromFreq(440); // "A4"
const distance = Distance.semitones("C4", "E4"); // 4
```

### ML5.js - PitchDetection
Implementação de detecção de pitch baseada em machine learning.
- **Uso**: Detecção de pitch mais precisa usando modelos pré-treinados
- **Link**: [ML5.js - PitchDetection](https://learn.ml5js.org/#/reference/pitch-detection)
- **Instalação**: `npm install ml5`
- **Exemplo**:
```javascript
const pitchDetection = ml5.pitchDetection(
  '/models/crepe', 
  audioContext, 
  microphoneStream, 
  modelLoaded
);
```

## 🎬 Visualização e Renderização

### Canvas API
API nativa para desenho 2D no navegador.
- **Uso**: Renderização de notas, visualização da "esteira" de notas
- **Link**: [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### D3.js
Biblioteca para visualização de dados.
- **Uso**: Criação de gráficos de performance, heatmaps de precisão
- **Link**: [D3.js](https://d3js.org/)
- **Instalação**: `npm install d3`

### Wavesurfer.js
Biblioteca para visualização de formas de onda de áudio.
- **Uso**: Exibição visual do áudio, marcação de tempo
- **Link**: [Wavesurfer.js](https://wavesurfer-js.org/)
- **Instalação**: `npm install wavesurfer.js`
- **Exemplo**:
```javascript
const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
});
wavesurfer.load('song.mp3');
```

## 🎮 Interface de Usuário

### Framer Motion
Biblioteca para animações em React.
- **Uso**: Transições suaves, efeitos visuais, feedback de interação
- **Link**: [Framer Motion](https://www.framer.com/motion/)
- **Instalação**: `npm install framer-motion`

### TailwindCSS
Framework CSS utilitário.
- **Uso**: Estilização consistente, tema escuro, responsividade
- **Link**: [TailwindCSS](https://tailwindcss.com/)
- **Instalação**: `npm install tailwindcss postcss autoprefixer`

### Headless UI
Componentes acessíveis e sem estilo pré-definido.
- **Uso**: Elementos de UI complexos como selects, modais, dropdowns
- **Link**: [Headless UI](https://headlessui.dev/)
- **Instalação**: `npm install @headlessui/react`

## 🔄 Sincronização e Letras

### LRC Parser
Biblioteca para parsing de arquivos LRC (formato de letras sincronizadas).
- **Uso**: Importação e processamento de letras com marcação de tempo
- **Link**: [GitHub - lrc-parser](https://github.com/chenqing/lrc-parser)
- **Instalação**: `npm install lrc-parser`
- **Exemplo**:
```javascript
import LRCParser from 'lrc-parser';
const lrc = LRCParser.parse(lrcString);
```

### Subtitle.js
Biblioteca para manipulação de legendas/letras sincronizadas.
- **Uso**: Processamento de formatos de letras como SRT, WebVTT
- **Link**: [GitHub - subtitle.js](https://github.com/gsantiago/subtitle.js)
- **Instalação**: `npm install subtitle`

## 📊 Backend e Banco de Dados

### Mongoose
ODM para MongoDB.
- **Uso**: Modelagem de dados, queries, validação
- **Link**: [Mongoose](https://mongoosejs.com/)
- **Instalação**: `npm install mongoose`

### Express.js
Framework web para Node.js.
- **Uso**: Criação de API RESTful, roteamento
- **Link**: [Express.js](https://expressjs.com/)
- **Instalação**: `npm install express`

### JWT
Tokens para autenticação.
- **Uso**: Autenticação segura de usuários
- **Link**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- **Instalação**: `npm install jsonwebtoken`

## 🧪 Testes

### Jest
Framework de testes para JavaScript.
- **Uso**: Testes unitários e de integração
- **Link**: [Jest](https://jestjs.io/)
- **Instalação**: `npm install --save-dev jest`

### React Testing Library
Biblioteca para testar componentes React.
- **Uso**: Testes de componentes de UI
- **Link**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Instalação**: `npm install --save-dev @testing-library/react`

## 🎤 Recursos de Áudio

### Instrumental Tracks
Músicas sem vocais para karaokê.
- **Uso**: Faixas de fundo para o jogo
- **Fontes**:
  - [Karaoke Version](https://www.karaoke-version.com/)
  - [Instrumental MP3](https://www.instrumentalmp3.com/)
  - [Karaoke Nerds](https://karaokenerds.com/)

### Sound Effects
Efeitos sonoros para feedback e interação.
- **Uso**: Feedback de acertos, erros, conquistas
- **Fontes**:
  - [Freesound](https://freesound.org/)
  - [ZapSplat](https://www.zapsplat.com/)
  - [Soundsnap](https://www.soundsnap.com/)

## 🛠️ Ferramentas de Desenvolvimento

### Vercel
Plataforma para deploy de aplicações Next.js.
- **Uso**: Hospedagem do frontend
- **Link**: [Vercel](https://vercel.com/)

### MongoDB Atlas
Serviço de banco de dados MongoDB na nuvem.
- **Uso**: Hospedagem do banco de dados
- **Link**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### GitHub Actions
CI/CD para automação de testes e deploy.
- **Uso**: Automação de processos de desenvolvimento
- **Link**: [GitHub Actions](https://github.com/features/actions)

---

Esta lista não é exaustiva e pode ser atualizada durante o desenvolvimento do projeto conforme novas necessidades surjam ou melhores alternativas sejam identificadas. 