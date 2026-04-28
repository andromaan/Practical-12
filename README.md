# **Доступність у SPA та автоматизація в CI/CD конвеєрах**

Сучасна парадигма веброзробки зазнала фундаментальної трансформації з переходом від традиційних багатосторінкових застосунків (Multi-Page Applications, MPA) до динамічних односторінкових систем (Single Page Applications, SPA). Ця еволюція була продиктована прагненням забезпечити користувачам безперервний, високопродуктивний досвід, що імітує роботу настільних програм.1 Проте архітектурні особливості SPA, що ґрунтуються на асинхронному завантаженні даних та маніпуляціях з Document Object Model (DOM) без перезавантаження сторінки, створюють унікальний набір бар'єрів для інклюзивності. Традиційні механізми браузера, які автоматично сповіщають допоміжні технології про зміну контексту, у середовищі SPA виявляються недієздатними.2 Це вимагає від інженерів усвідомленого підходу до проєктування інтерфейсів, де доступність інтегрована безпосередньо в логіку клієнтської маршрутизації та керування станом.

## **SPA проти стандартів інклюзивності**

У традиційній моделі вебнавігації кожна взаємодія з посиланням ініціює повний цикл запиту до сервера, що завершується рендерингом нової HTML-сторінки. Для користувачів зчитувачів екрана (screen readers) цей процес є передбачуваним: браузер скидає фокус на початок документа, оголошує заголовок сторінки (\<title\>) і починає інтерпретацію нової структури контенту.2 У SPA цей ланцюжок розривається. Коли користувач натискає на елемент навігації, JavaScript перехоплює подію, оновлює URL через History API та замінює фрагменти DOM. З точки зору допоміжної технології сторінка залишається тією ж самою, але її вміст радикально змінюється.3 Якщо розробник не реалізує програмне керування фокусом, активний елемент може або зникнути з DOM, залишаючи фокус у «невагомості», або залишитися на посиланні, яке вже не є актуальним, що дезорієнтує користувача.3

Виклики доступності в SPA не обмежуються лише навігацією. Динамічні оновлення частин інтерфейсу — віджетів, стрічок новин, індикаторів завантаження — часто відбуваються без прямої взаємодії з користувачем. Без використання спеціалізованих атрибутів ARIA (Accessible Rich Internet Applications) ці зміни залишаються непоміченими для тих, хто сприймає інтерфейс аудіально.3 Відтак, проблема доступності в SPA трансформується з питання правильної розмітки в питання складного керування станом і подіями в часі.

| Параметр порівняння | Багатосторінкові застосунки (MPA) | Односторінкові застосунки (SPA) |
| :---- | :---- | :---- |
| **Перехід між сторінками** | Повне перезавантаження документа браузером. | Маніпуляція DOM через JavaScript без перезавантаження сторінки. |
| **Керування фокусом** | Автоматичне перенаправлення на початок нової сторінки. | Вимагає ручного переміщення на новий контент. |
| **Оголошення заголовка** | Зчитується автоматично при завантаженні. | Необхідно оголошувати програмно або через Live Regions. |
| **Стан історії** | Природна підтримка кнопок «Назад/Вперед». | Емуляція через History API часто ламає фокус. |
| **Динамічні оновлення** | Рідко, зазвичай вимагають оновлення всієї сторінки. | Вимагають ARIA Live Regions для забезпечення доступності. |

## **Методологія керування фокусом при маршрутизації**

Ефективне керування фокусом є критичним компонентом доступної маршрутизації в SPA. Коли відбувається зміна маршруту, застосунок повинен виконати три основні дії: оновити заголовок документа, перемістити фокус на логічний початок нового вмісту та сповістити користувача про успішний перехід.5 Найбільш поширеною практикою є переміщення фокусу на головний заголовок сторінки (\<h1\>). Оскільки заголовки за замовчуванням не є інтерактивними елементами, їм необхідно присвоїти атрибут tabindex="-1". Це дозволяє програмно фокусувати елемент за допомогою методу .focus(), не додаючи його до природної черги табуляції клавіатури.4

