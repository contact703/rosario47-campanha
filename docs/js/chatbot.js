/**
 * Chatbot IA Local - Antunes do Rosário 47
 * Versão 3.0 - Processamento Inteligente sem API Externa
 * 100% Gratuito - Sem dependências de serviço externo
 */

const ChatBot = {
    config: {
        apiUrl: 'https://affectionate-energy-production-fda3.up.railway.app/api/chat',
        maxHistory: 10
    },

    state: {
        isOpen: false,
        isTyping: false,
        messageCount: 0,
        history: [],
        context: {
            lastTopic: null,
            userName: null,
            askedAbout: new Set()
        }
    },

    // Base de conhecimento completa
    knowledge: {
        candidato: {
            nome: "Antunes do Rosário dos Santos",
            idade: "47 anos",
            numero: "47",
            partido: "PAC - Partido Aliança Cidadã",
            profissao: "Economista e Professor Universitário",
            cidade: "Belo Horizonte, MG",
            bairro: "Lagoinha",
            familia: "Casado, pai de 2 filhos",
            formacao: [
                "Economia (UFMG) - bolsa integral",
                "Mestrado em Políticas Públicas (USP)",
                "Doutorado em Desenvolvimento Sustentável (UnB)"
            ],
            slogan: "Juntos por um Brasil que cuida",
            frase: "Política se faz com as pessoas, não para as pessoas",
            trajetoria: [
                { ano: "1998-2005", cargo: "Professor Universitário na PUC Minas" },
                { ano: "2005-2012", cargo: "Secretaria de Desenvolvimento Social de MG" },
                { ano: "2012-2018", cargo: "Vereador de BH (mais votado do partido)" },
                { ano: "2018-2024", cargo: "Deputado Estadual" }
            ],
            conquistas: [
                "Programa 'Escola Integral para Todos'",
                "Lei de incentivo a startups de impacto social",
                "Portal da Cidadania BH",
                "Lei Estadual de Energia Renovável",
                "Programa 'Primeiro Emprego Tech' - 12 mil jovens"
            ],
            diferenciais: [
                "Ficha 100% limpa - zero processos",
                "100% de presença na Câmara",
                "Mais de 50 mil famílias beneficiadas",
                "25 anos de vida pública"
            ]
        },
        
        partido: {
            nome: "Partido Aliança Cidadã",
            sigla: "PAC",
            numero: "47",
            fundacao: "2015",
            posicionamento: "Centro-esquerda progressista",
            slogan: "Juntos por um Brasil que cuida",
            valores: ["Justiça Social", "Sustentabilidade", "Democracia Participativa", "Inovação com Propósito", "Ética e Transparência", "Inclusão"],
            diferenciais: [
                "Ficha limpa obrigatória",
                "Mandato coletivo com conselhos populares",
                "Transparência total das contas",
                "50% das vagas para jovens e mulheres"
            ]
        },

        propostas: {
            educacao: {
                titulo: "Educação para Todos",
                meta: "Brasil entre os 30 melhores em educação até 2030",
                investimento: "Educação como prioridade nº 1 do orçamento",
                itens: [
                    "Escola em Tempo Integral para 100% da rede pública em 4 anos",
                    "Piso de R$ 8.500 para professores + plano de carreira",
                    "Zero analfabetismo - programa intensivo",
                    "500 mil novas vagas em universidades federais",
                    "Um tablet por aluno, programação no currículo",
                    "Creche para todos de 0-3 anos"
                ]
            },
            saude: {
                titulo: "Saúde de Verdade",
                meta: "SUS referência mundial",
                investimento: "8% do PIB para saúde pública",
                itens: [
                    "UBS 24 horas em todas as regiões",
                    "Um médico para cada 1.000 habitantes",
                    "Fila zero - exames e cirurgias em até 30 dias",
                    "CAPS em todos os municípios",
                    "Farmácia Popular ampliada - mais medicamentos gratuitos",
                    "Telemedicina para áreas remotas"
                ]
            },
            emprego: {
                titulo: "Emprego e Renda",
                meta: "Menor desemprego da história",
                investimento: "R$ 50 bilhões para financiar PMEs",
                itens: [
                    "Programa Primeiro Emprego - incentivo fiscal",
                    "MEI sem burocracia + crédito acessível",
                    "2 milhões de empregos em energia renovável",
                    "Salário mínimo com reajuste real acima da inflação",
                    "Cursos técnicos gratuitos em parceria com empresas",
                    "Apoio a cooperativas e agricultura familiar"
                ]
            },
            meioambiente: {
                titulo: "Meio Ambiente",
                meta: "Brasil carbono neutro até 2040",
                investimento: "3% do PIB para transição energética",
                itens: [
                    "Desmatamento zero com fiscalização por satélite",
                    "100% energia renovável até 2035",
                    "Ônibus elétricos, ciclovias e expansão do metrô",
                    "Coleta seletiva em 100% dos municípios",
                    "Saneamento básico universal",
                    "Fundo internacional de preservação da Amazônia"
                ]
            },
            seguranca: {
                titulo: "Segurança Cidadã",
                meta: "Reduzir violência em 50%",
                filosofia: "Inteligência > Truculência",
                itens: [
                    "Polícia comunitária - policial de referência em cada bairro",
                    "Câmeras inteligentes e integração de dados",
                    "Socioeducação - recuperar, não apenas punir",
                    "Combate às milícias com tolerância zero",
                    "Política restritiva de armamento",
                    "Fim da violência policial"
                ]
            },
            moradia: {
                titulo: "Moradia Digna",
                meta: "Déficit habitacional zero",
                itens: [
                    "2 milhões de moradias em 4 anos",
                    "Aluguel social para famílias em vulnerabilidade",
                    "Urbanização de favelas com saneamento",
                    "Crédito acessível com juros baixos",
                    "Conversão de prédios públicos ociosos em moradia"
                ]
            },
            governo: {
                titulo: "Governo Digital e Transparente",
                meta: "Estado 100% digital",
                itens: [
                    "Serviços públicos 100% digitais - tudo pelo app",
                    "Dados abertos em tempo real",
                    "Orçamento participativo - povo decide",
                    "IA para detectar e combater fraudes",
                    "Fim do fura-fila com sistema único"
                ]
            },
            cultura: {
                titulo: "Cultura e Esporte",
                meta: "Cultura e esporte como direito",
                itens: [
                    "Vale Cultura R$ 100/mês para trabalhadores",
                    "Praças da Juventude em cada bairro",
                    "10 mil novos Pontos de Cultura",
                    "Bolsa Atleta expandida para esportes amadores"
                ]
            }
        },

        posicoes: {
            aborto: {
                titulo: "Posição sobre Aborto",
                posicao: "Defende manter a legalidade nos casos previstos em lei",
                detalhes: [
                    "Manter a legalidade em casos de estupro",
                    "Risco à vida da mulher",
                    "Anencefalia",
                    "Fortalecer o SUS para atendimento integral",
                    "Educação sexual nas escolas",
                    "Apoio psicológico e social para gestantes"
                ],
                compromisso: "Prioriza saúde pública e direitos das mulheres"
            },
            feminismo: {
                titulo: "Igualdade de Gênero",
                posicao: "Defensor da igualdade de gênero",
                acoes: [
                    "50% das vagas no PAC são para mulheres",
                    "Lei Maria da Penha fortalecida com mais recursos",
                    "Delegacias da Mulher em todos os municípios",
                    "Creches gratuitas para mães trabalhadoras",
                    "Piso salarial igual para homens e mulheres",
                    "Maior participação feminina na política"
                ]
            },
            lgbt: {
                titulo: "Direitos LGBTQI+",
                posicao: "Respeito integral aos direitos humanos",
                acoes: [
                    "Casa de Acolhida para jovens expulsos de casa",
                    "Saúde específica e respeitosa na rede pública",
                    "Combate à discriminação em todos os espaços",
                    "Preservação dos direitos civis conquistados"
                ]
            },
            religiao: {
                titulo: "Liberdade Religiosa",
                posicao: "Estado laico com liberdade para todos",
                principios: [
                    "Respeito a todas as crenças religiosas",
                    "Proteção aos não religiosos",
                    "Diálogo com lideranças sobre políticas sociais",
                    "Valorização do trabalho social das igrejas"
                ]
            },
            armas: {
                titulo: "Armamento",
                posicao: "Política restritiva de armamento",
                medidas: [
                    "Fortalecimento do controle de armas ilegais",
                    "Inteligência e tecnologia no combate ao crime",
                    "Desarmamento voluntário ampliado",
                    "Polícia comunitária para prevenção"
                ]
            },
            drogas: {
                titulo: "Política sobre Drogas",
                posicao: "Tratamento como questão de saúde pública",
                abordagem: [
                    "Tratamento e reabilitação para dependentes",
                    "Redução de danos para usuários",
                    "Combate ao tráfico com inteligência policial",
                    "Descriminalização do usuário (não do traficante)"
                ]
            }
        }
    },

    // Intenções complexas do usuário
    intents: [
        // Saudações
        {
            patterns: ['oi', 'olá', 'ola', 'eae', 'opa', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'hi'],
            action: (ctx) => {
                if (ctx.state.messageCount === 0) {
                    return `Olá! 👋 Sou o assistente virtual da campanha de **Antunes do Rosário 47**.

Posso te ajudar com informações sobre:
• 👤 O candidato e sua trajetória
• 📋 Propostas de governo
• 🏛️ O PAC (Partido Aliança Cidadã)
• 📊 Posições sobre temas importantes

*Sou um assistente virtual. Minhas respostas são baseadas em informações oficiais da campanha.*

O que você gostaria de saber?`;
                }
                return `Olá de novo! 😊 Como posso ajudar você hoje?`;
            }
        },

        // Quem é o candidato - VARIAÇÕES
        {
            patterns: ['quem é antunes', 'quem e antunes', 'conte sobre o candidato', 'fale do candidato', 'me fale dele', 'quem é ele', 'biografia'],
            action: () => {
                const c = ChatBot.knowledge.candidato;
                return `**${c.nome}** é ${c.profissao} com ${c.trajetoria.length} anos de vida pública.

🎓 **Formação:**
${c.formacao.map(f => `• ${f}`).join('\n')}

📋 **Trajetória:**
${c.trajetoria.map(t => `• ${t.ano}: ${t.cargo}`).join('\n')}

🏆 **Principais Conquistas:**
${c.conquistas.slice(0, 3).map(x => `✓ ${x}`).join('\n')}

✅ **Ficha Limpa:** ${c.diferenciais[0]}

${c.frase}`;
            }
        },

        // História/Origem
        {
            patterns: ['história', 'historia', 'origem', 'onde nasceu', 'infância', 'como começou'],
            action: () => {
                const c = ChatBot.knowledge.candidato;
                return `**A história de superação de Antunes:**

👶 Nasceu em ${c.cidade}, no bairro ${c.bairro}, em família humilde.
👨‍👩‍👧 Filho de professora primária e metalúrgico.
📚 Estudou em escola pública durante toda a infância.
🎓 Aos 17 anos, conquistou ${c.formacao[0]}.

💪 Sempre defendeu que **a educação transforma vidas** - é a prova viva disso!

${c.frase}`;
            }
        },

        // Propostas gerais
        {
            patterns: ['propostas', 'plano de governo', 'o que ele vai fazer', 'promessas', 'ideias'],
            action: () => {
                const areas = Object.keys(ChatBot.knowledge.propostas);
                return `**As 8 bandeiras da campanha de Antunes do Rosário:**

📚 **Educação** - Escola integral, piso R$8.500 professores
🏥 **Saúde** - UBS 24h, fila zero
💼 **Emprego** - 2 milhões de empregos verdes
🌱 **Meio Ambiente** - Carbono neutro 2040
🛡️ **Segurança** - Polícia comunitária
🏠 **Moradia** - 2 milhões de casas
📱 **Governo Digital** - 100% online
🎭 **Cultura** - Vale Cultura R$100/mês

Quer saber mais detalhes sobre alguma área específica?`;
            }
        },

        // Educação específica
        {
            patterns: ['educação', 'educacao', 'escola', 'professor', 'ensino', 'universidade', 'faculdade', 'estudo'],
            action: () => {
                const p = ChatBot.knowledge.propostas.educacao;
                return `📚 **${p.titulo}**
🎯 Meta: ${p.meta}
💰 ${p.investimento}

${p.itens.map(i => `✓ ${i}`).join('\n')}

Antunes sempre priorizou a educação - foi professor e criou programas como a "Escola Integral para Todos".`;
            }
        },

        // Saúde
        {
            patterns: ['saúde', 'saude', 'hospital', 'médico', 'medico', 'sus', 'ubs', 'posto', 'remédio'],
            action: () => {
                const p = ChatBot.knowledge.propostas.saude;
                return `🏥 **${p.titulo}**
🎯 Meta: ${p.meta}
💰 ${p.investimento}

${p.itens.map(i => `✓ ${i}`).join('\n')}`;
            }
        },

        // Emprego
        {
            patterns: ['emprego', 'trabalho', 'desemprego', 'renda', 'salário', 'salario', 'mei', 'empresa'],
            action: () => {
                const p = ChatBot.knowledge.propostas.emprego;
                return `💼 **${p.titulo}**
🎯 Meta: ${p.meta}
💰 ${p.investimento}

${p.itens.map(i => `✓ ${i}`).join('\n')}`;
            }
        },

        // Meio ambiente
        {
            patterns: ['meio ambiente', 'sustentável', 'verde', 'clima', 'amazônia', 'amazonia', 'energia', 'solar'],
            action: () => {
                const p = ChatBot.knowledge.propostas.meioambiente;
                return `🌱 **${p.titulo}**
🎯 Meta: ${p.meta}
💰 ${p.investimento}

${p.itens.map(i => `✓ ${i}`).join('\n')}

Antunes foi autor da Lei Estadual de Energia Renovável durante seu mandato como deputado.`;
            }
        },

        // Segurança
        {
            patterns: ['segurança', 'seguranca', 'violência', 'polícia', 'policia', 'crime', 'bandido'],
            action: () => {
                const p = ChatBot.knowledge.propostas.seguranca;
                return `🛡️ **${p.titulo}**
🎯 Meta: ${p.meta}
💡 Filosofia: ${p.filosofia}

${p.itens.map(i => `✓ ${i}`).join('\n')}`;
            }
        },

        // Partido
        {
            patterns: ['partido', 'pac', 'aliança cidada', '47', 'numero'],
            action: () => {
                const p = ChatBot.knowledge.partido;
                return `**${p.nome} (${p.sigla}) - ${p.numero}**

📅 Fundado em ${p.fundacao}
🎯 ${p.posicionamento}
💬 "${p.slogan}"

**Valores:**
${p.valores.map(v => `• ${v}`).join('\n')}

**Diferenciais:**
${p.diferenciais.map(d => `✓ ${d}`).join('\n')}`;
            }
        },

        // Aborto
        {
            patterns: ['aborto', 'gravida', 'gestação', 'interromper'],
            action: () => {
                const p = ChatBot.knowledge.posicoes.aborto;
                return `**${p.titulo}**

${p.posicao}:
${p.detalhes.map(d => `• ${d}`).join('\n')}

✅ **Compromisso:** ${p.compromisso}`;
            }
        },

        // Feminismo
        {
            patterns: ['feminismo', 'mulheres', 'machismo', 'igualdade', 'mulher'],
            action: () => {
                const p = ChatBot.knowledge.posicoes.feminismo;
                return `**${p.titulo}**

Antunes é ${p.posicao.toLowerCase()}:

${p.acoes.map(a => `• ${a}`).join('\n')}`;
            }
        },

        // LGBT
        {
            patterns: ['lgbt', 'gay', 'homossexual', 'trans', 'diversidade'],
            action: () => {
                const p = ChatBot.knowledge.posicoes.lgbt;
                return `**${p.titulo}**

${p.posicao}

${p.acoes.map(a => `• ${a}`).join('\n')}`;
            }
        },

        // Número para votar
        {
            patterns: ['numero', 'votar', 'voto', 'urna', 'eleição'],
            action: () => {
                return `🗳️ **Antunes do Rosário - 47**

Partido: PAC (Partido Aliança Cidadã)
Slogan: "Juntos por um Brasil que cuida"

**Lembre-se: 47!** 💚🧡`;
            }
        },

        // Ficha limpa
        {
            patterns: ['ficha', 'processo', 'corrupção', 'honesto'],
            action: () => {
                const c = ChatBot.knowledge.candidato;
                return `✅ **Ficha 100% Limpa**

${c.diferenciais.map(d => `• ${d}`).join('\n')}

O PAC tem tolerância zero com corrupção!`;
            }
        },

        // Ajuda
        {
            patterns: ['ajuda', 'help', 'o que você faz', 'como funciona'],
            action: () => {
                return `Sou o assistente virtual da campanha! 🤖

Posso te contar sobre:
• 👤 A história e trajetória de Antunes
• 📋 Propostas nas 8 áreas (educação, saúde, emprego...)
• 🏛️ O PAC e seus valores
• 📊 Posições sobre temas importantes
• 🗳️ Como votar (número 47!)

É só perguntar!`;
            }
        },

        // Despedida
        {
            patterns: ['tchau', 'obrigado', 'obrigada', 'valeu', 'até'],
            action: () => {
                return `Foi um prazer ajudar! 😊

Lembre-se: **Antunes do Rosário - 47**
Juntos por um Brasil que cuida! 💚🧡

Volte sempre que precisar!`;
            }
        }
    ],

    init() {
        this.cacheElements();
        this.bindEvents();
        console.log('[ChatBot] IA Local inicializada');
    },

    cacheElements() {
        this.elements = {
            toggle: document.querySelector('.chatbot-toggle'),
            window: document.querySelector('.chatbot-window'),
            close: document.querySelector('.chatbot-close'),
            input: document.getElementById('chat-input'),
            send: document.getElementById('chat-send'),
            messages: document.getElementById('chat-messages')
        };
    },

    bindEvents() {
        const { toggle, close, send, input } = this.elements;

        toggle?.addEventListener('click', () => this.toggleWindow());
        close?.addEventListener('click', () => this.closeWindow());
        send?.addEventListener('click', () => this.sendMessage());
        
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });

        document.querySelectorAll('.quick-reply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.sendMessage(e.target.dataset.message);
            });
        });
    },

    toggleWindow() {
        this.elements.window.classList.toggle('active');
        this.state.isOpen = !this.state.isOpen;
        
        if (this.state.isOpen && this.state.messageCount === 0) {
            setTimeout(() => this.showWelcome(), 400);
        }
    },

    closeWindow() {
        this.elements.window.classList.remove('active');
        this.state.isOpen = false;
    },

    showWelcome() {
        const welcome = this.intents[0].action({ state: this.state });
        this.addMessage(welcome, 'bot');
    },

    async sendMessage(text = null) {
        const message = text || this.elements.input?.value?.trim();
        if (!message || this.state.isTyping) return;

        if (!text) this.elements.input.value = '';

        this.addMessage(message, 'user');
        this.state.messageCount++;
        this.state.history.push({ role: 'user', content: message });

        this.showTyping();

        // Processamento local da IA
        setTimeout(() => {
            const response = this.processMessage(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
            this.state.history.push({ role: 'assistant', content: response });
        }, 600 + Math.random() * 400);
    },

    processMessage(message) {
        const normalized = message.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

        // Procura pela melhor intenção
        for (const intent of this.intents) {
            for (const pattern of intent.patterns) {
                if (normalized.includes(pattern)) {
                    return intent.action({ state: this.state });
                }
            }
        }

        // Resposta padrão para não reconhecido
        return `Desculpe, não entendi completamente. 🤔

Posso te ajudar com:
• "Quem é Antunes do Rosário?"
• "Quais são as propostas?"
• "Fale sobre educação"
• "Qual o número para votar?"

Tente uma dessas perguntas!`;
    },

    showTyping() {
        this.state.isTyping = true;
        const div = document.createElement('div');
        div.className = 'message bot typing-indicator';
        div.id = 'typing-indicator';
        div.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
        
        const quickReplies = this.elements.messages?.querySelector('.quick-replies');
        if (quickReplies) {
            this.elements.messages.insertBefore(div, quickReplies);
        } else {
            this.elements.messages?.appendChild(div);
        }
        this.scrollToBottom();
    },

    hideTyping() {
        this.state.isTyping = false;
        document.getElementById('typing-indicator')?.remove();
    },

    addMessage(text, sender) {
        const messages = this.elements.messages;
        if (!messages) return;

        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = `<p>${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>`;

        const quickReplies = messages.querySelector('.quick-replies');
        if (quickReplies) {
            messages.insertBefore(div, quickReplies);
        } else {
            messages.appendChild(div);
        }

        this.scrollToBottom();
    },

    scrollToBottom() {
        this.elements.messages?.scrollTo({
            top: this.elements.messages.scrollHeight,
            behavior: 'smooth'
        });
    }
};

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
    ChatBot.init();
});

window.ChatBot = ChatBot;
