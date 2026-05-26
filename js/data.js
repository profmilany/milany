// Banco de dados local da plataforma. Manter os conteúdos aqui facilita a publicação no GitHub Pages.
(function () {
  const bncc = "EM13MAT302, EM13MAT401, EM13MAT405 e competências de resolução de problemas, argumentação e uso de tecnologias digitais.";

  function sequence(topic, focus) {
    return {
      objetivo: `Compreender ${focus} por meio de problemas, representações e jogo didático.`,
      bncc,
      metodologia: "Aprendizagem baseada em desafios, discussão em duplas, mediação docente e feedback imediato.",
      recursos: "Quadro, celular ou computador, projetor, calculadora quando necessário e jogo digital da plataforma.",
      etapas: [
        `Problematização inicial sobre ${topic}.`,
        "Exploração orientada dos conceitos e exemplos.",
        "Resolução colaborativa de exercícios.",
        "Jogo didático com pontuação e feedback.",
        "Socialização das estratégias utilizadas."
      ],
      avaliacao: "Observação da participação, registro das respostas, desempenho no jogo e explicação oral ou escrita das estratégias.",
      complementares: "Criar uma nova questão para o jogo, pesquisar aplicação cotidiana e resolver uma situação-problema contextualizada."
    };
  }

  window.PROFMILANY_DATA = {
    achievements: [
      { id: "first-game", label: "Primeiro jogo" },
      { id: "score-100", label: "100 pontos" },
      { id: "five-games", label: "5 jogos" },
      { id: "all-topics", label: "Trilha completa" }
    ],
    years: {
      1: [
        {
          id: "funcao-1-grau",
          title: "Função do 1º grau",
          badge: "Quiz interativo",
          gameType: "quiz",
          explanation: "Funções do 1º grau têm forma f(x)=ax+b, com gráfico em reta e taxa de variação constante.",
          sequence: sequence("função do 1º grau", "coeficiente angular, coeficiente linear e interpretação gráfica"),
          questions: [
            { prompt: "Na função f(x)=2x+3, qual é o valor de f(4)?", options: ["8", "11", "14", "5"], answer: "11", feedback: "f(4)=2·4+3=11." },
            { prompt: "O coeficiente angular de y=-3x+7 é:", options: ["7", "-3", "3", "-7"], answer: "-3", feedback: "O coeficiente angular é o número que multiplica x." },
            { prompt: "A raiz da função f(x)=x-9 é:", options: ["-9", "0", "9", "1"], answer: "9", feedback: "A raiz ocorre quando x-9=0." }
          ]
        },
        {
          id: "funcao-2-grau",
          title: "Função do 2º grau",
          badge: "Batalha matemática",
          gameType: "battle",
          explanation: "Funções quadráticas têm forma f(x)=ax²+bx+c e gráfico em parábola.",
          sequence: sequence("função do 2º grau", "raízes, vértice, concavidade e análise da parábola"),
          questions: [
            { prompt: "A parábola y=x²-4 tem raízes:", options: ["-2 e 2", "0 e 4", "-4 e 1", "2 e 4"], answer: "-2 e 2", feedback: "x²-4=0, então x=±2." },
            { prompt: "Se a>0 em ax²+bx+c, a concavidade é:", options: ["Para baixo", "Para cima", "Horizontal", "Indefinida"], answer: "Para cima", feedback: "Coeficiente a positivo abre a parábola para cima." },
            { prompt: "O valor de Δ em x²-5x+6 é:", options: ["1", "24", "25", "49"], answer: "1", feedback: "Δ=b²-4ac=25-24=1." }
          ]
        },
        {
          id: "conjuntos",
          title: "Conjuntos",
          badge: "Arrastar e soltar",
          gameType: "drag",
          explanation: "Conjuntos organizam elementos e permitem estudar união, interseção, diferença e pertinência.",
          sequence: sequence("conjuntos", "operações entre conjuntos e representação por diagramas"),
          pairs: [
            { item: "A ∪ B", target: "União dos elementos de A e B" },
            { item: "A ∩ B", target: "Elementos comuns a A e B" },
            { item: "x ∈ A", target: "x pertence ao conjunto A" },
            { item: "A - B", target: "Elementos de A que não estão em B" }
          ]
        },
        {
          id: "pa",
          title: "Progressão aritmética",
          badge: "Missões",
          gameType: "mission",
          explanation: "Na PA, cada termo é obtido somando uma razão constante ao termo anterior.",
          sequence: sequence("progressão aritmética", "razão, termo geral e soma dos termos"),
          questions: [
            { prompt: "Na PA (3, 7, 11, ...), a razão é:", options: ["3", "4", "7", "11"], answer: "4", feedback: "A diferença entre termos consecutivos é 4." },
            { prompt: "O 5º termo da PA com a1=2 e r=3 é:", options: ["11", "12", "14", "17"], answer: "14", feedback: "a5=2+(5-1)·3=14." },
            { prompt: "A soma dos 4 primeiros termos de (2,4,6,8,...) é:", options: ["12", "18", "20", "24"], answer: "20", feedback: "2+4+6+8=20." }
          ]
        },
        {
          id: "pg",
          title: "Progressão geométrica",
          badge: "Memória matemática",
          gameType: "memory",
          explanation: "Na PG, cada termo é obtido multiplicando o anterior por uma razão constante.",
          sequence: sequence("progressão geométrica", "razão, termo geral e crescimento exponencial"),
          pairs: [
            { a: "2, 6, 18", b: "q=3" },
            { a: "5, 10, 20", b: "q=2" },
            { a: "81, 27, 9", b: "q=1/3" },
            { a: "aₙ=a₁·qⁿ⁻¹", b: "Termo geral" }
          ]
        },
        {
          id: "geometria-plana",
          title: "Geometria plana",
          badge: "Verdadeiro ou falso",
          gameType: "truefalse",
          explanation: "A geometria plana estuda figuras bidimensionais, perímetro, área, ângulos e relações métricas.",
          sequence: sequence("geometria plana", "cálculo de áreas e propriedades de figuras planas"),
          questions: [
            { prompt: "A área de um retângulo é base vezes altura.", answer: true, feedback: "Correto: A=b·h." },
            { prompt: "Todo losango possui quatro ângulos retos.", answer: false, feedback: "Isso é sempre verdadeiro para o quadrado, não para todo losango." },
            { prompt: "A soma dos ângulos internos de um triângulo é 180°.", answer: true, feedback: "Essa é uma propriedade fundamental dos triângulos." }
          ]
        },
        {
          id: "trigonometria-basica",
          title: "Trigonometria básica",
          badge: "Plataforma canvas",
          gameType: "canvas",
          explanation: "A trigonometria relaciona ângulos e lados de triângulos retângulos por seno, cosseno e tangente.",
          sequence: sequence("trigonometria básica", "razões trigonométricas no triângulo retângulo"),
          questions: [
            { prompt: "Em um triângulo retângulo, sen(θ) é:", options: ["cateto oposto / hipotenusa", "cateto adjacente / hipotenusa", "oposto / adjacente", "hipotenusa / oposto"], answer: "cateto oposto / hipotenusa", feedback: "Seno relaciona cateto oposto e hipotenusa." },
            { prompt: "Se cateto oposto=3 e hipotenusa=5, sen(θ) vale:", options: ["3/5", "4/5", "5/3", "3/4"], answer: "3/5", feedback: "sen(θ)=3/5." }
          ]
        }
      ],
      2: [
        {
          id: "analise-combinatoria",
          title: "Análise combinatória",
          badge: "Missões",
          gameType: "mission",
          explanation: "A análise combinatória calcula possibilidades de escolha, organização e agrupamento.",
          sequence: sequence("análise combinatória", "princípio multiplicativo, arranjos, permutações e combinações"),
          questions: [
            { prompt: "Com 3 camisas e 2 calças, quantos looks são possíveis?", options: ["5", "6", "8", "9"], answer: "6", feedback: "Pelo princípio multiplicativo: 3·2=6." },
            { prompt: "Quantas permutações existem para as letras A, B e C?", options: ["3", "4", "6", "9"], answer: "6", feedback: "3!=6." },
            { prompt: "Em combinação, a ordem importa?", options: ["Sim", "Não", "Sempre", "Somente com números"], answer: "Não", feedback: "Combinações agrupam sem considerar ordem." }
          ]
        },
        {
          id: "probabilidade",
          title: "Probabilidade",
          badge: "Quiz interativo",
          gameType: "quiz",
          explanation: "Probabilidade mede a chance de ocorrência de eventos em um espaço amostral.",
          sequence: sequence("probabilidade", "espaço amostral, evento e cálculo de chances"),
          questions: [
            { prompt: "Ao lançar um dado honesto, a probabilidade de sair número par é:", options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/2", feedback: "Há 3 pares em 6 resultados possíveis." },
            { prompt: "A probabilidade de evento certo é:", options: ["0", "1", "1/2", "100"], answer: "1", feedback: "Evento certo tem probabilidade 1 ou 100%." },
            { prompt: "Em uma moeda honesta, P(cara) é:", options: ["1/4", "1/2", "1", "2"], answer: "1/2", feedback: "São dois resultados igualmente prováveis." }
          ]
        },
        {
          id: "matrizes",
          title: "Matrizes",
          badge: "Arrastar e soltar",
          gameType: "drag",
          explanation: "Matrizes organizam números em linhas e colunas, permitindo representar dados e transformações.",
          sequence: sequence("matrizes", "ordem, elementos, soma e produto por escalar"),
          pairs: [
            { item: "2 x 3", target: "2 linhas e 3 colunas" },
            { item: "a₂₁", target: "Elemento da 2ª linha e 1ª coluna" },
            { item: "Matriz quadrada", target: "Mesmo número de linhas e colunas" },
            { item: "Matriz identidade", target: "Diagonal principal igual a 1" }
          ]
        },
        {
          id: "determinantes",
          title: "Determinantes",
          badge: "Verdadeiro ou falso",
          gameType: "truefalse",
          explanation: "Determinantes associam um número a matrizes quadradas e ajudam a resolver sistemas lineares.",
          sequence: sequence("determinantes", "cálculo de determinantes de ordem 2 e 3"),
          questions: [
            { prompt: "Só existe determinante para matriz quadrada.", answer: true, feedback: "Determinante é definido para matrizes quadradas." },
            { prompt: "O determinante de [[a,b],[c,d]] é ad-bc.", answer: true, feedback: "Essa é a regra para matriz 2x2." },
            { prompt: "Se duas linhas são iguais, o determinante sempre é 1.", answer: false, feedback: "Nesse caso, o determinante é 0." }
          ]
        },
        {
          id: "sistemas-lineares",
          title: "Sistemas lineares",
          badge: "Batalha matemática",
          gameType: "battle",
          explanation: "Sistemas lineares reúnem equações com incógnitas e podem ter uma, nenhuma ou infinitas soluções.",
          sequence: sequence("sistemas lineares", "resolução por substituição, adição e interpretação geométrica"),
          questions: [
            { prompt: "No sistema x+y=5 e x-y=1, o valor de x é:", options: ["1", "2", "3", "4"], answer: "3", feedback: "Somando as equações: 2x=6." },
            { prompt: "Duas retas paralelas distintas representam sistema:", options: ["Possível determinado", "Possível indeterminado", "Impossível", "Não linear"], answer: "Impossível", feedback: "Retas paralelas distintas não se encontram." },
            { prompt: "Método que isola uma incógnita em uma equação:", options: ["Substituição", "Fatoração", "Derivação", "Radiciação"], answer: "Substituição", feedback: "Depois de isolar, substitui-se na outra equação." }
          ]
        },
        {
          id: "geometria-espacial",
          title: "Geometria espacial",
          badge: "Memória matemática",
          gameType: "memory",
          explanation: "A geometria espacial estuda sólidos, volumes, áreas e relações no espaço tridimensional.",
          sequence: sequence("geometria espacial", "volume e área de prismas, cilindros, cones e esferas"),
          pairs: [
            { a: "Cubo", b: "V=a³" },
            { a: "Prisma", b: "V=Ab·h" },
            { a: "Cilindro", b: "V=πr²h" },
            { a: "Esfera", b: "V=4πr³/3" }
          ]
        },
        {
          id: "logaritmos",
          title: "Logaritmos",
          badge: "Escape matemático",
          gameType: "escape",
          explanation: "Logaritmos respondem a expoente necessário para obter um número a partir de uma base.",
          sequence: sequence("logaritmos", "definição, propriedades e mudança de representação"),
          questions: [
            { prompt: "log₂(8) vale:", options: ["2", "3", "4", "8"], answer: "3", feedback: "2³=8." },
            { prompt: "log₁₀(100) vale:", options: ["1", "2", "10", "100"], answer: "2", feedback: "10²=100." },
            { prompt: "log₃(1) vale:", options: ["0", "1", "3", "-1"], answer: "0", feedback: "Toda base não nula elevada a 0 resulta em 1." }
          ]
        }
      ],
      3: [
        {
          id: "geometria-analitica",
          title: "Geometria analítica",
          badge: "Quiz interativo",
          gameType: "quiz",
          explanation: "A geometria analítica usa coordenadas para estudar pontos, retas, distâncias e circunferências.",
          sequence: sequence("geometria analítica", "distância entre pontos, ponto médio e equação da reta"),
          questions: [
            { prompt: "A distância entre (0,0) e (3,4) é:", options: ["3", "4", "5", "7"], answer: "5", feedback: "Pelo teorema de Pitágoras: √(3²+4²)=5." },
            { prompt: "O ponto médio de A(2,4) e B(6,8) é:", options: ["(4,6)", "(8,12)", "(2,6)", "(6,4)"], answer: "(4,6)", feedback: "Média das coordenadas: ((2+6)/2,(4+8)/2)." },
            { prompt: "Na reta y=2x+1, o coeficiente angular é:", options: ["1", "2", "3", "-2"], answer: "2", feedback: "É o coeficiente que multiplica x." }
          ]
        },
        {
          id: "estatistica",
          title: "Estatística",
          badge: "Arrastar e soltar",
          gameType: "drag",
          explanation: "A estatística organiza, interpreta e comunica dados por medidas e representações.",
          sequence: sequence("estatística", "média, mediana, moda e leitura de dados"),
          pairs: [
            { item: "Média", target: "Soma dos valores dividida pela quantidade" },
            { item: "Mediana", target: "Valor central dos dados ordenados" },
            { item: "Moda", target: "Valor que mais se repete" },
            { item: "Amplitude", target: "Maior valor menos menor valor" }
          ]
        },
        {
          id: "matematica-financeira",
          title: "Matemática financeira",
          badge: "Missões",
          gameType: "mission",
          explanation: "A matemática financeira estuda juros, descontos, porcentagens e planejamento financeiro.",
          sequence: sequence("matemática financeira", "juros simples, juros compostos e porcentagem"),
          questions: [
            { prompt: "10% de 200 é:", options: ["2", "10", "20", "40"], answer: "20", feedback: "200·0,10=20." },
            { prompt: "Juros simples: C=100, i=2% ao mês, t=3 meses. Juros:", options: ["R$ 2", "R$ 3", "R$ 6", "R$ 106"], answer: "R$ 6", feedback: "J=C·i·t=100·0,02·3=6." },
            { prompt: "Acréscimo de 20% corresponde a multiplicar por:", options: ["0,8", "1,2", "2,0", "20"], answer: "1,2", feedback: "Valor final = valor inicial · 1,20." }
          ]
        },
        {
          id: "funcoes-exponenciais",
          title: "Funções exponenciais",
          badge: "Canvas",
          gameType: "canvas",
          explanation: "Funções exponenciais modelam crescimentos ou decaimentos em que a variável está no expoente.",
          sequence: sequence("funções exponenciais", "crescimento, decaimento e interpretação de gráficos"),
          questions: [
            { prompt: "Em f(x)=2ˣ, f(3) é:", options: ["6", "8", "9", "12"], answer: "8", feedback: "2³=8." },
            { prompt: "Se 0<a<1 em f(x)=aˣ, a função é:", options: ["Crescente", "Decrescente", "Constante", "Linear"], answer: "Decrescente", feedback: "Bases entre 0 e 1 geram decaimento." }
          ]
        },
        {
          id: "funcoes-logaritmicas",
          title: "Funções logarítmicas",
          badge: "Escape matemático",
          gameType: "escape",
          explanation: "Funções logarítmicas são inversas das exponenciais e ajudam a resolver problemas com escalas e crescimento.",
          sequence: sequence("funções logarítmicas", "domínio, base e relação inversa com exponenciais"),
          questions: [
            { prompt: "O domínio de f(x)=log(x) é:", options: ["x>0", "x≥0", "todos os reais", "x<0"], answer: "x>0", feedback: "Logaritmo real exige argumento positivo." },
            { prompt: "A inversa de y=2ˣ é:", options: ["y=log₂(x)", "y=x²", "y=2x", "y=x/2"], answer: "y=log₂(x)", feedback: "Logaritmo de base 2 desfaz a potência de base 2." },
            { prompt: "log₅(25) vale:", options: ["2", "3", "5", "25"], answer: "2", feedback: "5²=25." }
          ]
        },
        {
          id: "polinomios",
          title: "Polinômios",
          badge: "Verdadeiro ou falso",
          gameType: "truefalse",
          explanation: "Polinômios combinam coeficientes e potências naturais da variável, permitindo modelar diversas situações.",
          sequence: sequence("polinômios", "grau, raízes, operações e fatoração"),
          questions: [
            { prompt: "O grau de P(x)=3x³+2x-1 é 3.", answer: true, feedback: "O maior expoente é 3." },
            { prompt: "P(x)=x²-4 pode ser fatorado como (x-2)(x+2).", answer: true, feedback: "É diferença de quadrados." },
            { prompt: "Todo polinômio do 1º grau tem gráfico em parábola.", answer: false, feedback: "Polinômio do 1º grau tem gráfico em reta." }
          ]
        },
        {
          id: "numeros-complexos",
          title: "Números complexos",
          badge: "Memória matemática",
          gameType: "memory",
          explanation: "Números complexos têm forma a+bi, em que i²=-1, ampliando o conjunto dos números reais.",
          sequence: sequence("números complexos", "forma algébrica, unidade imaginária e operações básicas"),
          pairs: [
            { a: "i²", b: "-1" },
            { a: "3+2i", b: "Parte real 3" },
            { a: "4-5i", b: "Parte imaginária -5" },
            { a: "(2+i)+(1+3i)", b: "3+4i" }
          ]
        }
      ]
    }
  };
})();