Процес реалізації в сучасних фреймворках, таких як Vue.js або React, зазвичай передбачає використання хуків життєвого циклу або ефектів, що реагують на зміну шляху URL.5 Важливо забезпечити, щоб фокус переміщувався лише після того, як DOM повністю оновився. У Vue для цього використовується функція nextTick(), а в React — useEffect з порожнім масивом залежностей або залежністю від об'єкта маршруту.4 Окрім заголовка, альтернативною стратегією є фокусування на контейнері \<main\>, що дає користувачеві можливість негайно почати читання основного вмісту, або на спеціальному елементі «Skip Link» (посилання для пропуску), що полегшує навігацію до основних розділів.3

Крім того, необхідно приділяти увагу збереженню логічного порядку табуляції. Коли елементи видаляються з DOM (наприклад, при закритті бічної панелі або видаленні картки товару), фокус не повинен просто зникати. Розробник має передбачити повернення фокусу на елемент, який логічно передував видаленому, або на батьківський контейнер, щоб запобігти ситуації, коли користувач змушений починати навігацію з самого початку сторінки.2

## **ARIA Live Regions. Озвучування динамічного середовища**

У SPA контент постійно змінюється асинхронно: з'являються результати пошуку, оновлюються чати, з'являються сповіщення про помилки валідації. ARIA Live Regions — це механізм, який дозволяє розробникам позначати певні області сторінки як динамічні, що змушує зчитувачі екрана автоматично оголошувати про зміни в них.6 Ключовим атрибутом тут є aria-live, який визначає рівень пріоритетності (політесу) оголошення.

Атрибут aria-live="polite" вказує допоміжній технології зачекати, поки користувач завершить поточну дію або поки зчитувач екрана завершить поточну фразу, перш ніж оголосити оновлення. Це значення є найбільш прийнятним у більшості випадків, оскільки воно не перериває когнітивний процес користувача.6 Навпаки, aria-live="assertive" використовується для критично важливої інформації, яка потребує негайної уваги, наприклад, попередження про закінчення сесії або системні помилки. Це значення негайно перериває будь-яке поточне оголошення.3

Додаткові атрибути, такі як aria-atomic та aria-relevant, надають тонкий контроль над тим, що саме буде озвучено. aria-atomic="true" гарантує, що при зміні будь-якої частини живого регіону буде прочитано весь його вміст, що критично для забезпечення контексту.6 aria-relevant визначає типи змін, на які варто реагувати: additions (додавання нових вузлів), removals (видалення) або text (зміна текстового вмісту).6 Важливою технічною деталлю є те, що контейнер із Live Region повинен бути присутнім у DOM з моменту завантаження сторінки; динамічне додавання атрибута aria-live до вже зміненого елемента часто не спрацьовує в багатьох комбінаціях браузерів і зчитувачів екрана.12

## **Проєктування доступних інтерактивних компонентів**

Модальні діалогові вікна в SPA є одним із найскладніших викликів для забезпечення доступності. Вони вимагають не лише правильної семантичної розмітки, а й суворого керування фокусом, відомого як «Focus Trap» (пастка фокусу).9 Основна мета пастки фокусу полягає в тому, щоб утримувати навігацію клавіатурою (клавіша Tab) виключно всередині модального вікна, поки воно відкрите, запобігаючи виходу фокусу на заблокований основний вміст сторінки.13

Для повної відповідності стандартам WCAG, реалізація модального вікна повинна включати:

1. **Ролі та атрибути**: використання role="dialog" та aria-modal="true". Останній атрибут повідомляє допоміжним технологіям, що вміст поза діалогом є інертним.5  
2. **Початкове фокусування**: під час відкриття вікна фокус повинен автоматично переміщуватися на перший інтерактивний елемент або на заголовок вікна.4  
3. **Зациклення табуляції**: коли користувач натискає Tab на останньому елементі вікна, фокус має повернутися до першого, і навпаки при натисканні Shift+Tab на першому елементі.13  
4. **Закриття за допомогою клавіатури**: обов'язкова підтримка клавіші Escape для закриття діалогу.4  
5. **Відновлення фокусу**: Після закриття модального вікна фокус повинен повернутися точно на той елемент (наприклад, кнопку), який ініціював його відкриття.4

