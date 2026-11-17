-- SPDX-License-Identifier: AGPL-3.0-or-later
-- ==============================================================================
-- MIGRATION: god-sql-mk12-show-seed.sql
-- Hub de Comunicacao Cientifica Lab-Div V3.0
-- Seed Idempotente do Catalogo de Experimentos e Dados Internos (Show de Fisica)
-- ==============================================================================

-- 1. POPULACAO IDEMPOTENTE DO CATALOGO PUBLICO DE EXPERIMENTOS
INSERT INTO public.show_experiments (
    slug, legacy_id, act, title, subtitle, concept, description, student_explanation, curiosities, image_url, theme_color, maintenance_status, is_active
) VALUES
-- Ato 1: Pre-Show
(
    'basket',
    'basket',
    1,
    'Basket',
    'Cinematica & Fisica do Esporte',
    'Mecanica e Lancamento Obliquo',
    'Um desafio interativo de arremesso que desmistifica parabolas, conservacao de momento e gravidade no palco.',
    'Quando a bola e lancada, a unica aceleracao que atua sobre ela no ar e a da gravidade, apontada para baixo. O movimento horizontal continua em velocidade constante, criando a famosa trajetoria parabolica.',
    ARRAY['Se a resistencia do ar fosse nula, o angulo que atinge o maior alcance horizontal na mesma altura seria exatamente 45 graus.', 'Jogadores profissionais ajustam o efeito de backspin para aumentar o atrito com o aro e amortecer a bola.'],
    '/show/IMG_8833.JPG',
    'green',
    'disponivel',
    true
),
(
    'galao',
    'galao',
    1,
    'Galao',
    'Pressao Atmosferica & Vacuo',
    'Termodinamica e Pressao dos Gases',
    'O impressionante efeito da pressao atmosferica esmagando instantaneamente um galao resistente sob vacuo.',
    'Ao aquecer uma pequena quantidade de agua dentro do galao, o vapor d agua expulsa o ar. Ao tampar e resfriar, o vapor condensa de volta para liquido ocupando muito menos espaco, criando uma queda brusca de pressao interna. A atmosfera do planeta entao esmaga o galao por fora.',
    ARRAY['A pressao atmosferica ao nivel do mar exerce cerca de 10 toneladas de forca por metro quadrado sobre todas as superficies.', 'O galao nao e puxado para dentro; e empurrado com forca colossal pelo ar a nossa volta.'],
    '/show/IMG_8869.JPG',
    'green',
    'disponivel',
    true
),
(
    'torque',
    'torque',
    1,
    'Torque',
    'Giroscopios & Momento Angular',
    'Rotacao e Leis de Conservacao',
    'A forca invisivel da conservacao do momento angular com rodas giratorias e bancos giratorios que desafiam a intuicao.',
    'Assim como um objeto em linha reta quer continuar se movendo, uma roda girando possui momento angular e resiste a qualquer mudanca na direcao do seu eixo de rotacao.',
    ARRAY['E exatamente por isso que e facil se equilibrar em uma bicicleta em movimento e quase impossivel com ela parada.', 'Satelites espaciais e telescopios como o Hubble usam rodas de reacao baseadas nesse mesmo efeito para apontar para estrelas sem gastar combustivel.'],
    '/show/IMG_8876.JPG',
    'green',
    'disponivel',
    true
),

