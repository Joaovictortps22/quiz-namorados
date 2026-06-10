/* ============================================================
   QUIZ DATA — 8 perguntas
   image: { quiz, original }
     - quiz     = imagem exibida durante o quiz (desfocada/zoom)
     - original = imagem exibida na revisão (nítida)
   correct = índice (0-based) da alternativa correta
   ============================================================ */
window.QUIZ = [
  {
    id: 1,
    text: "Quem enviou a primeira mensagem?",
    image: null,
    options: ["João", "Rafaela"],
    correct: 0
  },
  {
    id: 2,
    text: "Onde esta foto foi registrada?",
    hint: "Olha com carinho... 👀",
    image: {
      quiz: "fotos casal para o quiz/casa do seco - desfocado.png",
      original: "fotos casal/casa do seco.PNG"
    },
    options: ["Zé Bolacha", "Shopping", "Casa do Seco"],
    correct: 2
  },
  {
    id: 3,
    text: "Qual é o passatempo favorito do nosso casal?",
    image: null,
    options: [
      "Organizar e preparar nossos próprios eventos",
      "Ir ao cinema no shopping",
      "Assistir a shows sertanejos"
    ],
    correct: 0
  },
  {
    id: 4,
    text: "Em qual ocasião esta foto foi tirada?",
    hint: "Um dia bem especial 💗",
    image: {
      quiz: "fotos casal para o quiz/cha de bebe da Ani - desfocado.png",
      original: "fotos casal/cha de bebe da Ani.JPG"
    },
    options: [
      "Arraial do Tio Léo",
      "Chá de Bebê da Ani",
      "Aniversário do Paulo Henrique"
    ],
    correct: 1
  },
  {
    id: 5,
    text: "Qual destes representa melhor nossos planos para o futuro?",
    image: null,
    options: [
      "Casar e viajar com os filhos",
      "Passar longas temporadas morando em outros lugares",
      "Trabalhar muito e apenas trabalhar"
    ],
    correct: 0
  },
  {
    id: 6,
    text: "Qual é o local desta foto?",
    hint: "Ladeiras e história ⛪",
    image: {
      quiz: "fotos casal para o quiz/ouro preto - desfocado.png",
      original: "fotos casal/ouro preto.JPG"
    },
    options: ["Coluna", "Ouro Preto", "Arraial do Cabo"],
    correct: 1
  },
  {
    id: 7,
    text: "Em que data comemoramos nosso aniversário de namoro?",
    image: null,
    options: ["01 de setembro", "08 de outubro", "01 de março"],
    correct: 1
  },
  {
    id: 8,
    text: "Onde esta foto foi tirada?",
    hint: "Zoom extremo... duro de adivinhar 😏",
    image: {
      quiz: "fotos casal para o quiz/sabinopolis - zoom extremo.png",
      original: "fotos casal/sabinopolis.JPG"
    },
    options: ["Sabinópolis", "Ouro Preto", "Coluna"],
    correct: 0
  }
];