Використання сучасного HTML-елемента \<dialog\> та методу .showModal() дозволяє автоматизувати більшість цих процесів, оскільки браузери починають надавати вбудовану підтримку пасток фокусу та обробки клавіші Escape для цього тегу.13

## **Автоматизація тестування доступності**

У сучасному циклі розробки програмного забезпечення (SDLC) доступність не повинна бути етапом, що передує релізу; вона має бути частиною безперервного процесу контролю якості. Інтеграція автоматизованих аудитів у CI/CD-конвеєри (Continuous Integration / Continuous Delivery) дозволяє виявляти регресії доступності на ранніх етапах, коли вартість їх виправлення є мінімальною.17 Автоматизовані інструменти здатні виявити від 30% до 50% усіх проблем доступності, включаючи технічні помилки в розмітці, відсутність альтернативного тексту, низький контраст та неправильне використання ARIA-атрибутів.19

Основними інструментами в цій галузі є:

* **Axe-core**. Провідна бібліотека для тестування, яка славиться низьким рівнем помилкових спрацьовувань. Вона інтегрується в різні рівні тестування: від unit-тестів (jest-axe) до end-to-end тестів (cypress-axe, playwright-axe).17  
* **Pa11y**. Гнучка утиліта командного рядка, ідеальна для сканування великої кількості URL-адрес. Версія pa11y-ci дозволяє легко конфігурувати перевірки через JSON-файли та встановлювати пороги помилок, при перевищенні яких збірка в CI буде вважатися невдалою.24  
* **Lighthouse CI**: Інструмент від Google, що дозволяє відстежувати оцінки доступності (A11y Score) разом із продуктивністю та SEO в кожному pull request.17

Для SPA автоматизація має свої особливості. Оскільки контент завантажується динамічно, прості статичні сканери можуть «бачити» лише порожній кореневий елемент. Тому критично важливо використовувати інструменти, що працюють усередині справжніх або headless браузерів, здатних виконувати JavaScript та чекати на рендеринг компонентів.18

| Інструмент | Тип інтеграції | Переваги | Обмеження |
| :---- | :---- | :---- | :---- |
| **Axe-core** | Тестові фреймворки (Playwright/Cypress) | Тестує інтерактивні стани (модалки, випадаючі списки). | Вимагає написання тестових сценаріїв. |
| **Pa11y-ci** | CLI / CI Pipeline | Легке налаштування для багатьох сторінок через sitemap. | Складно тестувати складні послідовності дій. |
| **Lighthouse CI** | GitHub Actions / Dashboards | Історичний трекінг показників, комплексний аудит. | Може пропускати помилки в динамічно відкритих елементах. |
| **JSX-a11y** | ESLint Plugin | Миттєвий зворотний зв'язок під час написання коду. | Перевіряє лише статичний код, а не кінцевий DOM. |

## **Методологія проведення аудиту та пріоритезація виправлень**

Системний підхід до аудиту доступності SPA включає поєднання автоматизованих сканувань і ручного експертного тестування. Жоден автоматизований інструмент не може на 100% підтвердити відповідність стандарту WCAG, оскільки багато критеріїв успіху (Success Criteria) вимагають суб'єктивної оцінки людиною.19 Наприклад, чи є опис зображення достатньо описовим у контексті навколишнього тексту, або чи логічним є порядок фокусування елементів у складній формі.19

Процес аудиту зазвичай складається з наступних етапів:

1. **Автоматизований скан**. Використання Lighthouse або Pa11y для швидкого виявлення «низьковисячих плодів» (відсутність alt-тексту, контраст).31  
2. **Клавіатурна навігація**. Перевірка можливості доступу до всіх функцій без миші, перевірка візуального фокусу та відсутності «пасток фокусу» у непередбачених місцях.4  
3. **Тестування зі зчитувачем екрана**. Використання NVDA на Windows та VoiceOver на macOS/iOS для перевірки оголошень маршрутів і динамічного контенту.3  
4. **Аналіз структури контенту**. Перевірка ієрархії заголовків та наявності орієнтирів (landmarks), таких як \<nav\>, \<main\>, \<footer\>.9

Пріоритизація виявлених проблем повинна ґрунтуватися на ступені впливу на користувача. Критичні блоки (blockers), що роблять функціональність повністю недоступною (наприклад, неможливість натиснути кнопку оплати з клавіатури), мають виправлятися негайно. Проблеми середньої тяжкості, що ускладнюють використання (наприклад, відсутність описів для декоративних іконок), плануються в наступних спринтах.19