-- Ato 2: Abertura
(
    'marie-curie',
    'marie-curie',
    2,
    'Ato da Marie Curie',
    'A Pioneira da Radioatividade',
    'Historia da Ciencia e Fisica Nuclear',
    'Uma imersao teatral na vida e nas descobertas da unica cientista laureada com dois Premios Nobel em areas distintas.',
    'Marie Curie descobriu que a radioatividade e uma propriedade intrinseca dos atomos e nao de reacoes quimicas externas, abrindo as portas para toda a Fisica Nuclear do seculo XX.',
    ARRAY['Curie foi a primeira mulher a lecionar na Sorbonne e a primeira pessoa no mundo a ganhar dois premios Nobel (Fisica em 1903 e Quimica em 1911).', 'Ela cunhou o proprio termo radioatividade.'],
    '/show/IMG_8891.JPG',
    'blue',
    'disponivel',
    true
),
(
    'albert-einstein',
    'albert-einstein',
    2,
    'Ato do Albert Einstein',
    'Relatividade & O Pensamento Curioso',
    'Fisica Moderna e Pensamento Cientifico',
    'Uma abertura instigante baseada nas experiencias de pensamento de Einstein sobre a luz, o espaco e o tempo.',
    'Einstein usava gedankenexperiments (experimentos mentais) para imaginar o que aconteceria se alguem viajasse montado em um raio de luz, concluindo que o tempo e o espaco sao relativos a velocidade do observador.',
    ARRAY['Em 1905, seu Ano Miraculoso, ele publicou 4 artigos revolucionarios: o efeito fotoeletrico, o movimento browniano, a relatividade restrita e a equivalencia massa-energia (E=mc2).', 'Ele ganhou o Nobel de 1921 pela explicacao quantica do efeito fotoeletrico, e nao pela Relatividade.'],
    '/show/IMG_8990.JPG',
    'blue',
    'disponivel',
    true
),

-- Ato 3: Principal
(
    'wimshurst',
    'wimshurst',
    3,
    'Gerador de Wimshurst',
    'Alta Tensao Eletrostatica',
    'Inducao Eletrostatica e Descargas',
    'Maquina classica geradora de dezenas de milhares de volts, demonstrando acumulo de cargas e relampagos em miniatura.',
    'Dois discos giram em sentidos opostos com palhetas metalicas. Por inducao eletrostatica, as cargas sao separadas e armazenadas em garrafas de Leyden ate que a diferenca de potencial ultrapasse a rigidez dieletrica do ar, gerando uma faisca.',
    ARRAY['O ar ambiente se transforma em plasma condutor brilhante durante o arco eletrico.', 'Tensao pode passar de 50.000 volts, mas a corrente eletrica e extremamente baixa (na ordem de microamperes), tornando a faisca visualmente impressionante.'],
    '/show/IMG_00004.JPG',
    'blue',
    'disponivel',
    true
),
(
    'fumaca',
    'fumaca',
    3,
    'Canhao de Fumaca',
    'Vortices Toroidais & Fluidos',
    'Aerodinamica e Dinamica de Vortices',
    'Disparo de aneis de fumaca gigantes que viajam pelo auditorio mostrando o transporte de momento e energia em fluidos.',
    'Ao empurrar rapidamente uma membrana elastica no fundo de um tambor com orificio circular, o fluido no centro se move mais rapido do que na borda, enrolando o ar em um toroide (anel) que se auto-estabiliza e viaja por longas distancias.',
    ARRAY['Golfinhos e baleias produzem vortices toroidais identicos debaixo d agua para brincar.', 'Vortices toroidais sao incrivelmente eficientes e conservam sua energia por muito mais tempo que jatos turbulentos normais.'],
    '/show/IMG_00031.JPG',
    'blue',
    'disponivel',
    true
),
(
    'tesla',
    'tesla',
    3,
    'Bobina de Tesla',
    'Raios & Eletromagnetismo Sem Fio',
    'Ressonancia Eletromagnetica e Alta Frequencia',
    'Centelhas espetaculares no ar e lampadas fluorescentes acendendo nas maos sem qualquer fio conectado.',
    'Um circuito ressonante LC eleva a tensao para centenas de milhares de volts em alta frequencia. O campo eletromagnetico gerado no espaco e forte o suficiente para ionizar os gases das lampadas fluorescentes seguradas pela plateia a distancia.',
    ARRAY['A alta frequencia (centenas de quilohertz) causa o chamado efeito pelicular (skin effect), onde as correntes tendem a circular pela superficie exterior.', 'Nikola Tesla idealizou esse sistema sonhando em transmitir energia eletrica gratuitamente para o mundo inteiro pelo ar.'],
    '/show/IMG_00143.JPG',
    'blue',
    'disponivel',
    true
),

