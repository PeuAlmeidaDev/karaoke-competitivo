# 🎵 Sistema de Análise de Áudio e Pontuação

Este documento técnico detalha o funcionamento do sistema de análise de áudio e cálculo de pontuação para o projeto de Karaokê Competitivo.

## 📊 Visão Geral

O sistema captura áudio do microfone do jogador, analisa o tom (pitch) e o tempo (timing) em relação às notas esperadas, e calcula uma pontuação baseada na precisão. Todo este processo acontece em tempo real, fornecendo feedback visual imediato.

## 🎤 Captura e Análise de Áudio

### Captura de Áudio

Utilizamos a Web Audio API para capturar o áudio do microfone do usuário:

```typescript
// Exemplo simplificado de captura de áudio
async function setupAudioCapture() {
  // Solicitar acesso ao microfone
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  // Criar contexto de áudio
  const audioContext = new AudioContext();
  
  // Criar source node a partir do stream do microfone
  const microphone = audioContext.createMediaStreamSource(stream);
  
  // Criar analisador para processamento
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  
  // Conectar microfone ao analisador
  microphone.connect(analyser);
  
  return { audioContext, analyser, stream };
}
```

### Detecção de Pitch (Tom)

Para detectar o tom (pitch) da voz do usuário, utilizamos algoritmos especializados:

1. **Algoritmo YIN** - Um algoritmo confiável para detecção de tom em sinais de áudio monofônicos (como voz):

```typescript
// Implementação simplificada do algoritmo YIN para detecção de pitch
function detectPitch(analyser) {
  const bufferLength = analyser.fftSize;
  const dataArray = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(dataArray);
  
  // Aplicação do algoritmo YIN
  const result = YIN(dataArray, audioContext.sampleRate);
  
  return {
    pitch: result.pitch,      // Frequência fundamental em Hz
    clarity: result.clarity,  // Clareza/confiança da detecção (0-1)
  };
}
```

2. **Conversão para Notação Musical** - Convertemos a frequência (Hz) para notação musical:

```typescript
function frequencyToNote(frequency) {
  // A4 = 440Hz
  const noteNumber = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const octave = Math.floor(noteNumber / 12) - 1;
  const noteName = noteNames[Math.round(noteNumber) % 12];
  
  return {
    name: noteName + octave, // Ex: "A4"
    number: noteNumber,
    centsOffset: (noteNumber - Math.round(noteNumber)) * 100 // Cents off from perfect pitch
  };
}
```

### Análise de Tempo (Timing)

Para determinar a precisão do tempo, comparamos o momento em que o usuário canta com o momento esperado para a nota:

```typescript
function analyzeTiming(detectedNoteTime, expectedNoteTime) {
  const difference = detectedNoteTime - expectedNoteTime;
  
  // Valor em ms de diferença (positivo = atrasado, negativo = adiantado)
  return {
    difference,
    // Normalizar para uma pontuação de timing (0-100)
    score: Math.max(0, 100 - Math.min(100, Math.abs(difference) / 150 * 100))
  };
}
```

## 🎯 Sistema de Pontuação

### Pontuação de Nota Individual

Para cada nota, calculamos uma pontuação baseada em:

1. **Precisão de Tom (Pitch Accuracy)** - Quão próximo o tom cantado está do tom esperado
2. **Precisão de Tempo (Timing Accuracy)** - Quão próximo o tempo está do esperado
3. **Duração da Nota (Duration Accuracy)** - Se o usuário manteve a nota pelo tempo correto

```typescript
function calculateNoteScore(detectedPitch, expectedPitch, timingDifference, durationRatio) {
  // Calcular diferença de pitch em cents (100 cents = 1 semitom)
  const pitchDifference = Math.abs(
    (12 * Math.log2(detectedPitch / expectedPitch)) * 100
  );
  
  // Pontuação de pitch (máximo de 50 pontos)
  // Uma diferença de 50 cents ou mais resulta em 0 pontos
  const pitchScore = Math.max(0, 50 - (pitchDifference / 50 * 50));
  
  // Pontuação de timing (máximo de 30 pontos)
  // Uma diferença de 150ms ou mais resulta em 0 pontos
  const timingScore = Math.max(0, 30 - (Math.abs(timingDifference) / 150 * 30));
  
  // Pontuação de duração (máximo de 20 pontos)
  const durationScore = Math.max(0, 20 * durationRatio);
  
  // Pontuação total para a nota (0-100)
  const totalScore = pitchScore + timingScore + durationScore;
  
  // Determinação se a nota foi "acertada" (pontuação mínima de 60)
  const isHit = totalScore >= 60;
  
  return {
    score: totalScore,
    pitchScore,
    timingScore,
    durationScore,
    pitchDifference,
    timingDifference,
    isHit,
    points: Math.round(totalScore * (isHit ? 1 : 0.2)) // Pontos baseados na pontuação
  };
}
```