## **Доступність у SPA та автоматизація в CI/CD-конвеєрах**

### **Мета роботи**

Вивчення специфічних проблем доступності односторінкових застосунків, оволодіння техніками керування фокусом і маршрутизацією, а також налаштування автоматизованого контролю доступності в процесі безперервної інтеграції.

### **Коротка теоретична частина**

SPA покладаються на клієнтський JavaScript для оновлення вмісту сторінки. Це порушує стандартну поведінку браузера щодо відображення нових сторінок і керування фокусом. Для вирішення цих проблем використовуються:

* **Програмне фокусування**. Метод element.focus() у поєднанні з tabindex="-1".  
* **ARIA Live Regions**. Атрибути aria-live, aria-atomic та ролі status, alert.  
* **WAI-ARIA Authoring Practices**. Стандартні паттерни для складних віджетів (модалки, таби, акордеони).  
* **CI/CD Automation**. Використання pa11y-ci та GitHub Actions для запобігання деградації доступності.

### **Завдання практичної роботи**

1. Обрати наявний SPA-проєкт (або використати наданий шаблон на Vue/React) та провести початковий аудит доступності за допомогою Google Lighthouse.  
2. **Реалізація доступної маршрутизації**:  
   * Налаштувати автоматичне оновлення заголовка сторінки (document.title) при кожній зміні маршруту.  
   * Реалізувати механізм переміщення фокусу на головний заголовок \<h1\> нової сторінки.  
3. **Розробка динамічних сповіщень**:  
   * Створити глобальний компонент сповіщень (Toast/Snackbar), що використовує aria-live="polite".  
   * Реалізувати індикатор завантаження даних, доступний для зчитувачів екрана.  
4. **Інтеграція в CI/CD**:  
   * Налаштувати файл конфігурації .pa11yci для перевірки основних маршрутів застосунку.  
   * Створити GitHub Action, який запускає аудит при кожному Pull Request.

Необхідно створити файл у репозиторії за шляхом .github/workflows/a11y-check.yml. Цей workflow буде автоматично запускати серію тестів.

name: Accessibility Check

on:  
  push:  
    branches:  
      \- main  
      \- master  
  pull\_request:

jobs:  
  pa11y:  
    runs-on: ubuntu-latest

    steps:  
      \- name: Checkout repository  
        uses: actions/checkout@v4

      \- name: Setup Node.js  
        uses: actions/setup-node@v4  
        with:  
          node-version: 20  
          cache: npm

      \- name: Install dependencies  
        run: npm ci

      \- name: Build app  
        run: npm run build

      \- name: Install accessibility tooling  
        run: npm install \--no-save pa11y-ci wait-on

      \- name: Start preview server  
        run: npm run preview \-- \--host 127.0.0.1 \--port 4173 &

      \- name: Wait for server  
        run: npx wait-on http://127.0.0.1:4173

      \- name: Run accessibility checks  
        run: npx pa11y-ci \--config .pa11yci.json

У файлі .pa11yci.json слід перелічити всі критичні маршрути (наприклад, /, /login, /dashboard), щоб гарантувати їх постійну доступність

5. **Фінальний аудит та порівняння**:   
   * Зафіксувати покращення показників доступності та перевірити роботу застосунку за допомогою клавіатури.  
6. **Задеплоїти** додаток на Vercel / GH Pages.

### **Вимоги до звіту**

Звіт про виконання практичної роботи повинен бути структурованим та містити наступні елементи:

1. **Титульний аркуш**: назва дисципліни, номер роботи, ПІБ студента, дата виконання.  
2. **Мета і завдання** практичної роботи.  
3. **Посилання** на задеплоєний сайт на Vercel/GH Pages.  
4. **Початковий аудит**: cкриншот звіту Lighthouse до внесення змін із переліком знайдених критичних помилок.  
5. **Опис технічних рішень**:  
   * Фрагменти коду, що відповідають за керування фокусом.  
   * Опис реалізації Live Regions.  
   * Конфігурація .pa11yci.json та GitHub Actions.  