-- Ato 4: Encerramento
(
    'nitrogenio',
    'nitrogenio',
    4,
    'Nitrogenio Liquido',
    'Criogenia Extrema (-196 C)',
    'Termodinamica e Transicao de Fase',
    'O apice termico: nuvens colossais de vapor, contracao de gases e efeitos fascinantes do frio extremo no palco.',
    'A pressao ambiente, o nitrogenio entra em ebulicao violenta a 196 graus Celsius negativos. Ao entrar em contato com a sala quente, ele evapora rapidamente condensando a umidade do ar ao redor e gerando imensas nuvens brancas.',
    ARRAY['O ar que respiramos e composto por aproximadamente 78 porcento de nitrogenio gasoso.', 'Quando 1 litro de nitrogenio liquido evapora, ele se expande cerca de 700 vezes em volume de gas.'],
    '/show/IMG_8793.JPG',
    'red',
    'disponivel',
    true
),
(
    'batata-fria',
    'batata-fria',
    4,
    'Batata Fria',
    'Transicao Vitrea Instantanea',
    'Propriedades dos Materiais em Baixas Temperaturas',
    'Alimentos e materiais organicos submetidos a congelamento instantaneo se quebrando como vidro diante do publico.',
    'A agua contida nas celulas vegetais congela quase instantaneamente, cristalizando a matriz celular. O material perde qualquer elasticidade e se torna fragil como vidro sob impacto mecânico.',
    ARRAY['Esse experimento demonstra o conceito de transicao vitrea e a fragilidade criogenica.', 'Cientistas de materiais utilizam o mesmo principio para moer polimeros e borrachas que seriam maleaveis demais a temperatura ambiente.'],
    '/show/IMG_8797.JPG',
    'red',
    'disponivel',
    true
),
(
    'reels',
    'reels',
    4,
    'Reels',
    'O Momento Visual & Redes Sociais',
    'Divulgacao Cientifica e Engajamento Visual',
    'Experimentos com iluminacao estroboscopica e efeitos cinematograficos desenhados sob medida para os alunos gravarem.',
    'Combinando frequencias de estroboscopio com gotas caindo ou laser incidindo em neblina, conseguimos congelar ou reverter a percepcao de movimento aos olhos humanos e das cameras.',
    ARRAY['O olho humano percebe cerca de 10 a 12 imagens distintas por segundo antes de criar ilusao de movimento continuo.', 'Ao sincronizar a taxa de piscada da luz com a taxa de quadros (FPS) da camera do celular, gotas d agua parecem levitar paradas no ar.'],
    '/show/IMG_00224.JPG',
    'red',
    'disponivel',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    concept = EXCLUDED.concept,
    description = EXCLUDED.description,
    student_explanation = EXCLUDED.student_explanation,
    curiosities = EXCLUDED.curiosities,
    image_url = EXCLUDED.image_url,
    theme_color = EXCLUDED.theme_color,
    maintenance_status = EXCLUDED.maintenance_status,
    is_active = EXCLUDED.is_active,
    updated_at = now();

-- 2. DADOS INTERNOS RESTRITOS (ROTEIRO TECNICO, SEGURANCA E CHECKLISTS)
INSERT INTO public.show_experiment_internals (
    experiment_slug, technical_script_md, safety_notes, setup_checklist, maintenance_notes
) VALUES
(
    'basket',
    '# Roteiro Tecnico - Basket\n1. Verificar posicao do lancador em relacao a plateia.\n2. Convidar 2 voluntarios (um aluno e um professor).\n3. Demonstrar primeiro lancamento reto (perde alcance).\n4. Ajustar para angulo ideal e demonstrar conservacao de energia.',
    'Manter distancia minima de 3 metros da primeira fileira. Usar bolas de espuma ou borracha macia.',
    ARRAY['Checar mola de retorno do lancador', 'Limpar area de impacto no palco', 'Verificar trava de seguranca angular'],
    'Mola revisada e calibrada.'
),
(
    'galao',
    '# Roteiro Tecnico - Galao\n1. Adicionar 50ml de agua destilada ao galao metalico.\n2. Ligar bico de bunsen / aquecedor eletrico ate ebulicao franca (vapor continuo).\n3. Desligar fonte, rosquear tampa com chave sextavada de vedacao.\n4. Aguardar ou borrifar agua fria para acelerar colapso.',
    'USO OBRIGATORIO de luvas termicas de alta resistencia e oculos de protecao. Nunca lacrar galao com fogo aceso por baixo.',
    ARRAY['Conferir borracha de vedacao da tampa', 'Checar luvas termicas', 'Reservar borrifador com agua fria'],
    'Vedacoes trocadas trimestralmente.'
),
(
    'torque',
    '# Roteiro Tecnico - Torque e Momento Angular\n1. Posicionar banco giratorio sem atrito no centro do palco.\n2. Monitor acelera a roda de bicicleta pesada ate alta rotacao com manivela ou motor.\n3. Voluntario senta com pes suspensos e inverte o eixo da roda.',
    'Garantir que os pes do voluntario nao toquem no chao durante a rotacao. Orientar a segurar com firmeza as manoplas emborrachadas.',
    ARRAY['Inspecionar rolamento central do banco giratorio', 'Conferir balanceamento dos pesos na roda de bike', 'Ajustar aperto das porcas do eixo'],
    'Rolamentos lubrificados com graxa de litio.'
),
(
    'marie-curie',
    '# Roteiro Teatral - Marie Curie\n1. Escurecimento das luzes principais do palco, foco azul/cyan lateral.\n2. Entrada caracterizada com tubos e beckers contendo fluoresceina sob luz UV negra.\n3. Narrativa sobre o isolamento do Polonio e do Radio no galpao umido em Paris.',
    'Toda fluorescencia e simulada com fluoresceina sodica / tonica atoxica sob luz negra segura UV-A (sem emissao radioativa real).',
    ARRAY['Ligar lampadas UV 10 minutos antes da sessao', 'Preparar solucao de fluoresceina fresca', 'Ajustar microfone de lapela'],
    'Figurino e aderecos de epoca organizados no camarim.'
),
(
    'albert-einstein',
    '# Roteiro Teatral - Albert Einstein\n1. Foco quente central.\n2. Dialogo com a plateia sobre o relogio do auditorio e a velocidade da luz.\n3. Demonstracao da deformacao do tecido espaco-tempo com elastico esticado e esferas de chumbo.',
    'Certificar que o suporte do tecido elastico esta bem travado nos quatro lados do tablado.',
    ARRAY['Montar aro tensor do tecido espaco-tempo', 'Separar esferas de massas variadas', 'Testar transmissor de audio'],
    'Tecido elastico de neoprene inspecionado.'
),
(
    'wimshurst',
    '# Roteiro Tecnico - Wimshurst\n1. Ajustar centelhadores a 3 cm de distancia inicial.\n2. Acionar manivela com rotacao uniforme.\n3. Acumular carga nas garrafas de Leyden ate o disparo do arco.\n4. Demonstrar efeito das pontas e moinho eletrostatico.',
    'Nao permitir aproximacao de alunos com marcapasso ou implantes eletronicos a menos de 2 metros durante operacao com garrafas ligadas.',
    ARRAY['Limpar po dos discos de acrilico com pano antiestatico', 'Conferir escovas metalicas de contato', 'Descarregar garrafas com haste de aterramento apos o show'],
    'Escovas substituidas recentemente.'
),
(
    'fumaca',
    '# Roteiro Tecnico - Canhao de Fumaca\n1. Encher camara com fluido de maquina de fumaca atoxica de base vegetal.\n2. Apontar para alvo visual acima da plateia.\n3. Disparar membrana com golpe seco e firme no centro.',
    'Nunca disparar diretamente nos olhos ou ouvidos a curta distancia (menos de 1,5m). Usar apenas fluido glicerinado certificado.',
    ARRAY['Checar nivel de liquido na maquina de fumaça', 'Verificar elasticidade da membrana traseira', 'Posicionar copos descartaveis para derrubada'],
    'Membrana de silicone em perfeito estado.'
),
(
    'tesla',
    '# Roteiro Tecnico - Bobina de Tesla\n1. Ativar exaustao do palco se houver acumulo de ozonio.\n2. Conectar aterramento dedicado de RF (independente da rede predial).\n3. Demonstrar faiscas livres no terminal toroidal.\n4. Aproximar lampada fluorescente na mao (usar luva isolante ou segurar no terminal metalico aterrado).',
    'RISCO DE ALTA TENSAO E RADIOFREQUENCIA. Aviso sonoro obrigatorio antes de ligar. Distancia de seguranca de 4 metros para portadores de marcapasso ou aparelhos auditivos.',
    ARRAY['Verificar aterramento fisico de RF', 'Conferir gap de centelha', 'Testar botao de parada de emergencia (cogumelo)'],
    'Capacitores do tanque LC testados e isolados.'
),
(
    'nitrogenio',
    '# Roteiro Tecnico - Nitrogenio Liquido\n1. Retirar LN2 do botijao criogenico com pescador de pressao.\n2. Demonstrar efeito Leidenfrost no chao do palco.\n3. Inserir bexigas infladas (mostrando contracao termica drastica) e deixar reexpandir na mao dos alunos.',
    'EXTREMO CUIDADO COM QUEIMADURAS CRIOGENICAS (-196C). Uso mandatorio de crioluvas e protetor facial. Ambiente com ventilacao continua para evitar asfixia por deslocamento de O2.',
    ARRAY['Inspecionar nivel do botijao criogenico', 'Equipar EPI criogenico completo', 'Abrir janelas superiores de ventilacao do auditorio'],
    'Botijao criogenico calibrado pela equipe criogenica do IFUSP.'
),
(
    'batata-fria',
    '# Roteiro Tecnico - Batata Fria Criogenica\n1. Mergulhar batata ou flor fresca no dewar com LN2 por 60 segundos.\n2. Retirar com pinca criogenica longa de aco inoxidavel.\n3. Bater levemente na bancada metalica: estilhacamento instantaneo em po/fragmentos.',
    'Usar anteparo de acrilico transparente entre a bancada e a plateia para conter projeteis de gelo/vegetal estilhacado.',
    ARRAY['Separar anteparo protetor de acrilico', 'Preparar pinca criogenica longa', 'Dispor de bandeja coletora para fragmentos congelados'],
    'Pincas e cubas inox higienizadas.'
),
(
    'reels',
    '# Roteiro Tecnico - Efeito Estroboscopico / Reels\n1. Avisar aos professores e alunos para prepararem seus celulares no modo video/camera lenta.\n2. Ajustar frequencia da fita estroboscopica de LED para 60Hz / 120Hz conforme som do alto-falante de baixa frequencia (gotas d agua).\n3. Transicao de gotas subindo, parando e caindo lentamente.',
    'ATENCAO A EPILEPSIA FOTOSSENSIVEL: Avisar verbalmente antes do efeito. Limitar a duracao total da frequencia estroboscopica a menos de 45 segundos continuos.',
    ARRAY['Calibrar gerador de frequencia de audio', 'Checar sincronismo do estrobo', 'Posicionar iluminacao de apoio para fotos'],
    'Controlador PWM e LEDs inspecionados.'
)
ON CONFLICT (experiment_slug) DO UPDATE SET
    technical_script_md = EXCLUDED.technical_script_md,
    safety_notes = EXCLUDED.safety_notes,
    setup_checklist = EXCLUDED.setup_checklist,
    maintenance_notes = EXCLUDED.maintenance_notes,
    updated_at = now();