### Cálculo de Streak (Sequência)

Rastreamos sequências de acertos consecutivos para adicionar multiplicadores:

```typescript
function updateStreak(wasHit, currentStreak) {
  if (wasHit) {
    return currentStreak + 1;
  } else {
    return 0; // Reiniciar streak em caso de erro
  }
}

function getStreakMultiplier(streak) {
  // Exemplo de multiplicador baseado na sequência
  if (streak >= 50) return 4;     // 4x para 50+ acertos
  else if (streak >= 30) return 3; // 3x para 30+ acertos
  else if (streak >= 15) return 2; // 2x para 15+ acertos
  else if (streak >= 8) return 1.5; // 1.5x para 8+ acertos
  else return 1;                   // Sem multiplicador para menos de 8 acertos
}
```

### Pontuação Total

A pontuação total combina todos os elementos acima:

```typescript
function calculateTotalScore(noteScores, streaks) {
  let totalPoints = 0;
  let totalNotes = noteScores.length;
  let hits = 0;
  let maxStreak = 0;
  
  // Calcular estatísticas
  noteScores.forEach((score, index) => {
    const multiplier = getStreakMultiplier(streaks[index]);
    totalPoints += score.points * multiplier;
    
    if (score.isHit) hits++;
    maxStreak = Math.max(maxStreak, streaks[index]);
  });
  
  return {
    score: totalPoints,
    accuracy: (hits / totalNotes) * 100,
    hits,
    misses: totalNotes - hits,
    maxStreak
  };
}
```

## 📱 Feedback Visual em Tempo Real

### Representação da Precisão de Tom

Oferecemos feedback visual indicando se o usuário deve cantar mais agudo ou mais grave:

```typescript
function getPitchFeedback(detectedPitch, expectedPitch) {
  const ratio = detectedPitch / expectedPitch;
  
  if (ratio > 1.05) {
    return "TOO_HIGH"; // Cantar mais grave
  } else if (ratio < 0.95) {
    return "TOO_LOW";  // Cantar mais agudo
  } else {
    return "GOOD";     // Tom correto
  }
}
```

### Visualização de Notas Estilo Yousician

Para criar uma visualização de notas semelhante ao Yousician:

```typescript
// Exemplo simplificado da função de renderização
function renderNotes(canvas, currentTime, visibleTimeWindow, notes) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Calcular janela de tempo visível
  const startTime = currentTime;
  const endTime = currentTime + visibleTimeWindow;
  
  // Filtrar notas visíveis na janela de tempo atual
  const visibleNotes = notes.filter(note => 
    (note.startTime < endTime && note.startTime + note.duration > startTime)
  );
  
  // Desenhar cada nota visível
  visibleNotes.forEach(note => {
    // Calcular posição x baseada no tempo
    const x = width - ((note.startTime - startTime) / visibleTimeWindow) * width;
    
    // Calcular posição y baseada no pitch (mais agudo = mais alto)
    const pitchValue = convertNoteToNumber(note.pitch);
    const y = height - ((pitchValue - lowestPitch) / pitchRange) * height;
    
    // Calcular largura baseada na duração
    const noteWidth = (note.duration / visibleTimeWindow) * width;
    
    // Desenhar retângulo representando a nota
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(x, y - 10, noteWidth, 20);
    
    // Adicionar texto da letra
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText(note.lyricSegment, x, y + 20);
  });
}
```

## 🔄 Fluxo de Processo Completo

1. **Inicialização**:
   - Carregar dados da música (letras, notas, áudio)
   - Configurar captura de áudio
   - Preparar visualizações

2. **Durante o jogo**:
   - Reproduzir música instrumental
   - Capturar e analisar áudio do microfone em tempo real
   - Detecção contínua de tom (pitch)
   - Comparação com notas esperadas no momento atual
   - Cálculo e exibição de pontuação em tempo real
   - Atualização do feedback visual

3. **Finalização**:
   - Calcular pontuação final e estatísticas
   - Determinar posição no ranking
   - Salvar resultados
   - Exibir tela de resultados

## 🧠 Algoritmos Avançados

### Melhorias na Detecção de Pitch