6. **Верифікація результатів**:  
   * Скриншот успішного виконання GitHub Action (зелена галочка).  
   * Порівняльна таблиця оцінок доступності до та після оптимізації.  
   * Звіт про ручну перевірку клавіатурою (чи всі елементи доступні, чи є видимий індикатор фокусу).  
7. **Висновки**: власна оцінка складності впровадження доступності в SPA та аналіз обмежень автоматизованого тестування.

## **"Shift-Left": Вбудовування доступності в життєвий цикл розробки**

Концепція «Shift-Left» (зсув ліворуч) передбачає перенесення тестування та забезпечення якості на якомога ранні етапи життєвого циклу розробки програмного забезпечення.33 Для доступності в SPA це означає, що вимоги до інклюзивності повинні обговорюватися ще на етапі збору вимог та проєктування макетів, а не перед самим релізом.36

Впровадження цієї стратегії в Agile-командах включає:

* **Product Managers**: Включають критерії доступності в «Definition of Done» (визначення готовності) для кожної користувацької історії (User Story).33  
* **Designers**: Створюють дизайн-системи з уже врахованими контрастами, розмірами шрифтів та станами фокусу для кожного компонента.36  
* **Developers**: Використовують інструменти статичного аналізу (лінтинг) та пишуть автоматизовані тести доступності паралельно з функціональним кодом.17  
* **QA Engineers**: Поєднують автоматизоване сканування з регресійним ручним тестуванням специфічних інклюзивних сценаріїв.19

Це дозволяє перетворити доступність із «виснажливого процесу виправлення помилок» на «природний стандарт якості коду», що значно знижує ризики та покращує репутацію бренду як інклюзивного лідера.37

## **Бізнес-кейс та юридичні аспекти доступності SPA**

Окрім етичних міркувань, доступність має також сильне економічне обґрунтування. Дослідження показують, що понад 20% населення планети має ту чи іншу форму інвалідності (постійну, тимчасову або ситуативну).32 Ігнорування цієї аудиторії означає втрату значного ринкового сегмента. Більше того, принципи доступної розробки часто збігаються з найкращими практиками SEO та мобільної оптимізації. Наприклад, семантична розмітка допомагає пошуковим роботам краще індексувати контент SPA, а логічна структура полегшує використання сайту на пристроях із маленькими екранами або в умовах яскравого освітлення.1

З юридичної точки зору, вимоги до доступності стають все більш жорсткими. Такі закони, як ADA (США), European Accessibility Act (ЄС) та Section 508, вимагають від цифрових продуктів відповідності стандарту WCAG 2.1 рівня AA.20 Невиконання цих вимог призводить до судових позовів та штрафів, сума яких часто перевищує вартість повноцінної розробки доступного інтерфейсу з нуля.19 Таким чином, інвестиції в інклюзивність SPA є стратегічним кроком для мінімізації ризиків і забезпечення стійкого зростання бізнесу.

#### 

#### 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

## **Джерела**

