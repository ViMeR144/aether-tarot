(function () {
  const STORAGE_KEY = 'aether_lang';
  const LANGS = {
    ru: { label: 'RU', html: 'ru', title: 'Русский' },
    uk: { label: 'UA', html: 'uk', title: 'Українська' },
    en: { label: 'EN', html: 'en', title: 'English' },
    pl: { label: 'PL', html: 'pl', title: 'Polski' },
    pt: { label: 'PT', html: 'pt', title: 'Português' },
    es: { label: 'ES', html: 'es', title: 'Español' },
  };

  const entries = [
    ['Aether Tarot — Цифровой Оракул', 'Aether Tarot — Цифровий Оракул', 'Aether Tarot — Digital Oracle'],
    ['Пользовательское соглашение — Aether Tarot', 'Користувацька угода — Aether Tarot', 'User Agreement — Aether Tarot'],
    ['Профиль — Aether Tarot', 'Профіль — Aether Tarot', 'Profile — Aether Tarot'],
    ['КАРТА ДНЯ', 'КАРТА ДНЯ', 'CARD OF THE DAY'],
    ['РАСКЛАДЫ', 'РОЗКЛАДИ', 'SPREADS'],
    ['КВИЗ', 'КВІЗ', 'QUIZ'],
    ['БОТ', 'БОТ', 'BOT'],
    ['ОТЗЫВЫ', 'ВІДГУКИ', 'REVIEWS'],
    ['МОЙ ПРОФИЛЬ', 'МІЙ ПРОФІЛЬ', 'MY PROFILE'],
    ['☽ ВОЙТИ', '☽ УВІЙТИ', '☽ LOGIN'],
    ['ВЫЙТИ', 'ВИЙТИ', 'LOG OUT'],
    ['Выйти', 'Вийти', 'Log out'],
    ['← НА САЙТ', '← НА САЙТ', '← TO SITE'],
    ['Menu', 'Меню', 'Menu'],
    ['ЦИФРОВОЙ ОРАКУЛ', 'ЦИФРОВИЙ ОРАКУЛ', 'DIGITAL ORACLE'],
    ['Вопроси звёзды.', 'Запитай зорі.', 'Ask the stars.'],
    ['Твой ИИ-компаньон для', 'Твій AI-компаньйон для', 'Your AI companion for'],
    ['духовного наставничества', 'духовного наставництва', 'spiritual guidance'],
    ['Открой мудрость предков сквозь завесу современных технологий. Каждая карта раскрывает истину, скрытую на виду.', 'Відкрий мудрість предків крізь завісу сучасних технологій. Кожна карта розкриває істину, приховану на видноті.', 'Open ancestral wisdom through the veil of modern technology. Each card reveals the truth hidden in plain sight.'],
    ['ЗАПУСТИТЬ БОТА В TELEGRAM', 'ЗАПУСТИТИ БОТА В TELEGRAM', 'START THE BOT IN TELEGRAM'],
    ['Полнолуние', 'Повня', 'Full moon'],
    ['Пик энергии. Лучшее время для расклада', 'Пік енергії. Найкращий час для розкладу', 'Peak energy. The best time for a spread'],
    ['До полнолуния', 'До повні', 'Until full moon'],
    ['НАЖМИ НА КАРТУ', 'НАТИСНИ НА КАРТУ', 'TAP THE CARD'],
    ['Маг', 'Маг', 'The Magician'],
    ['Сила воли и мастерство. Все инструменты уже у тебя в руках.', 'Сила волі й майстерність. Усі інструменти вже у твоїх руках.', 'Willpower and mastery. Every tool is already in your hands.'],
    ['нажми ещё раз', 'натисни ще раз', 'tap again'],
    ['Мудрость в каждой карте', 'Мудрість у кожній карті', 'Wisdom in Every Card'],
    ['Aether Tarot выходит за рамки традиционных раскладов. Соединяя древние эзотерические знания с передовым искусственным интеллектом, мы создаём пространство для самопознания. Каждый расклад — зеркало твоей души, поданное с эфирной точностью.', 'Aether Tarot виходить за межі традиційних розкладів. Поєднуючи давні езотеричні знання з передовим штучним інтелектом, ми створюємо простір для самопізнання. Кожен розклад — дзеркало твоєї душі, подане з ефірною точністю.', 'Aether Tarot moves beyond traditional spreads. By blending ancient esoteric knowledge with advanced AI, we create a space for self-discovery. Every spread is a mirror of your soul, delivered with ethereal precision.'],
    ['Доступ 24/7', 'Доступ 24/7', '24/7 Access'],
    ['Пустота никогда не спит. Ищи наставление в любое время, из любой точки мира, когда духовный порыв достигает тебя.', 'Порожнеча ніколи не спить. Шукай настанову будь-коли, з будь-якої точки світу, коли духовний імпульс торкається тебе.', 'The void never sleeps. Seek guidance anytime, anywhere in the world, whenever the spiritual impulse reaches you.'],
    ['Личный Путь', 'Особистий Шлях', 'Personal Path'],
    ['Расклады, адаптирующиеся к твоей уникальной энергетической подписи. Оракул учится на твоих запросах и развивается.', 'Розклади, що адаптуються до твого унікального енергетичного підпису. Оракул навчається на твоїх запитах і розвивається.', 'Spreads that adapt to your unique energetic signature. The oracle learns from your requests and evolves.'],
    ['Древние Знания', 'Давні Знання', 'Ancient Knowledge'],
    ['Черпая из герметических традиций и глубоких эзотерических учений. Полная символика колоды из 78 карт — расшифрована.', 'Спираючись на герметичні традиції та глибокі езотеричні вчення. Повна символіка колоди з 78 карт — розшифрована.', 'Drawing from Hermetic traditions and deep esoteric teachings. The full symbolism of the 78-card deck is decoded.'],
    ['Шагни за Завесу', 'Зроби крок за Завісу', 'Step Beyond the Veil'],
    ['Начни своё путешествие сегодня. Позволь картам раскрыть то, что скрыто на виду.', 'Почни свою подорож сьогодні. Дозволь картам розкрити те, що приховане на видноті.', 'Begin your journey today. Let the cards reveal what is hidden in plain sight.'],
    ['НАЧАТЬ ПУТЬ', 'ПОЧАТИ ШЛЯХ', 'BEGIN THE PATH'],
    ['Вытяни карту', 'Витягни карту', 'Draw a Card'],
    ['Нажми на любую карту и получи послание прямо сейчас. Каждый раз — новый расклад.', 'Натисни на будь-яку карту й отримай послання просто зараз. Щоразу — новий розклад.', 'Tap any card and receive a message right now. Every time is a new spread.'],
    ['ПОЛУЧИТЬ ПОЛНЫЙ РАСКЛАД', 'ОТРИМАТИ ПОВНИЙ РОЗКЛАД', 'GET A FULL SPREAD'],
    ['Бесплатно · Без регистрации · Прямо в Telegram', 'Безкоштовно · Без реєстрації · Просто в Telegram', 'Free · No registration · Directly in Telegram'],
    ['Бот, который понимает', 'Бот, який розуміє', 'A Bot That Understands'],
    ['Не просто текст — живой диалог. Задавай уточняющие вопросы, углубляйся в карты и получай персональные ответы.', 'Не просто текст — живий діалог. Став уточнювальні запитання, заглиблюйся в карти й отримуй персональні відповіді.', 'Not just text, but a living dialogue. Ask follow-up questions, go deeper into the cards, and receive personal answers.'],
    ['онлайн', 'онлайн', 'online'],
    ['Введи свой вопрос...', 'Введи своє запитання...', 'Enter your question...'],
    ['Диалоговый формат', 'Діалоговий формат', 'Conversational Format'],
    ['Задавай вопросы, уточняй и углубляйся в расклад в режиме переписки.', 'Став запитання, уточнюй і заглиблюйся в розклад у форматі переписки.', 'Ask, clarify, and go deeper into the spread through chat.'],
    ['Глубокое толкование', 'Глибоке тлумачення', 'Deep Interpretation'],
    ['Каждая карта раскрывается в контексте твоего конкретного вопроса.', 'Кожна карта розкривається в контексті твого конкретного запитання.', 'Each card is revealed in the context of your specific question.'],
    ['История раскладов', 'Історія розкладів', 'Spread History'],
    ['Все расклады сохраняются. Возвращайся и отслеживай, как меняется твой путь.', 'Усі розклади зберігаються. Повертайся й відстежуй, як змінюється твій шлях.', 'All spreads are saved. Return and track how your path changes.'],
    ['Ритуал Раскрыт', 'Ритуал Розкрито', 'The Ritual Revealed'],
    ['Шагни за завесу. Наш эфирный оракул проведёт тебя через бесшовное единение с древними архетипами.', 'Зроби крок за завісу. Наш ефірний оракул проведе тебе крізь плавне єднання з давніми архетипами.', 'Step beyond the veil. Our ethereal oracle guides you through a seamless union with ancient archetypes.'],
    ['Шаг первый', 'Крок перший', 'Step One'],
    ['Выберите Расклад', 'Оберіть Розклад', 'Choose a Spread'],
    ['Выбери схему, соответствующую твоему запросу. От ясности одной карты до глубины Кельтского Креста — здесь начинается структура твоего откровения.', 'Обери схему, що відповідає твоєму запиту. Від ясності однієї карти до глибини Кельтського Хреста — тут починається структура твого одкровення.', 'Choose a layout that matches your request. From the clarity of one card to the depth of the Celtic Cross, the structure of your revelation begins here.'],
    ['Шаг второй', 'Крок другий', 'Step Two'],
    ['Сосредоточьте Энергию', 'Зосередьте Енергію', 'Focus the Energy'],
    ['Удержи вопрос в мысленном взоре. Пока цифровая колода тасуется, твоё намерение переплетается с алгоритмом, притягивая нужные архетипы для твоего пути.', 'Утримуй запитання в уяві. Поки цифрова колода тасується, твій намір переплітається з алгоритмом, притягуючи потрібні архетипи для твого шляху.', 'Hold the question in your mind. As the digital deck shuffles, your intention intertwines with the algorithm, drawing the archetypes your path needs.'],
    ['Шаг третий', 'Крок третій', 'Step Three'],
    ['Получите Древнюю Мудрость', 'Отримайте Давню Мудрість', 'Receive Ancient Wisdom'],
    ['Aether Бот переводит символический язык карт в глубокие, практически применимые озарения, доставляемые через плавный и захватывающий диалоговый интерфейс.', 'Aether Бот перекладає символічну мову карт у глибокі, практично застосовні осяяння через плавний і захопливий діалоговий інтерфейс.', 'Aether Bot translates the symbolic language of the cards into deep, practical insights through a smooth and immersive chat interface.'],
    ['«Верховная Жрица выходит из пустоты. Она просит тебя доверять своей интуиции в этом деле. Ответы уже внутри тебя — скрытые лишь сомнением.»', '«Верховна Жриця виходить із порожнечі. Вона просить тебе довіряти інтуїції в цій справі. Відповіді вже всередині тебе — їх приховує лише сумнів.»', '"The High Priestess emerges from the void. She asks you to trust your intuition in this matter. The answers are already within you, hidden only by doubt."'],
    ['НАЧАТЬ РАСКЛАД', 'ПОЧАТИ РОЗКЛАД', 'START A SPREAD'],
    ['Священные Расклады', 'Священні Розклади', 'Sacred Spreads'],
    ['Выбери схему, созвучную космическим течениям. Каждый расклад предлагает уникальный взгляд на твою судьбу.', 'Обери схему, співзвучну космічним течіям. Кожен розклад пропонує унікальний погляд на твою долю.', 'Choose a layout attuned to cosmic currents. Each spread offers a unique view of your fate.'],
    ['1 Карта', '1 Карта', '1 Card'],
    ['3 Карты', '3 Карти', '3 Cards'],
    ['5 Карт', '5 Карт', '5 Cards'],
    ['10 Карт', '10 Карт', '10 Cards'],
    ['Карта дня', 'Карта дня', 'Card of the Day'],
    ['Одна карта, освещающая энергии, формирующие твой день. Бесплатное наставление для центрирования духа и подготовки к бодрствующему миру.', 'Одна карта, що освітлює енергії твого дня. Безкоштовна настанова для центрування духу й підготовки до активного світу.', 'One card illuminating the energies shaping your day. Free guidance to center your spirit and prepare for the waking world.'],
    ['Любовь и Связи', 'Любов і Зв’язки', 'Love and Connections'],
    ['Глубокое понимание отношений. Исследуй динамические силы между двумя душами, раскрой скрытые препятствия и возможные пути в будущее.', 'Глибоке розуміння стосунків. Досліди динамічні сили між двома душами, розкрий приховані перешкоди й можливі шляхи в майбутнє.', 'Deep understanding of relationships. Explore the forces between two souls, reveal hidden obstacles, and possible paths forward.'],
    ['Карьерный Путь', 'Кар’єрний Шлях', 'Career Path'],
    ['Навигация в профессиональном росте и амбициях. Прокладывай путь материального развития и определяй силы, помогающие или мешающие успеху.', 'Навігація у професійному зростанні й амбіціях. Прокладай шлях матеріального розвитку та визначай сили, що допомагають або заважають успіху.', 'Navigation for professional growth and ambition. Chart material progress and identify the forces helping or blocking success.'],
    ['Кельтский Крест', 'Кельтський Хрест', 'Celtic Cross'],
    ['Полный расклад жизни. Этот древний метод даёт глубокий, многоуровневый взгляд на твою текущую ситуацию и окружающие влияния.', 'Повний розклад життя. Цей давній метод дає глибокий, багаторівневий погляд на твою поточну ситуацію та навколишні впливи.', 'A full life spread. This ancient method gives a deep, layered view of your current situation and surrounding influences.'],
    ['Попробовать', 'Спробувати', 'Try it'],
    ['Какой расклад тебе нужен?', 'Який розклад тобі потрібен?', 'Which Spread Do You Need?'],
    ['3 вопроса — и оракул подберёт идеальный расклад под твою ситуацию.', '3 запитання — і оракул підбере ідеальний розклад для твоєї ситуації.', 'Three questions and the oracle will choose the ideal spread for your situation.'],
    ['Что тебя беспокоит прямо сейчас?', 'Що тебе турбує просто зараз?', 'What is concerning you right now?'],
    ['Выбери то, что ближе всего к твоей ситуации', 'Обери те, що найближче до твоєї ситуації', 'Choose what is closest to your situation'],
    ['Любовь и отношения', 'Любов і стосунки', 'Love and relationships'],
    ['Партнёр, чувства, связи', 'Партнер, почуття, зв’язки', 'Partner, feelings, bonds'],
    ['Карьера и деньги', 'Кар’єра і гроші', 'Career and money'],
    ['Работа, цели, амбиции', 'Робота, цілі, амбіції', 'Work, goals, ambition'],
    ['Общее направление', 'Загальний напрям', 'General direction'],
    ['Жизнь, путь, развитие', 'Життя, шлях, розвиток', 'Life, path, growth'],
    ['Внутреннее состояние', 'Внутрішній стан', 'Inner state'],
    ['Самопознание, энергия', 'Самопізнання, енергія', 'Self-knowledge, energy'],
    ['Насколько глубокий ответ тебе нужен?', 'Наскільки глибока відповідь тобі потрібна?', 'How deep should the answer be?'],
    ['От этого зависит количество карт в раскладе', 'Від цього залежить кількість карт у розкладі', 'This determines the number of cards in the spread'],
    ['Быстрый ориентир', 'Швидкий орієнтир', 'Quick guidance'],
    ['Одна чёткая подсказка', 'Одна чітка підказка', 'One clear hint'],
    ['Детальный анализ', 'Детальний аналіз', 'Detailed analysis'],
    ['Полная картина ситуации', 'Повна картина ситуації', 'The full picture'],
    ['Как давно тебя это беспокоит?', 'Як давно це тебе турбує?', 'How long has this been on your mind?'],
    ['Поможет выбрать точный тип расклада', 'Допоможе обрати точний тип розкладу', 'This helps choose the right spread type'],
    ['Только что возникло', 'Щойно виникло', 'It just came up'],
    ['Нужен ответ прямо сейчас', 'Потрібна відповідь просто зараз', 'I need an answer now'],
    ['Давно на уме', 'Давно в думках', 'It has been on my mind'],
    ['Требует глубокого осмысления', 'Потребує глибокого осмислення', 'It needs deep reflection'],
    ['РЕКОМЕНДАЦИЯ ОРАКУЛА', 'РЕКОМЕНДАЦІЯ ОРАКУЛА', 'ORACLE RECOMMENDATION'],
    ['НАЧАТЬ ЭТОТ РАСКЛАД', 'ПОЧАТИ ЦЕЙ РОЗКЛАД', 'START THIS SPREAD'],
    ['← Пройти заново', '← Пройти ще раз', '← Start over'],
    ['Отголоски Пустоты', 'Відлуння Порожнечі', 'Echoes of the Void'],
    ['Прочти опыт тех, кто искал наставления у эфира, и найди ответы на вопросы, что таятся в тени.', 'Прочитай досвід тих, хто шукав настанов у ефіру, і знайди відповіді на питання, що ховаються в тіні.', 'Read the experiences of those who sought guidance from the ether and find answers to questions hidden in shadow.'],
    ['Отзывы', 'Відгуки', 'Reviews'],
    ['Оставить отзыв', 'Залишити відгук', 'Leave a Review'],
    ['ПОДЕЛИСЬ СВОИМ ОПЫТОМ С ОРАКУЛОМ', 'ПОДІЛИСЯ СВОЇМ ДОСВІДОМ З ОРАКУЛОМ', 'SHARE YOUR EXPERIENCE WITH THE ORACLE'],
    ['ТВОЯ ОЦЕНКА', 'ТВОЯ ОЦІНКА', 'YOUR RATING'],
    ['ИМЯ', 'ІМ’Я', 'NAME'],
    ['ОТЗЫВ', 'ВІДГУК', 'REVIEW'],
    ['Как тебя зовут?', 'Як тебе звати?', 'What is your name?'],
    ['Расскажи о своём опыте с ботом...', 'Розкажи про свій досвід із ботом...', 'Tell us about your experience with the bot...'],
    ['ОТПРАВИТЬ ОТЗЫВ ✦', 'НАДІСЛАТИ ВІДГУК ✦', 'SEND REVIEW ✦'],
    ['Часто задаваемые вопросы', 'Поширені запитання', 'Frequently Asked Questions'],
    ['Как работает цифровой расклад?', 'Як працює цифровий розклад?', 'How does a digital spread work?'],
    ['Наш движок использует сложную алгоритмическую интерпретацию традиционных раскладов таро в сочетании с пониманием архетипической символики для вытягивания и толкования карт на основе твоего намерения.', 'Наш рушій використовує складну алгоритмічну інтерпретацію традиційних розкладів таро разом із розумінням архетипної символіки, щоб витягувати й тлумачити карти на основі твого наміру.', 'Our engine uses an advanced algorithmic interpretation of traditional tarot spreads, combined with archetypal symbolism, to draw and interpret cards from your intention.'],
    ['Расклады действительно случайны?', 'Розклади справді випадкові?', 'Are the spreads truly random?'],
    ['Выбор карт использует криптографически защищённую случайность, обеспечивая подлинную непредсказуемость. Слой интерпретации затем вплетает смысл из выбранных архетипов в контексте твоего заявленного намерения.', 'Вибір карт використовує криптографічно захищену випадковість, забезпечуючи справжню непередбачуваність. Далі шар інтерпретації вплітає сенс обраних архетипів у контекст твого наміру.', 'Card selection uses cryptographically secure randomness for real unpredictability. The interpretation layer then weaves meaning from the chosen archetypes into the context of your stated intention.'],
    ['Можно ли сохранить расклады для последующего осмысления?', 'Чи можна зберегти розклади для подальшого осмислення?', 'Can I save spreads for later reflection?'],
    ['Да. Все расклады в Telegram-боте сохраняются в истории переписки, позволяя возвращаться к прошлым раскладам, отслеживать повторяющиеся темы и наблюдать, как наставления оракула проявляются со временем.', 'Так. Усі розклади в Telegram-боті зберігаються в історії переписки, щоб ти міг повертатися до них, відстежувати повторювані теми й бачити, як настанови оракула проявляються з часом.', 'Yes. All spreads in the Telegram bot are saved in chat history, so you can return to past readings, track recurring themes, and observe how the oracle guidance unfolds over time.'],
    ['Сервис бесплатный?', 'Сервіс безкоштовний?', 'Is the service free?'],
    ['Расклад «Карта дня» полностью бесплатен. Более глубокие расклады — «Любовь и Связи», «Карьерный Путь» и «Кельтский Крест» — доступны по премиум-подписке, открывающей безлимитный доступ ко всей глубине оракула.', 'Розклад «Карта дня» повністю безкоштовний. Глибші розклади — «Любов і Зв’язки», «Кар’єрний Шлях» і «Кельтський Хрест» — доступні за преміум-підпискою, що відкриває безлімітний доступ до всієї глибини оракула.', 'The Card of the Day spread is completely free. Deeper spreads, Love and Connections, Career Path, and Celtic Cross, are available with a premium subscription that unlocks unlimited access to the oracle’s depth.'],
    ['Твоя судьба ждёт.', 'Твоя доля чекає.', 'Your Fate Awaits.'],
    ['НАЧАТЬ РАСКЛАД СЕЙЧАС', 'ПОЧАТИ РОЗКЛАД ЗАРАЗ', 'START A SPREAD NOW'],
    ['Открыть бота в Telegram', 'Відкрити бота в Telegram', 'Open the bot in Telegram'],
    ['Открыть в Telegram', 'Відкрити в Telegram', 'Open in Telegram'],
    ['ПУТЬ ОТШЕЛЬНИКА', 'ШЛЯХ ВІДЛЮДНИКА', 'HERMIT PATH'],
    ['НЕБЕСНЫЕ УСЛОВИЯ', 'НЕБЕСНІ УМОВИ', 'CELESTIAL TERMS'],
    ['ПОКРОВ ТАЙНЫ', 'ПОКРИВ ТАЄМНИЦІ', 'VEIL OF MYSTERY'],
    ['ПОДДЕРЖКА ОРАКУЛА', 'ПІДТРИМКА ОРАКУЛА', 'ORACLE SUPPORT'],
    ['© 2024 AETHER TAROT. КАК ВВЕРХУ, ТАК И ВНИЗУ.', '© 2024 AETHER TAROT. ЯК УГОРІ, ТАК І ВНИЗУ.', '© 2024 AETHER TAROT. AS ABOVE, SO BELOW.'],
    ['Пользовательское соглашение', 'Користувацька угода', 'User Agreement'],
    ['1. Общие положения', '1. Загальні положення', '1. General Terms'],
    ['Настоящее Пользовательское соглашение регулирует отношения между сервисом', 'Ця Користувацька угода регулює відносини між сервісом', 'This User Agreement governs the relationship between the service'],
    ['и пользователем, использующим данный веб-сайт и связанный Telegram-бот.', 'і користувачем, який використовує цей вебсайт та пов’язаний Telegram-бот.', 'and the user who uses this website and the connected Telegram bot.'],
    ['Используя сервис, вы подтверждаете, что ознакомились с настоящим Соглашением и принимаете его условия в полном объёме.', 'Користуючись сервісом, ви підтверджуєте, що ознайомилися з цією Угодою та повністю приймаєте її умови.', 'By using the service, you confirm that you have read this Agreement and accept its terms in full.'],
    ['2. Возраст пользователя', '2. Вік користувача', '2. User Age'],
    ['Сервис предназначен для лиц, достигших', 'Сервіс призначений для осіб, які досягли', 'The service is intended for people who are at least'],
    ['18 лет', '18 років', '18 years old'],
    ['Используя сервис, вы подтверждаете, что соответствуете данному требованию.', 'Користуючись сервісом, ви підтверджуєте, що відповідаєте цій вимозі.', 'By using the service, you confirm that you meet this requirement.'],
    ['. Используя сервис, вы подтверждаете, что соответствуете данному требованию.', '. Користуючись сервісом, ви підтверджуєте, що відповідаєте цій вимозі.', '. By using the service, you confirm that you meet this requirement.'],
    ['3. Характер предоставляемых услуг', '3. Характер послуг', '3. Nature of Services'],
    ['Все предсказания, расклады карт Таро и интерпретации носят исключительно', 'Усі передбачення, розклади карт Таро та інтерпретації мають виключно', 'All predictions, tarot spreads, and interpretations are provided strictly for'],
    ['развлекательный и ознакомительный характер', 'розважальний та ознайомчий характер', 'entertainment and informational purposes'],
    ['Сервис не является источником медицинских, юридических, финансовых или психологических рекомендаций.', 'Сервіс не є джерелом медичних, юридичних, фінансових чи психологічних рекомендацій.', 'The service is not a source of medical, legal, financial, or psychological advice.'],
    ['. Сервис не является источником медицинских, юридических, финансовых или психологических рекомендаций.', '. Сервіс не є джерелом медичних, юридичних, фінансових чи психологічних рекомендацій.', '. The service is not a source of medical, legal, financial, or psychological advice.'],
    ['Результаты гаданий не следует воспринимать как руководство к принятию важных жизненных решений.', 'Результати ворожінь не слід сприймати як керівництво для важливих життєвих рішень.', 'Reading results should not be treated as guidance for important life decisions.'],
    ['4. Сбор и обработка персональных данных', '4. Збір та обробка персональних даних', '4. Personal Data Collection and Processing'],
    ['При авторизации через Telegram мы получаем и храним следующие данные: ваш Telegram ID, имя, имя пользователя (username) и фотографию профиля. Эти данные используются исключительно для идентификации в сервисе.', 'Під час авторизації через Telegram ми отримуємо й зберігаємо такі дані: ваш Telegram ID, ім’я, username і фото профілю. Ці дані використовуються виключно для ідентифікації в сервісі.', 'When you sign in through Telegram, we receive and store your Telegram ID, name, username, and profile photo. This data is used only to identify you in the service.'],
    ['В целях защиты от злоупотреблений хранится обезличенный хеш IP-адреса — не сам IP-адрес. Хеш не позволяет установить личность пользователя.', 'Для захисту від зловживань зберігається знеособлений хеш IP-адреси, а не сама IP-адреса. Хеш не дозволяє встановити особу користувача.', 'To prevent abuse, we store an anonymized hash of the IP address, not the IP address itself. The hash cannot identify the user.'],
    ['5. Конфиденциальность', '5. Конфіденційність', '5. Privacy'],
    ['Мы не передаём ваши персональные данные третьим лицам, не продаём и не используем в рекламных целях. Данные хранятся на защищённых серверах Railway.', 'Ми не передаємо ваші персональні дані третім особам, не продаємо їх і не використовуємо в рекламних цілях. Дані зберігаються на захищених серверах Railway.', 'We do not share, sell, or use your personal data for advertising. Data is stored on protected Railway servers.'],
    ['6. Отзывы пользователей', '6. Відгуки користувачів', '6. User Reviews'],
    ['Публикуя отзыв, вы соглашаетесь с тем, что он может быть виден другим посетителям сайта. Администрация вправе удалять отзывы, содержащие оскорбления, спам или заведомо ложную информацию.', 'Публікуючи відгук, ви погоджуєтесь, що він може бути видимим іншим відвідувачам сайту. Адміністрація може видаляти відгуки з образами, спамом або свідомо неправдивою інформацією.', 'By publishing a review, you agree that it may be visible to other site visitors. The administration may remove reviews containing insults, spam, or knowingly false information.'],
    ['7. Ограничение ответственности', '7. Обмеження відповідальності', '7. Limitation of Liability'],
    ['Сервис предоставляется «как есть». Администрация не несёт ответственности за любой ущерб, возникший вследствие использования или невозможности использования сервиса.', 'Сервіс надається «як є». Адміністрація не несе відповідальності за будь-яку шкоду, що виникла внаслідок використання або неможливості використання сервісу.', 'The service is provided “as is.” The administration is not responsible for any damage arising from use or inability to use the service.'],
    ['8. Изменение соглашения', '8. Зміна угоди', '8. Agreement Changes'],
    ['Мы вправе изменять условия настоящего Соглашения. Продолжение использования сервиса означает принятие новых условий.', 'Ми маємо право змінювати умови цієї Угоди. Подальше використання сервісу означає прийняття нових умов.', 'We may change the terms of this Agreement. Continued use of the service means acceptance of the new terms.'],
    ['9. Контакт', '9. Контакт', '9. Contact'],
    ['По вопросам обработки персональных данных обращайтесь через Telegram-бот.', 'З питань обробки персональних даних звертайтесь через Telegram-бот.', 'For questions about personal data processing, contact us through the Telegram bot.'],
    ['СОГЛАШЕНИЕ ПРИНЯТО', 'УГОДУ ПРИЙНЯТО', 'AGREEMENT ACCEPTED'],
    ['ПЕРЕЙТИ НА САЙТ', 'ПЕРЕЙТИ НА САЙТ', 'GO TO SITE'],
    ['Сменить аккаунт', 'Змінити акаунт', 'Switch account'],
    ['Добро пожаловать в Aether Tarot.', 'Ласкаво просимо до Aether Tarot.', 'Welcome to Aether Tarot.'],
    ['Вселенная раскрывает свои карты...', 'Всесвіт розкриває свої карти...', 'The universe reveals its cards...'],
    ['Войти через Telegram', 'Увійти через Telegram', 'Sign in with Telegram'],
    ['Виджет входа не работает внутри Telegram.', 'Віджет входу не працює всередині Telegram.', 'The login widget does not work inside Telegram.'],
    ['Открой страницу в браузере телефона.', 'Відкрий сторінку в браузері телефону.', 'Open the page in your phone browser.'],
    ['ОТКРЫТЬ В БРАУЗЕРЕ', 'ВІДКРИТИ В БРАУЗЕРІ', 'OPEN IN BROWSER'],
    ['После входа вернись в Telegram.', 'Після входу повернись у Telegram.', 'After signing in, return to Telegram.'],
    ['Чтобы принять соглашение — войдите через Telegram', 'Щоб прийняти угоду — увійдіть через Telegram', 'To accept the agreement, sign in with Telegram'],
    ['Мы получим только ваше имя и аватар. Пароль и переписка не передаются.', 'Ми отримаємо лише ваше ім’я та аватар. Пароль і листування не передаються.', 'We only receive your name and avatar. Your password and chats are not shared.'],
    ['Добавьте переменную', 'Додайте змінну', 'Add the variable'],
    ['в Railway Variables.', 'у Railway Variables.', 'in Railway Variables.'],
    ['Ошибка загрузки виджета. Обновите страницу.', 'Помилка завантаження віджета. Оновіть сторінку.', 'Widget loading error. Refresh the page.'],
    ['ПРИНЯТЬ СОГЛАШЕНИЕ ✦', 'ПРИЙНЯТИ УГОДУ ✦', 'ACCEPT AGREEMENT ✦'],
    ['Отклонить и вернуться на сайт', 'Відхилити й повернутися на сайт', 'Decline and return to site'],
    ['Ошибка авторизации', 'Помилка авторизації', 'Authorization error'],
    ['Ошибка соединения. Попробуй ещё раз.', 'Помилка з’єднання. Спробуй ще раз.', 'Connection error. Try again.'],
    ['Ошибка', 'Помилка', 'Error'],
    ['Ошибка соединения', 'Помилка з’єднання', 'Connection error'],
    ['Пользователь', 'Користувач', 'User'],
    ['Статистика', 'Статистика', 'Stats'],
    ['ДНЕЙ С НАМИ', 'ДНІВ З НАМИ', 'DAYS WITH US'],
    ['СТРИК КАРТ', 'СТРІК КАРТ', 'CARD STREAK'],
    ['КАРТ ОТКРЫТО', 'КАРТ ВІДКРИТО', 'CARDS OPENED'],
    ['МОИ ОТЗЫВЫ', 'МОЇ ВІДГУКИ', 'MY REVIEWS'],
    ['НАЧАТЬ РАСКЛАД В БОТЕ', 'ПОЧАТИ РОЗКЛАД У БОТІ', 'START A SPREAD IN THE BOT'],
    ['НАЖМИ ЧТОБЫ ОТКРЫТЬ', 'НАТИСНИ, ЩОБ ВІДКРИТИ', 'TAP TO OPEN'],
    ['Каждый день вселенная приготовила для тебя послание. Нажми на карту, чтобы узнать его.', 'Щодня всесвіт готує для тебе послання. Натисни на карту, щоб дізнатися його.', 'Every day the universe prepares a message for you. Tap the card to reveal it.'],
    ['История карт', 'Історія карт', 'Card History'],
    ['Знак зодиака', 'Знак зодіаку', 'Zodiac Sign'],
    ['Нумерология', 'Нумерологія', 'Numerology'],
    ['День', 'День', 'Day'],
    ['Месяц', 'Місяць', 'Month'],
    ['Год', 'Рік', 'Year'],
    ['Январь', 'Січень', 'January'],
    ['Февраль', 'Лютий', 'February'],
    ['Март', 'Березень', 'March'],
    ['Апрель', 'Квітень', 'April'],
    ['Май', 'Травень', 'May'],
    ['Июнь', 'Червень', 'June'],
    ['Июль', 'Липень', 'July'],
    ['Август', 'Серпень', 'August'],
    ['Сентябрь', 'Вересень', 'September'],
    ['Октябрь', 'Жовтень', 'October'],
    ['Ноябрь', 'Листопад', 'November'],
    ['Декабрь', 'Грудень', 'December'],
    ['РАССЧИТАТЬ', 'РОЗРАХУВАТИ', 'CALCULATE'],
    ['Достижения', 'Досягнення', 'Achievements'],
    ['Мои отзывы', 'Мої відгуки', 'My Reviews'],
    ['Загрузка...', 'Завантаження...', 'Loading...'],
    ['ОПАСНАЯ ЗОНА', 'НЕБЕЗПЕЧНА ЗОНА', 'DANGER ZONE'],
    ['Удаление аккаунта необратимо. Твои отзывы будут анонимизированы, история карт — удалена.', 'Видалення акаунта незворотне. Твої відгуки буде анонімізовано, історію карт — видалено.', 'Account deletion is irreversible. Your reviews will be anonymized and card history will be deleted.'],
    ['УДАЛИТЬ АККАУНТ', 'ВИДАЛИТИ АКАУНТ', 'DELETE ACCOUNT'],
    ['Сегодня', 'Сьогодні', 'Today'],
    ['Знак зодиака сохранён', 'Знак зодіаку збережено', 'Zodiac sign saved'],
    ['Карта жизни:', 'Карта життя:', 'Life card:'],
    ['Выбери день, месяц и год', 'Обери день, місяць і рік', 'Choose day, month, and year'],
    ['Дата рождения сохранена', 'Дату народження збережено', 'Birth date saved'],
    ['нажми на карту, чтобы увидеть послание снова', 'натисни на карту, щоб знову побачити послання', 'tap the card to see the message again'],
    ['Уже открыта сегодня — нажми, чтобы посмотреть', 'Уже відкрита сьогодні — натисни, щоб переглянути', 'Already opened today, tap to view'],
    ['Первый шаг', 'Перший крок', 'First Step'],
    ['Зарегистрировался на сайте', 'Зареєструвався на сайті', 'Registered on the site'],
    ['Голос оракула', 'Голос оракула', 'Oracle Voice'],
    ['Оставил первый отзыв', 'Залишив перший відгук', 'Left the first review'],
    ['Ночной страж', 'Нічний вартовий', 'Night Watcher'],
    ['Открыл карту дня', 'Відкрив карту дня', 'Opened the card of the day'],
    ['3 дня подряд', '3 дні поспіль', '3 Days in a Row'],
    ['Открывал карту 3 дня подряд', 'Відкривав карту 3 дні поспіль', 'Opened a card 3 days in a row'],
    ['Неделя силы', 'Тиждень сили', 'Week of Strength'],
    ['Открывал карту 7 дней подряд', 'Відкривав карту 7 днів поспіль', 'Opened a card 7 days in a row'],
    ['Знаток себя', 'Знавець себе', 'Self-Knower'],
    ['Выбрал знак зодиака', 'Обрав знак зодіаку', 'Selected a zodiac sign'],
    ['Числа судьбы', 'Числа долі', 'Numbers of Fate'],
    ['Рассчитал число жизненного пути', 'Розрахував число життєвого шляху', 'Calculated life path number'],
    ['Старожил', 'Старожил', 'Long-Timer'],
    ['С нами больше 30 дней', 'З нами понад 30 днів', 'With us for more than 30 days'],
    ['Хранитель', 'Хранитель', 'Keeper'],
    ['Принял пользовательское соглашение', 'Прийняв користувацьку угоду', 'Accepted the user agreement'],
    ['Коллекционер', 'Колекціонер', 'Collector'],
    ['Открыл 10 разных карт дня', 'Відкрив 10 різних карт дня', 'Opened 10 different daily cards'],
    ['Ты ещё не оставлял отзывов', 'Ти ще не залишав відгуків', 'You have not left reviews yet'],
    ['Удалить этот отзыв?', 'Видалити цей відгук?', 'Delete this review?'],
    ['Отзыв удалён', 'Відгук видалено', 'Review deleted'],
    ['Удалить аккаунт? Это необратимо.', 'Видалити акаунт? Це незворотно.', 'Delete account? This cannot be undone.'],
    ['Вы уверены? Все данные будут удалены.', 'Ви впевнені? Усі дані буде видалено.', 'Are you sure? All data will be deleted.'],
    ['ВЕРИФИЦИРОВАН', 'ВЕРИФІКОВАНО', 'VERIFIED'],
    ['Ошибка загрузки.', 'Помилка завантаження.', 'Loading error.'],
    ['На сайт', 'На сайт', 'To site'],
    ['Новолуние', 'Молодик', 'New moon'],
    ['Время новых начинаний и намерений', 'Час нових починань і намірів', 'A time for new beginnings and intentions'],
    ['Растущая луна', 'Зростаючий місяць', 'Waxing crescent'],
    ['Энергия роста — притягивай желаемое', 'Енергія зростання — притягуй бажане', 'Energy of growth, attract what you desire'],
    ['Первая четверть', 'Перша чверть', 'First quarter'],
    ['Время решительных действий', 'Час рішучих дій', 'A time for decisive action'],
    ['Прибывающая луна', 'Прибуваючий місяць', 'Waxing moon'],
    ['Сила нарастает — действуй смелее', 'Сила зростає — дій сміливіше', 'Power is rising, act boldly'],
    ['Пик энергии. Лучшее время для расклада!', 'Пік енергії. Найкращий час для розкладу!', 'Peak energy. The best time for a spread!'],
    ['Убывающая луна', 'Спадний місяць', 'Waning moon'],
    ['Время отпускания и завершений', 'Час відпускання й завершень', 'A time for release and completion'],
    ['Последняя четверть', 'Остання чверть', 'Last quarter'],
    ['Подведение итогов и очищение', 'Підбиття підсумків і очищення', 'Reflection and cleansing'],
    ['Старая луна', 'Старий місяць', 'Old moon'],
    ['Время покоя и глубокого осмысления', 'Час спокою й глибокого осмислення', 'A time for rest and deep reflection'],
    ['Сейчас', 'Зараз', 'Now'],
    ['Полнолуние!', 'Повня!', 'Full moon!'],
    ['Ужасно', 'Жахливо', 'Terrible'],
    ['Плохо', 'Погано', 'Bad'],
    ['Нормально', 'Нормально', 'Okay'],
    ['Хорошо', 'Добре', 'Good'],
    ['Отлично!', 'Чудово!', 'Excellent!'],
    ['Будь первым — оставь отзыв ниже', 'Будь першим — залиш відгук нижче', 'Be the first, leave a review below'],
    ['Не удалось загрузить отзывы', 'Не вдалося завантажити відгуки', 'Could not load reviews'],
    ['Выбери оценку звёздами', 'Обери оцінку зірками', 'Choose a star rating'],
    ['Напиши своё имя', 'Напиши своє ім’я', 'Enter your name'],
    ['Напиши текст отзыва', 'Напиши текст відгуку', 'Write review text'],
    ['ОТПРАВЛЯЕМ...', 'НАДСИЛАЄМО...', 'SENDING...'],
    ['✦ Отзыв опубликован — благодарим!', '✦ Відгук опубліковано — дякуємо!', '✦ Review published, thank you!'],
    ['Войди через Telegram, чтобы оставить отзыв —', 'Увійди через Telegram, щоб залишити відгук —', 'Sign in through Telegram to leave a review —'],
    ['Войти', 'Увійти', 'Sign in'],
    ['попробуй ещё раз', 'спробуй ще раз', 'try again'],
    ['Ошибка соединения с сервером', 'Помилка з’єднання з сервером', 'Server connection error'],
    ['Вот что говорит оракул:', 'Ось що говорить оракул:', 'Here is what the oracle says:'],
    ['Что ждёт меня в карьере?', 'Що чекає мене в кар’єрі?', 'What awaits me in my career?'],
    ['Инициирую расклад «Карьерный путь» 🃏\nСосредоточься на своём вопросе...', 'Починаю розклад «Кар’єрний шлях» 🃏\nЗосередься на своєму запитанні...', 'Initiating the Career Path spread 🃏\nFocus on your question...'],
    ['⚡ Колесо Фортуны (X)', '⚡ Колесо Фортуни (X)', '⚡ Wheel of Fortune (X)'],
    ['Перемены на горизонте. Возможность, которую ты ждал, стремительно приближается. Действуй — не медли.', 'Зміни на горизонті. Можливість, на яку ти чекав, швидко наближається. Дій — не зволікай.', 'Change is on the horizon. The opportunity you have been waiting for is approaching fast. Act, do not delay.'],
    ['А что мне сейчас мешает?', 'А що мені зараз заважає?', 'What is blocking me right now?'],
    ['Аркан Повешенный указывает: ты сам откладываешь решение. Отпусти старые убеждения — и путь откроется.', 'Аркан Повішений вказує: ти сам відкладаєш рішення. Відпусти старі переконання — і шлях відкриється.', 'The Hanged Man indicates that you are delaying the decision yourself. Release old beliefs and the path will open.'],
    ['Шут', 'Блазень', 'The Fool'],
    ['Верховная Жрица', 'Верховна Жриця', 'The High Priestess'],
    ['Императрица', 'Імператриця', 'The Empress'],
    ['Император', 'Імператор', 'The Emperor'],
    ['Влюблённые', 'Закохані', 'The Lovers'],
    ['Колесница', 'Колісниця', 'The Chariot'],
    ['Сила', 'Сила', 'Strength'],
    ['Отшельник', 'Відлюдник', 'The Hermit'],
    ['Колесо Фортуны', 'Колесо Фортуни', 'Wheel of Fortune'],
    ['Справедливость', 'Справедливість', 'Justice'],
    ['Повешенный', 'Повішений', 'The Hanged Man'],
    ['Смерть', 'Смерть', 'Death'],
    ['Умеренность', 'Помірність', 'Temperance'],
    ['Звезда', 'Зірка', 'The Star'],
    ['Луна', 'Місяць', 'The Moon'],
    ['Солнце', 'Сонце', 'The Sun'],
    ['Суд', 'Суд', 'Judgement'],
    ['Мир', 'Світ', 'The World'],
  ];

  const DICT = Object.fromEntries(entries.map(([ru, uk, en]) => [ru, { uk, en }]));
  const PREFIXES = [
    ['Карта жизни: ', 'Карта життя: ', 'Life card: '],
    ['Ошибка: ', 'Помилка: ', 'Error: '],
  ];
  const textOriginals = new WeakMap();
  const attrOriginals = new WeakMap();
  const ATTRS = ['placeholder', 'title', 'aria-label'];
  let observer = null;
  let applying = false;

  function afterMicrotask(fn) {
    if (window.queueMicrotask) window.queueMicrotask(fn);
    else Promise.resolve().then(fn);
  }

  function applyWithoutObserver(fn) {
    applying = true;
    try {
      fn();
    } finally {
      afterMicrotask(() => { applying = false; });
    }
  }

  function normalize(lang) {
    lang = String(lang || '').trim().toLowerCase();
    if (lang === 'ua') return 'uk';
    return LANGS[lang] ? lang : 'ru';
  }

  function getLang() {
    return normalize(localStorage.getItem(STORAGE_KEY) || document.documentElement.lang || 'ru');
  }

  function lookup(core, lang) {
    if (lang === 'ru' || !core) return core;
    if (DICT[core]) return DICT[core][lang] || core;
    for (const [ru, uk, en] of PREFIXES) {
      if (core.startsWith(ru)) return (lang === 'uk' ? uk : en) + core.slice(ru.length);
    }
    return core;
  }

  function translateString(value, lang) {
    if (!value || lang === 'ru') return value;
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];
    const core = value.trim();
    return leading + lookup(core, lang) + trailing;
  }

  function shouldSkipText(node) {
    const parent = node.parentElement;
    return !parent || !!parent.closest('script,style,noscript,svg,canvas');
  }

  function translateTextNode(node, lang, refreshOriginal) {
    if (shouldSkipText(node) || !node.nodeValue.trim()) return;
    if (refreshOriginal || !textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
    const next = translateString(textOriginals.get(node), lang);
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function attrStore(el) {
    let store = attrOriginals.get(el);
    if (!store) {
      store = {};
      attrOriginals.set(el, store);
    }
    return store;
  }

  function translateAttr(el, attr, lang, refreshOriginal) {
    if (!el.hasAttribute || !el.hasAttribute(attr)) return;
    const store = attrStore(el);
    if (refreshOriginal || store[attr] === undefined) store[attr] = el.getAttribute(attr);
    const next = translateString(store[attr], lang);
    if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
  }

  function walk(node, lang, refreshOriginal) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node, lang, refreshOriginal);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE) return;
    if (node.matches && node.matches('script,style,noscript,svg,canvas')) return;
    if (node.nodeType === Node.ELEMENT_NODE) ATTRS.forEach((attr) => translateAttr(node, attr, lang, refreshOriginal));
    node.childNodes.forEach((child) => walk(child, lang, refreshOriginal));
  }

  function updateSwitcher(lang) {
    const switcher = document.getElementById('languageSwitcher');
    if (!switcher) return;
    switcher.querySelectorAll('button[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function translatePage(lang) {
    applyWithoutObserver(() => {
      document.documentElement.lang = LANGS[lang].html;
      document.title = translateString(textOriginals.get(document) || document.title, lang);
      walk(document.body, lang, false);
      updateSwitcher(lang);
    });
  }

  function syncLanguage(lang) {
    const token = localStorage.getItem('tg_token');
    if (!token) return;
    fetch('/api/profile/language', {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang }),
    }).catch(() => {});
  }

  function setLang(lang, options) {
    lang = normalize(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    translatePage(lang);
    if (!options || !options.skipSync) syncLanguage(lang);
  }

  function injectStyles() {
    if (document.getElementById('languageSwitcherStyles')) return;
    const style = document.createElement('style');
    style.id = 'languageSwitcherStyles';
    style.textContent = `
      .lang-switcher{display:inline-flex;align-items:center;gap:2px;padding:2px;border:1px solid var(--border,rgba(201,168,76,.22));border-radius:999px;background:rgba(12,12,15,.76);backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,.18);z-index:80}
      .lang-switcher button{min-width:30px;height:26px;border:0;border-radius:999px;background:transparent;color:var(--muted,#7A7870);font:600 .58rem 'Montserrat',sans-serif;letter-spacing:.08em;cursor:pointer;transition:background .2s,color .2s}
      .lang-switcher button.active{background:var(--gold,#C9A84C);color:var(--bg,#0C0C0F)}
      .lang-switcher button:focus-visible{outline:1px solid var(--gold-l,#E2C97E);outline-offset:2px}
      nav .lang-switcher{flex-shrink:0}
      #nav .lang-switcher{margin-left:8px;margin-right:8px}
      .nav-right .lang-switcher{margin-right:2px}
      .lang-switcher.i18n-floating{position:fixed;top:18px;right:18px}
      @media (max-width:700px){.lang-switcher button{min-width:28px;height:24px;font-size:.54rem}.lang-switcher.i18n-floating{top:14px;right:14px}}
    `;
    document.head.appendChild(style);
  }

  function createSwitcher() {
    if (document.getElementById('languageSwitcher')) return;
    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    wrap.id = 'languageSwitcher';
    wrap.setAttribute('aria-label', 'Language');
    Object.keys(LANGS).forEach((lang) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.lang = lang;
      btn.textContent = LANGS[lang].label;
      btn.title = LANGS[lang].title;
      btn.addEventListener('click', () => setLang(lang));
      wrap.appendChild(btn);
    });

    const nav = document.querySelector('nav');
    const navRight = nav && nav.querySelector('.nav-right');
    if (navRight) {
      navRight.insertBefore(wrap, navRight.firstChild);
    } else if (nav) {
      nav.insertBefore(wrap, document.getElementById('burger') || null);
    } else {
      wrap.classList.add('i18n-floating');
      document.body.appendChild(wrap);
    }
  }

  function observeMutations() {
    if (observer || !document.body) return;
    observer = new MutationObserver((mutations) => {
      if (applying) return;
      const lang = getLang();
      applyWithoutObserver(() => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => walk(node, lang, true));
          } else if (mutation.type === 'characterData') {
            translateTextNode(mutation.target, lang, true);
          } else if (mutation.type === 'attributes') {
            const store = attrOriginals.get(mutation.target);
            if (store) delete store[mutation.attributeName];
            translateAttr(mutation.target, mutation.attributeName, lang, true);
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }

  function init() {
    if (!document.body) return;
    const storedLang = localStorage.getItem(STORAGE_KEY);
    textOriginals.set(document, document.title);
    injectStyles();
    createSwitcher();
    if (storedLang) setLang(getLang(), { skipSync: true });
    else translatePage(getLang());
    if (storedLang) syncLanguage(getLang());
    observeMutations();
  }

  window.AetherI18n = {
    getLang,
    setLang,
    t: (value, lang) => translateString(value, normalize(lang || getLang())),
    syncLanguage: () => syncLanguage(getLang()),
  };

  if (document.body) {
    init();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