Para aumentar a precisão, combinamos múltiplos algoritmos:

```typescript
function enhancedPitchDetection(audioData, sampleRate) {
  // Executar algoritmo primário (YIN)
  const yinResult = YIN(audioData, sampleRate);
  
  // Verificar confiança do resultado
  if (yinResult.clarity > 0.8) {
    return yinResult;
  }
  
  // Tentar com algoritmo secundário (AMDF)
  const amdfResult = AMDF(audioData, sampleRate);
  
  // Verificar confiança do resultado secundário
  if (amdfResult.clarity > yinResult.clarity) {
    return amdfResult;
  }
  
  // Usar resultado primário como fallback
  return yinResult;
}
```

### Compensação de Latência

Para lidar com a latência do sistema:

```typescript
function compensateLatency(detectedTime, systemLatency) {
  // Ajustar o tempo detectado subtraindo a latência estimada do sistema
  return detectedTime - systemLatency;
}
```

## 📊 Visualização de Performance

Após o término da música, exibimos estatísticas detalhadas:

```typescript
function renderPerformanceStats(stats, canvas) {
  // Exibir gráfico de precisão por nota
  const pitchData = stats.noteScores.map(note => note.pitchDifference);
  const timingData = stats.noteScores.map(note => note.timingDifference);
  
  // Criar gráfico de precisão de pitch ao longo do tempo
  renderLineChart(canvas, pitchData, {
    title: 'Precisão de Tom',
    xLabel: 'Notas',
    yLabel: 'Diferença (cents)',
    idealValue: 0
  });
  
  // Estatísticas adicionais
  const accuracyBySection = calculateAccuracyBySection(stats);
  renderBarChart(sectionCanvas, accuracyBySection);
}
```

## 🚀 Considerações de Performance

### Otimização da Captura de Áudio

Para melhorar a performance, principalmente em dispositivos mais lentos:

```typescript
function optimizeAudioProcessing(analyser) {
  // Reduzir tamanho da FFT em dispositivos mais lentos
  if (isLowEndDevice()) {
    analyser.fftSize = 1024; // Em vez de 2048
  }
  
  // Ajustar intervalo de análise
  const analysisInterval = isLowEndDevice() ? 50 : 30; // ms
  
  // Usar Web Workers para processamento em thread separada
  const worker = new Worker('audio-processing.js');
  
  // Configurar comunicação com worker
  worker.onmessage = (e) => handlePitchData(e.data);
  
  // Setup interval for sending data to worker
  setInterval(() => {
    const dataArray = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(dataArray);
    worker.postMessage({ 
      command: 'process', 
      data: dataArray, 
      sampleRate: audioContext.sampleRate 
    });
  }, analysisInterval);
}
```

### Renderização Eficiente

Para manter altas taxas de quadros na visualização:

```typescript
function optimizeRendering(canvas) {
  // Usar requestAnimationFrame para sincronizar com a taxa de atualização da tela
  let lastRenderTime = 0;
  
  function render(timestamp) {
    // Limitar taxa de atualização em dispositivos mais lentos
    if (isLowEndDevice() && timestamp - lastRenderTime < 32) {
      requestAnimationFrame(render);
      return;
    }
    
    // Renderizar visualização
    renderNotes(canvas, currentTime, visibleTimeWindow, notes);
    
    lastRenderTime = timestamp;
    requestAnimationFrame(render);
  }
  
  requestAnimationFrame(render);
}
```

## 📱 Compatibilidade com Dispositivos

Para garantir que o sistema funcione em uma ampla gama de dispositivos:

```typescript
function setupDeviceCompatibility() {
  // Verificar suporte a getUserMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      supported: false,
      reason: 'MICROPHONE_ACCESS_NOT_SUPPORTED'
    };
  }
  
  // Verificar suporte a AudioContext
  if (!window.AudioContext && !window.webkitAudioContext) {
    return {
      supported: false,
      reason: 'AUDIO_PROCESSING_NOT_SUPPORTED'
    };
  }
  
  // Ajustar configurações com base na capacidade do dispositivo
  const devicePerformance = estimateDevicePerformance();
  
  return {
    supported: true,
    performanceLevel: devicePerformance,
    recommendedSettings: getOptimalSettings(devicePerformance)
  };
}
```

---

Este documento serve como referência técnica para a implementação do sistema de análise de áudio e pontuação do projeto Karaokê Competitivo. Os algoritmos e abordagens podem ser refinados durante o desenvolvimento para otimizar a precisão e performance. 