1. The Benefits of Single Page Applications (SPAs) \- Abbacus Technologies, [https://www.abbacustechnologies.com/the-benefits-of-single-page-applications-spas/](https://www.abbacustechnologies.com/the-benefits-of-single-page-applications-spas/)  
2. Accessibility in Single Page Apps (Part 1), [https://johnsweetaccessibility.com/2020/05/accessibility-in-spas-part-1/](https://johnsweetaccessibility.com/2020/05/accessibility-in-spas-part-1/)  
3. Accessibility for Single Page Applications (SPAs): React, Vue, Angular Guide | TestParty, [https://testparty.ai/blog/spa-accessibility](https://testparty.ai/blog/spa-accessibility)  
4. Accessibility in Vue: Quick Tips for Building Inclusive Apps \- DEV Community, [https://dev.to/jacobandrewsky/accessibility-in-vue-quick-tips-for-building-inclusive-apps-2ne0](https://dev.to/jacobandrewsky/accessibility-in-vue-quick-tips-for-building-inclusive-apps-2ne0)  
5. Accessibility for SPAs & React — Focus, Routing & ARIA \- Accesify ..., [https://www.accesify.io/blog/accessibility-single-page-apps-react/](https://www.accesify.io/blog/accessibility-single-page-apps-react/)  
6. ARIA live regions \- MDN Web Docs \- Mozilla, [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live\_regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)  
7. Accessible Vue Apps \- Certificates.dev, [https://certificates.dev/blog/accessible-vue-apps](https://certificates.dev/blog/accessible-vue-apps)  
8. A 'Vue' of Accessibility: Tips and Tricks to make your application accessible \- Deque Systems, [https://www.deque.com/blog/a-vue-of-accessibility-tips-and-tricks-to-make-your-application-accessible/](https://www.deque.com/blog/a-vue-of-accessibility-tips-and-tricks-to-make-your-application-accessible/)  
9. Building Accessible Single Page Applications (SPAs) \- Atyantik Technologies, [https://atyantik.com/building-accessible-single-page-applications-spas/](https://atyantik.com/building-accessible-single-page-applications-spas/)  
10. Accessibility \- Vue.js, [https://vuejs.org/guide/best-practices/accessibility](https://vuejs.org/guide/best-practices/accessibility)  
11. Vue refs and lifecycle methods for focus management \- Learn web development | MDN, [https://developer.mozilla.org/en-US/docs/Learn\_web\_development/Core/Frameworks\_libraries/Vue\_refs\_focus\_management](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/Vue_refs_focus_management)  
12. Accessible notifications with ARIA Live Regions (Part 2\) \- Sara Soueidan, [https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-2/](https://www.sarasoueidan.com/blog/accessible-notifications-with-aria-live-regions-part-2/)  
13. How to Build Accessible Modals with Focus Traps (2026 Guide) | UXPin, [https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/](https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/)  
14. Making keyboard navigation more accessible with JavaScript 'focus traps' | Mugo Web, [https://www.mugo.ca/Blog/Making-keyboard-navigation-more-accessible-with-JavaScript-focus-traps](https://www.mugo.ca/Blog/Making-keyboard-navigation-more-accessible-with-JavaScript-focus-traps)  
15. Modal | Components | Vanilla documentation, [https://vanillaframework.io/docs/patterns/modal/accessibility](https://vanillaframework.io/docs/patterns/modal/accessibility)  
16. Bump up modal accessibility with aria attributes and focus trap. Implementations in vanilla JavaScript and React. \- A Drop In Calm, [https://adropincalm.com/blog/modal-focus-trap-in-javascript-and-react/](https://adropincalm.com/blog/modal-focus-trap-in-javascript-and-react/)  
17. Accessibility Testing in CI/CD: A Complete Integration Guide \- TestParty, [https://testparty.ai/blog/accessibility-testing-cicd](https://testparty.ai/blog/accessibility-testing-cicd)  
18. Automating Accessibility Testing in CI/CD with GitHub Actions, [https://accessiblemindstech.com/automating-accessibility-testing-in-ci-cd-with-github-actions/](https://accessiblemindstech.com/automating-accessibility-testing-in-ci-cd-with-github-actions/)  
19. Automated Accessibility Testing: A Practical Guide to WCAG Coverage \- Level Access, [https://www.levelaccess.com/blog/automated-accessibility-testing-a-practical-guide-to-wcag-coverage/](https://www.levelaccess.com/blog/automated-accessibility-testing-a-practical-guide-to-wcag-coverage/)  
20. Manual vs. Automated Accessibility Testing | BrowserStack, [https://www.browserstack.com/guide/manual-vs-automated-accessbility-testing](https://www.browserstack.com/guide/manual-vs-automated-accessbility-testing)  
21. ACCESSIBILITY.md/examples ... \- GitHub, [https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CI\_CD\_ACCESSIBILITY\_BEST\_PRACTICES.md](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CI_CD_ACCESSIBILITY_BEST_PRACTICES.md)  
22. component-driven/cypress-axe: Test accessibility with axe-core in Cypress \- GitHub, [https://github.com/component-driven/cypress-axe](https://github.com/component-driven/cypress-axe)  
23. Automating Accessibility Testing in Your CI/CD Pipelines with Axe \- MagicPod, [https://blog.magicpod.com/automating-accessibility-testing-in-your-ci/cd-pipelines-with-axe](https://blog.magicpod.com/automating-accessibility-testing-in-your-ci/cd-pipelines-with-axe)  
24. Pa11y is your automated accessibility testing pal · GitHub, [https://github.com/pa11y/pa11y](https://github.com/pa11y/pa11y)  
25. Pa11y CI is a CI-centric accessibility test runner, built using Pa11y \- GitHub, [https://github.com/pa11y/pa11y-ci](https://github.com/pa11y/pa11y-ci)  
26. Test for accessibility and help millions of people \- Tim Deschryver, [https://timdeschryver.dev/blog/test-for-accessibility-and-help-millions-of-people](https://timdeschryver.dev/blog/test-for-accessibility-and-help-millions-of-people)  
27. Automated accessibility testing? : r/reactjs \- Reddit, [https://www.reddit.com/r/reactjs/comments/1r652l3/automated\_accessibility\_testing/](https://www.reddit.com/r/reactjs/comments/1r652l3/automated_accessibility_testing/)  
28. How accessibility programs benefit from both manual and automated testing \- Deque, [https://www.deque.com/blog/how-accessibility-programs-benefit-from-both-manual-and-automated-testing/](https://www.deque.com/blog/how-accessibility-programs-benefit-from-both-manual-and-automated-testing/)  
29. Manual vs. Automated Web Accessibility Testing \- Americaneagle.com, [https://www.americaneagle.com/insights/blog/post/mastering-web-accessibility--manual-vs.-automated-testing-explained](https://www.americaneagle.com/insights/blog/post/mastering-web-accessibility--manual-vs.-automated-testing-explained)  
30. Automated and manual accessibility testing work best together \- Pope Tech Resources, [https://blog.pope.tech/2025/01/09/automated-and-manual-accessibility-testing-work-best-together/](https://blog.pope.tech/2025/01/09/automated-and-manual-accessibility-testing-work-best-together/)  
31. Web Accessibility Audit: Practical Example with archive.org (Part 1\) | by Tetiana Serbina, [https://medium.com/@tanuhaserbina/web-accessibility-audit-practical-example-with-archive-org-part-1-8cff5afbbee6](https://medium.com/@tanuhaserbina/web-accessibility-audit-practical-example-with-archive-org-part-1-8cff5afbbee6)  
32. How to Conduct a Web Accessibility Audit | QAwerk, [https://qawerk.com/blog/how-to-conduct-a-web-accessibility-audit/](https://qawerk.com/blog/how-to-conduct-a-web-accessibility-audit/)  
33. Accessibility-First: Embedding accessibility with Software Development Lifecycle \- Infosys, [https://www.infosys.com/iki/techcompass/embedding-accessibility-software-development-lifecycle.html](https://www.infosys.com/iki/techcompass/embedding-accessibility-software-development-lifecycle.html)  
34. A Step-by-Step Guide to Conducting a Web Accessibility Audit \- UsableNet Blog, [https://blog.usablenet.com/a-step-by-step-guide-to-conducting-a-web-accessibility-audit](https://blog.usablenet.com/a-step-by-step-guide-to-conducting-a-web-accessibility-audit)  
35. Accessibility testing with Cypress \- CircleCI, [https://circleci.com/blog/cypress-accessibility-testing/](https://circleci.com/blog/cypress-accessibility-testing/)  
36. What is Accessibility-First Web Design \- Verndale, [https://www.verndale.com/insights/accessibility/what-is-accessibility-first-web-design](https://www.verndale.com/insights/accessibility/what-is-accessibility-first-web-design)  
37. Embedding Accessibility in Design: The Early Planning Advantage \- Level Access, [https://www.levelaccess.com/blog/embedding-accessibility-in-design-how-early-planning-creates-advantage/](https://www.levelaccess.com/blog/embedding-accessibility-in-design-how-early-planning-creates-advantage/)  
38. What Is the Digital Accessibility Maturity Model? \- Vispero, [https://vispero.com/resources/what-is-the-digital-accessibility-maturity-model/](https://vispero.com/resources/what-is-the-digital-accessibility-maturity-model/)  
39. Accessibility‑First Design: Why Inclusive Sites Win More Customers \- Daylight, [https://thedaylightstudio.com/accessibility-first-web-design/](https://thedaylightstudio.com/accessibility-first-web-design/)