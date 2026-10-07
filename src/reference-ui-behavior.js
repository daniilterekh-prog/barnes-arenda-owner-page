/* Page-local accessibility glue for the reference UI transfer. */
(function () {
  'use strict';

  var trigger;
  var menuId = 'owner-rent-site-menu';
  var enhancementTimer;
  var exclusiveScrollFrame;
  var exclusiveScrollReady = false;

  function enhanceServicesSection() {
    var section = document.querySelector('.owner-sale-services');
    var headerWrap = section && section.querySelector('.owner-sale-services__header-wrap');
    var title = section && section.querySelector('.owner-sale-services__title');

    if (!section || !headerWrap) return;

    if (title) {
      title.id = 'owner-rent-services-title';
      section.setAttribute('aria-labelledby', title.id);
      section.removeAttribute('aria-label');
    }

    if (!headerWrap.querySelector('.owner-sale-services__eyebrow')) {
      var eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-services__eyebrow';
      eyebrow.textContent = 'ЕДИНАЯ КОМАНДА BARNES';
      headerWrap.insertBefore(eyebrow, headerWrap.firstChild);
    }

    section.querySelectorAll('.owner-sale-services__text').forEach(function (text) {
      if (text.querySelector('strong')) return;

      var copy = text.textContent.trim().split(' — ');
      if (copy.length < 2) return;

      text.textContent = '';
      var lead = document.createElement('strong');
      lead.textContent = copy.shift();
      var detail = document.createElement('span');
      var detailText = copy.join(' — ').trim();
      detail.textContent = detailText.charAt(0).toLocaleUpperCase('ru-RU') + detailText.slice(1);
      text.append(lead, detail);
    });

    if (!section.querySelector('.owner-sale-services__cta')) {
      var cta = document.createElement('a');
      cta.className = 'ui-button ui-button--primary ui-button--medium owner-sale-services__cta';
      cta.href = '#request';
      cta.innerHTML = 'Обсудить стратегию сдачи <span aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg></span>';
      section.appendChild(cta);
    }
  }

  function enhanceHeroSection() {
    var button = document.querySelector('.owner-sale-hero__button');
    var breadcrumbs = document.querySelector('.owner-sale-hero__breadcrumbs');
    var copy = document.querySelector('.owner-sale-hero__copy');

    if (breadcrumbs && copy && breadcrumbs.parentElement !== copy) {
      copy.insertBefore(breadcrumbs, copy.firstChild);
    }

    if (!button || button.querySelector('.owner-sale-hero__button-arrow')) return;

    button.innerHTML = 'Обсудить стратегию <span class="owner-sale-hero__button-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg></span>';
  }

  function bindRequestPopup(button) {
    if (!button || button.dataset.requestPopupBound === 'true') return;

    button.dataset.requestPopupBound = 'true';
    button.addEventListener('click', function () {
      var heroRequest = document.querySelector('.owner-sale-hero__button');
      if (heroRequest) heroRequest.click();
    });
  }

  function enhanceHeroHeader() {
    var header = document.querySelector('.layout__header .site-header');
    var inner = header && header.querySelector('.site-header__inner');

    if (!header || !inner) return;

    header.classList.remove('site-header--no-nav');
    if (inner.querySelector(':scope > .site-header__nav')) return;

    var items = [
      ['Москва', 'https://barn-estate.ru/gorodskaya-nedvizhimost/', [['Вторичная', 'https://barn-estate.ru/vtorichnaya-nedvizhimost/'], ['Арендовать', 'https://barn-estate.ru/arendovat/'], ['Новостройки', 'https://barn-estate.ru/novostroyki/'], ['Жилые комплексы', 'https://barn-estate.ru/zhilye-kompleksy/'], ['Квартиры', 'https://barn-estate.ru/gorodskaya-nedvizhimost/kvartiry/'], ['Апартаменты', 'https://barn-estate.ru/gorodskaya-nedvizhimost/apartamenty/'], ['Пентхаусы', 'https://barn-estate.ru/kupit-penthausy-v-moskve/'], ['Застройщики', 'https://barn-estate.ru/zastroyshchiki/']]],
      ['Загородная', 'https://barn-estate.ru/zagorodnaya-nedvizhimost/', [['Купить', 'https://barn-estate.ru/zagorodnaya-nedvizhimost/'], ['Снять', 'https://barn-estate.ru/snyat-zagorodnuyu-nedvizhimost/'], ['Коттеджные поселки', 'https://barn-estate.ru/kottedzhnye-poselki/']]],
      ['Коммерческая', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/', [['Купить', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/'], ['Снять', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/arendovat/'], ['Здания', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/zdanie/'], ['Бизнес-центры', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/business-center/'], ['Особняки', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/osobnyak/'], ['Арендный бизнес', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/arendnyj-biznes/']]],
      ['Курортная', 'https://barn-estate.ru/kurortnaya/', [['Инвестиции', 'https://barn-estate.ru/media/tag/investitsii-v-kurortnuyu-nedvizhimost-rossii/'], ['Алтай', 'https://barn-estate.ru/altai/'], ['Архыз', 'https://barn-estate.ru/arhyz/'], ['Сочи', 'https://barn-estate.ru/sochi/']]],
      ['Зарубежная', 'https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/', [['ОАЭ', 'https://barn-estate.ru/oae/'], ['Турция', 'https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/turtsiya/'], ['Таиланд', 'https://barn-estate.ru/tailand/'], ['Бали', 'https://barn-estate.ru/zhilye-kompleksy-indonesia/'], ['Испания', 'https://barn-estate.ru/ispaniya/'], ['Италия', 'https://barn-estate.ru/italiya/'], ['Португалия', 'https://barn-estate.ru/portugaliya/'], ['Франция', 'https://barn-estate.ru/frantsiya/'], ['Оман', 'https://barn-estate.ru/oman/'], ['Жилые комплексы', 'https://barn-estate.ru/mezhdunarodnaya-nedvizhimost-zhilye-kompleksy/']]],
      ['Санкт-Петербург', 'https://barnes-spb.ru', [['Вторичная', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/'], ['Новостройки', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/novostroyki/'], ['Загородная', 'https://barnes-spb.ru/zagorodnaya-nedvizhimost/'], ['Коммерческая', 'https://barnes-spb.ru/kommercheskaya-nedvizhimost/'], ['Эксклюзив', 'https://barnes-spb.ru/exclusive/'], ['Апартаменты', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-apartamenty/'], ['Пентхаус', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-penthausy/']]],
      ['Медиа', 'https://barn-estate.ru/media/', [['Блог', 'https://barn-estate.ru/media/blog/'], ['Новости', 'https://barn-estate.ru/media/novosti/'], ['Вебинары и видео', 'https://barn-estate.ru/media/vebinary-i-video/'], ['Аналитика рынка', 'https://barn-estate.ru/media/analitika/'], ['Искусство жить', 'https://barn-estate.ru/media/stil-zhizni/'], ['Кейсы', 'https://barn-estate.ru/media/cases/'], ['Журнал', 'https://barn-estate.ru/zhurnaly/']]],
      ['О BARNES', 'https://barn-estate.ru/mir-barnes/', [['Контакты', 'https://barn-estate.ru/contacts/'], ['Партнерам', 'https://barn-estate.ru/for-partners/'], ['Barnes Club', 'https://barn-estate.ru/barnes-club/'], ['СМИ о нас', 'https://barn-estate.ru/novosti/smi-o-nas/'], ['Мероприятия', 'https://barn-estate.ru/novosti/meropriyatiya/'], ['Команда', 'https://barn-estate.ru/team/'], ['Вакансии', 'https://barn-estate.ru/vacancies/'], ['Стиль жизни', 'https://barn-estate.ru/stily-zhizni/']]],
      ['Собственникам', 'https://barn-estate.ru/sobstvennikam/', [['Продажа', 'https://barn-estate.ru/prodazha_sobstvennikam/'], ['Аренда', 'https://barn-estate.ru/arenda_sobstvennikam/']]]
    ];
    var nav = document.createElement('nav');
    nav.className = 'site-header__nav';
    nav.setAttribute('aria-label', 'Основное меню');
    nav.setAttribute('data-v-7912d681', '');
    nav.innerHTML = '<ul class="site-header__nav-list" data-v-7912d681>' + items.map(function (item) {
      var subnav = '<ul class="site-header__subnav" data-v-7912d681>' + item[2].map(function (subitem) {
        return '<li data-v-7912d681><a class="site-header__subnav-link" href="' + subitem[1] + '" data-v-7912d681>' + subitem[0] + '</a></li>';
      }).join('') + '</ul>';
      return '<li class="site-header__nav-item owner-rent-nav-item" data-v-7912d681><a class="site-header__nav-link" href="' + item[1] + '" data-v-7912d681>' + item[0] + '</a>' + subnav + '</li>';
    }).join('') + '</ul>';
    inner.appendChild(nav);
  }

  function enhanceHeroHeaderContacts() {
    var right = document.querySelector('.layout__header .site-header__right');
    var phone = right && right.querySelector('.site-header__phone');

    if (!right || !phone) return;

    if (!right.querySelector('.owner-rent-hero-contacts')) {
      var contacts = document.createElement('nav');
      contacts.className = 'owner-rent-hero-contacts';
      contacts.setAttribute('aria-label', 'Способы связи');
      [
        ['WhatsApp', 'https://wa.me/79252621650', '/arenda_sobstvennikam/pictures/office-contact/whatsapp.svg'],
        ['MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', '/arenda_sobstvennikam/pictures/office-contact/max.svg'],
        ['Telegram', 'https://t.me/art_de_vivre_barnes', '/arenda_sobstvennikam/pictures/office-contact/telegram.svg']
      ].forEach(function (item) {
        var link = document.createElement('a');
        var icon = document.createElement('img');
        link.className = 'owner-rent-hero-contact';
        link.href = item[1];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Написать в ' + item[0]);
        icon.src = item[2];
        icon.alt = '';
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
        contacts.appendChild(link);
      });

      phone.classList.add('owner-rent-hero-contact', 'owner-rent-hero-contact--phone');
      phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
      contacts.appendChild(phone);
      right.appendChild(contacts);
    }

    var obsoleteRequest = right.querySelector('.owner-rent-hero-request');
    if (obsoleteRequest) obsoleteRequest.remove();
  }

  function enhanceStickyHeader() {
    var sticky = document.querySelector('.owner-sale-sticky');
    var inner = sticky && sticky.querySelector('.owner-sale-sticky__inner');
    var brand = inner && inner.querySelector('.owner-sale-sticky__brand');
    var logo = brand && brand.querySelector('.owner-sale-sticky__logo');
    var phone = brand && brand.querySelector('.owner-sale-sticky__phone');

    if (!sticky || !inner || !brand || !phone) return;

    if (logo && logo.parentElement !== inner) {
      inner.insertBefore(logo, brand);
    }

    if (!brand.querySelector('.owner-sale-sticky__request')) {
      var request = document.createElement('button');
      request.className = 'owner-sale-sticky__request';
      request.type = 'button';
      request.textContent = 'Оставить заявку';
      brand.insertBefore(request, phone);
    }

    if (!brand.querySelector('.owner-sale-sticky__messengers')) {
      var messengers = document.createElement('nav');
      messengers.className = 'owner-sale-sticky__messengers';
      messengers.setAttribute('aria-label', 'Способы связи');
      [
        ['WhatsApp', 'https://wa.me/79252621650', '/arenda_sobstvennikam/pictures/office-contact/whatsapp.svg'],
        ['MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', '/arenda_sobstvennikam/pictures/office-contact/max.svg'],
        ['Telegram', 'https://t.me/art_de_vivre_barnes', '/arenda_sobstvennikam/pictures/office-contact/telegram.svg']
      ].forEach(function (item) {
        var link = document.createElement('a');
        var icon = document.createElement('img');
        link.className = 'owner-sale-sticky__messenger';
        link.href = item[1];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Написать в ' + item[0]);
        icon.src = item[2];
        icon.alt = '';
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
        messengers.appendChild(link);
      });
      brand.insertBefore(messengers, phone);
    }

    phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
    var messengerGroup = brand.querySelector('.owner-sale-sticky__messengers');
    if (messengerGroup && phone.parentElement !== messengerGroup) {
      messengerGroup.appendChild(phone);
    }
    var requestLink = brand.querySelector('.owner-sale-sticky__request');
    if (requestLink && messengerGroup && requestLink.nextElementSibling !== messengerGroup) {
      brand.insertBefore(requestLink, messengerGroup);
    }
    bindRequestPopup(requestLink);
    enhanceStickyNavigation(sticky, inner, messengerGroup);
  }

  function enhanceStickyNavigation(sticky, inner, messengerGroup) {
    var nav = sticky.querySelector('.owner-sale-sticky__nav');
    var list = nav && nav.querySelector('.owner-sale-sticky__list');
    var services = document.querySelector('.owner-sale-services');
    var exclusive = document.querySelector('.owner-sale-exclusive');

    if (!nav || !list) return;
    if (services) services.id = 'team';
    if (exclusive) exclusive.id = 'exclusive';

    if (!list.dataset.ownerRentAnchors) {
      var anchors = [
        ['Стратегия', 'about'],
        ['Команда', 'team'],
        ['Эксклюзив', 'exclusive'],
        ['Направления', 'property-types']
      ];
      list.innerHTML = anchors.map(function (item) {
        return '<li class="owner-sale-sticky__item"><a class="owner-sale-sticky__link" href="#' + item[1] + '">' + item[0] + '</a></li>';
      }).join('') + '<li class="owner-sale-sticky__item owner-sale-sticky__item--contacts"><button class="owner-sale-sticky__contact-toggle" type="button" aria-expanded="false" aria-controls="owner-rent-sticky-contacts" aria-label="Показать способы связи"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg></button></li>';
      list.dataset.ownerRentAnchors = 'true';
    }

    var toggle = list.querySelector('.owner-sale-sticky__contact-toggle');
    var panel = inner.querySelector('.owner-sale-sticky__contact-panel');
    if (!panel && messengerGroup) {
      panel = messengerGroup.cloneNode(true);
      panel.id = 'owner-rent-sticky-contacts';
      panel.className = 'owner-sale-sticky__contact-panel';
      panel.hidden = true;
      inner.appendChild(panel);
    }

    if (toggle && panel && toggle.dataset.bound !== 'true') {
      toggle.dataset.bound = 'true';
      toggle.addEventListener('click', function () {
        var willOpen = panel.hidden;
        panel.hidden = !willOpen;
        toggle.setAttribute('aria-expanded', String(willOpen));
        toggle.setAttribute('aria-label', willOpen ? 'Скрыть способы связи' : 'Показать способы связи');
      });
    }
  }

  function enhanceExclusiveSection() {
    var section = document.querySelector('.owner-sale-exclusive');
    var inner = section && section.querySelector('.owner-sale-exclusive__inner');
    var title = section && section.querySelector('.owner-sale-exclusive__title');
    var itemTitles = [
      'Единая подача',
      'Расширенный охват',
      'Персональный брокер',
      'Обоснованная ставка',
      'Проверка арендаторов',
      'Полное сопровождение'
    ];

    if (!section || !inner || !title) return;

    title.id = 'owner-rent-exclusive-title';
    section.setAttribute('aria-labelledby', title.id);
    section.removeAttribute('aria-label');

    if (!inner.querySelector('.owner-sale-exclusive__eyebrow')) {
      var eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-exclusive__eyebrow';
      eyebrow.textContent = 'BARNES / ЭКСКЛЮЗИВ';
      inner.insertBefore(eyebrow, title);
    }

    if (!inner.querySelector('.owner-sale-exclusive__header')) {
      var header = document.createElement('header');
      var sectionEyebrow = inner.querySelector('.owner-sale-exclusive__eyebrow');
      header.className = 'owner-sale-exclusive__header';
      inner.insertBefore(header, sectionEyebrow);
      header.append(sectionEyebrow, title);
    }

    if (!title.querySelector('.owner-sale-exclusive__title-line')) {
      title.setAttribute(
        'aria-label',
        'Преимущества эксклюзивной работы с BARNES'
      );
      title.innerHTML = [
        'ПРЕИМУЩЕСТВА ЭКСКЛЮЗИВНОЙ',
        'РАБОТЫ С BARNES'
      ].map(function (line) {
        return '<span class="owner-sale-exclusive__title-line" aria-hidden="true">' + line + '</span>';
      }).join('');
    }

    var exclusiveHeader = inner.querySelector('.owner-sale-exclusive__header');
    if (exclusiveHeader && !exclusiveHeader.querySelector('.owner-sale-exclusive__intro')) {
      var intro = document.createElement('p');
      intro.className = 'owner-sale-exclusive__intro';
      intro.textContent = 'Объединяем стратегию, продвижение и переговоры в одной команде — от подготовки объекта до подписания договора.';

      var exclusiveCta = document.createElement('a');
      exclusiveCta.className = 'ui-button ui-button--primary ui-button--medium owner-sale-exclusive__cta';
      exclusiveCta.href = '#request';
      exclusiveCta.innerHTML = 'Связаться с брокером <span aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg></span>';

      exclusiveHeader.append(intro, exclusiveCta);
    }

    section.querySelectorAll('.owner-sale-exclusive__item').forEach(function (item, index) {
      if (item.querySelector('.owner-sale-exclusive__number')) return;

      var text = item.querySelector('.owner-sale-exclusive__text');
      if (!text) return;

      var number = document.createElement('span');
      number.className = 'owner-sale-exclusive__number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1).padStart(2, '0');

      var content = document.createElement('div');
      content.className = 'owner-sale-exclusive__content';

      var heading = document.createElement('h3');
      heading.className = 'owner-sale-exclusive__item-title';
      heading.textContent = itemTitles[index] || '';

      item.insertBefore(number, item.firstChild);
      content.append(heading, text);
      item.appendChild(content);
    });
  }

  function reorderBrandSections() {
    var about = document.querySelector('.about-company');
    var services = document.querySelector('.owner-sale-services');
    var exclusive = document.querySelector('.owner-sale-exclusive');

    if (!about || !services || !exclusive) return;
    if (about.parentNode !== services.parentNode || services.parentNode !== exclusive.parentNode) return;
    if (services.nextElementSibling === about && about.nextElementSibling === exclusive) return;

    var parent = services.parentNode;
    var first = [about, services, exclusive].sort(function (a, b) {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    })[0];

    parent.insertBefore(services, first);
    parent.insertBefore(about, services.nextSibling);
    parent.insertBefore(exclusive, about.nextSibling);
  }

  function replaceConsultationSection() {
    var current = document.querySelector('.catalog-contact');
    if (!current || document.querySelector('.catalog-consultation')) return;

    var section = document.createElement('section');
    section.id = 'request';
    section.className = 'catalog-consultation';
    section.innerHTML = `
      <div class="catalog-consultation__inner">
        <div class="catalog-consultation__media">
          <img class="catalog-consultation__image" src="/assets/city-real-estate/source-assets/16-7d2ca45d4d-contacts-man.webp" alt="" width="1920" height="800">
          <div class="catalog-consultation__overlay" aria-hidden="true"></div>
          <div class="catalog-consultation__grid">
            <div class="catalog-consultation__content">
              <div class="catalog-consultation__mobile-expert">
                <div class="catalog-consultation__mobile-photo"><img src="/assets/city-real-estate/source-assets/17-23350d2829-cta-ruslan-pruss.webp" alt="Руслан Прус" width="68" height="68"></div>
                <div><p class="catalog-consultation__mobile-role">Руководитель департамента городской недвижимости</p><p class="catalog-consultation__mobile-name">Руслан Прус</p></div>
              </div>
              <div class="catalog-consultation__mobile-header"><h2 class="catalog-consultation__mobile-title">Эксперты BARNES подскажут</h2><p class="catalog-consultation__mobile-lead">Поможем подготовить объект, найти надёжного арендатора и сдать недвижимость на выгодных условиях</p></div>
              <div class="catalog-consultation__header"><h2 class="catalog-consultation__subtitle">Эксперты BARNES подскажут</h2><p class="catalog-consultation__lead">Поможем подготовить объект, найти надёжного арендатора и сдать недвижимость на выгодных условиях</p></div>
              <div class="catalog-consultation__methods" role="tablist" aria-label="Способ связи">
                <button type="button" role="tab" class="catalog-consultation__method" aria-selected="false" data-method="call"><svg class="catalog-consultation__method-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>Звонок</span></button>
                <button type="button" role="tab" class="catalog-consultation__method" aria-selected="false" data-method="max"><svg class="catalog-consultation__method-icon catalog-consultation__method-icon--max" aria-hidden="true" viewBox="0 0 42 42"><path d="M21.47 41.88c-4.11 0-6.02-.6-9.34-3-2.1 2.7-8.75 4.81-9.04 1.2 0-2.71-.6-5-1.28-7.5C1 29.5.08 26.07.08 21.1.08 9.23 9.82.3 21.36.3c11.55 0 20.6 9.37 20.6 20.91a20.6 20.6 0 0 1-20.49 20.67m.17-31.32c-5.62-.29-10 3.6-10.97 9.7-.8 5.05.62 11.2 1.83 11.52.58.14 2.04-1.04 2.95-1.95a10.4 10.4 0 0 0 5.08 1.81 10.7 10.7 0 0 0 11.19-9.97 10.7 10.7 0 0 0-10.08-11.1Z" fill="currentColor"/></svg><span>MAX</span></button>
                <button type="button" role="tab" class="catalog-consultation__method catalog-consultation__method--active" aria-selected="true" data-method="whatsapp"><svg class="catalog-consultation__method-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" fill="currentColor"/></svg><span>Whatsapp</span></button>
                <button type="button" role="tab" class="catalog-consultation__method" aria-selected="false" data-method="telegram"><svg class="catalog-consultation__method-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="currentColor"/></svg><span>Telegram</span></button>
              </div>
              <form class="catalog-consultation__form" novalidate>
                <label class="catalog-consultation__field"><span class="visually-hidden">Ваше имя</span><input type="text" class="catalog-consultation__input" name="name" autocomplete="name" placeholder="Введите Ваше имя" aria-label="Ваше имя"></label>
                <label class="catalog-consultation__field"><span class="visually-hidden">Номер телефона</span><input type="tel" inputmode="tel" class="catalog-consultation__input" name="phone" autocomplete="tel" placeholder="Ваш номер телефона" aria-label="Номер телефона" required></label>
                <label class="catalog-consultation__field catalog-consultation__field--textarea"><span class="visually-hidden">Комментарий</span><textarea class="catalog-consultation__textarea" name="comment" rows="2" placeholder="Оставьте свой комментарий" aria-label="Комментарий"></textarea></label>
                <button type="submit" class="catalog-consultation__submit">Отправить заявку</button>
                <label class="catalog-consultation__consent"><input type="checkbox" class="catalog-consultation__consent-input" required><span class="catalog-consultation__consent-box" aria-hidden="true"></span><span>Я даю согласие на <a target="_blank" href="https://barn-estate.ru/legal_notices/yuridicheskie-uvedomleniya/">обработку персональных данных</a></span></label>
                <p class="catalog-consultation__status" aria-live="polite"></p>
              </form>
            </div>
          </div>
        </div>
      </div>`;

    current.replaceWith(section);

    section.querySelectorAll('.catalog-consultation__method').forEach(function (button) {
      button.addEventListener('click', function () {
        section.querySelectorAll('.catalog-consultation__method').forEach(function (item) {
          var active = item === button;
          item.classList.toggle('catalog-consultation__method--active', active);
          item.setAttribute('aria-selected', String(active));
        });
      });
    });

    section.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      var phone = section.querySelector('[name="phone"]');
      var consent = section.querySelector('.catalog-consultation__consent-input');
      var status = section.querySelector('.catalog-consultation__status');
      if (!phone.value.trim() || !consent.checked) {
        status.textContent = 'Укажите номер телефона и подтвердите согласие.';
        return;
      }
      status.textContent = 'Спасибо! Заявка подготовлена к отправке.';
    });
  }

  function reorderConsultationAndTypes() {
    var consultation = document.querySelector('.catalog-consultation');
    var types = document.querySelector('.owner-sale-types');
    if (!consultation || !types) return;
    if (consultation.nextElementSibling === types) return;
    types.parentNode.insertBefore(consultation, types);
  }

  function enhancePresentationCards() {
    var descriptions = [
      'Находим сильные стороны объекта и превращаем их в понятные преимущества для будущего арендатора.',
      'Определяем позиционирование, ценовой ориентир и ключевые акценты для презентации объекта.',
      'Выбираем релевантные каналы и показываем объект аудитории, которая соответствует его уровню.',
      'Проверяем документы и сопровождаем договор, чтобы защитить интересы собственника на каждом этапе.'
    ];

    document.querySelectorAll('.owner-sale-presentation__card:not(.owner-sale-presentation__card--featured)').forEach(function (card, index) {
      var caption = card.querySelector('.owner-sale-presentation__caption');
      if (!caption) return;

      var captionLines = caption.querySelectorAll('.owner-sale-presentation__caption-line');
      if (index === 3 && (captionLines.length !== 2 || captionLines[0].textContent !== 'ОБЕСПЕЧИВАЕМ' || captionLines[1].textContent !== 'ЮРИДИЧЕСКОЕ СОПРОВОЖДЕНИЕ')) {
        caption.textContent = '';
        ['ОБЕСПЕЧИВАЕМ', 'ЮРИДИЧЕСКОЕ СОПРОВОЖДЕНИЕ'].forEach(function (line) {
          var captionLine = document.createElement('span');
          captionLine.className = 'owner-sale-presentation__caption-line';
          captionLine.textContent = line;
          caption.appendChild(captionLine);
        });
      }

      if (card.querySelector('.owner-sale-presentation__reveal')) return;

      var reveal = document.createElement('div');
      reveal.className = 'owner-sale-presentation__reveal';
      var text = document.createElement('p');
      text.className = 'owner-sale-presentation__reveal-text';
      text.id = 'owner-sale-presentation-description-' + (index + 1);
      text.textContent = descriptions[index] || descriptions[0];
      caption.parentNode.insertBefore(reveal, caption);
      reveal.append(caption, text);
      card.tabIndex = 0;
      card.setAttribute('aria-describedby', text.id);
    });

    var featuredCard = document.querySelector('.owner-sale-presentation__card--featured');
    var featuredText = featuredCard && featuredCard.querySelector('.owner-sale-presentation__featured-text');
    var featuredTitle = featuredCard && featuredCard.querySelector('.owner-sale-presentation__featured-title');
    var featuredTitleLines = featuredTitle && featuredTitle.querySelectorAll('.owner-sale-presentation__featured-title-line');
    if (featuredTitle && (featuredTitleLines.length !== 2 || featuredTitleLines[0].textContent !== 'ДЛЯ КАЖДОГО ОБЪЕКТА' || featuredTitleLines[1].textContent !== 'СВОЙ СЦЕНАРИЙ СДАЧИ')) {
      featuredTitle.textContent = '';
      ['ДЛЯ КАЖДОГО ОБЪЕКТА', 'СВОЙ СЦЕНАРИЙ СДАЧИ'].forEach(function (line) {
        var lineElement = document.createElement('span');
        lineElement.className = 'owner-sale-presentation__featured-title-line';
        lineElement.textContent = line;
        featuredTitle.appendChild(lineElement);
      });
    }
    if (featuredCard && featuredText) {
      featuredText.id = featuredText.id || 'owner-sale-presentation-description-5';
      featuredCard.tabIndex = 0;
      featuredCard.setAttribute('aria-describedby', featuredText.id);
    }
  }

  function updateExclusiveScrollState() {
    var section = document.querySelector('.owner-sale-exclusive');
    var items = section && Array.from(section.querySelectorAll('.owner-sale-exclusive__item'));
    var header = section && section.querySelector('.owner-sale-exclusive__header');
    var desktop = window.matchMedia('(min-width: 901px)').matches;

    if (!section || !items.length) return;

    if (!desktop) {
      section.classList.remove('owner-sale-exclusive--scroll-ready');
      items.forEach(function (item) {
        item.classList.remove('is-active', 'is-past');
        item.style.removeProperty('--owner-rent-exclusive-last-offset');
      });
      return;
    }

    var alignmentLine = header ? parseFloat(window.getComputedStyle(header).top) : 120;
    if (!Number.isFinite(alignmentLine)) alignmentLine = 120;
    var lastItem = items[items.length - 1];
    var currentLastOffset = parseFloat(
      lastItem.style.getPropertyValue('--owner-rent-exclusive-last-offset')
    ) || 0;
    var naturalLastTop = lastItem.getBoundingClientRect().top - currentLastOffset;
    var headerTop = header ? header.getBoundingClientRect().top : alignmentLine;
    var lastOffset = Math.max(0, headerTop - naturalLastTop);
    lastItem.style.setProperty('--owner-rent-exclusive-last-offset', lastOffset + 'px');
    var activeIndex = 0;
    var closestDistance = Infinity;

    items.forEach(function (item, index) {
      var distance = Math.abs(item.getBoundingClientRect().top - alignmentLine);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    section.classList.add('owner-sale-exclusive--scroll-ready');
    items.forEach(function (item, index) {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-past', index < activeIndex);
    });
  }

  function requestExclusiveScrollUpdate() {
    if (exclusiveScrollFrame) return;

    exclusiveScrollFrame = window.requestAnimationFrame(function () {
      exclusiveScrollFrame = null;
      updateExclusiveScrollState();
    });
  }

  function setupExclusiveScrollAnimation() {
    if (!exclusiveScrollReady) {
      exclusiveScrollReady = true;
      window.addEventListener('scroll', requestExclusiveScrollUpdate, { passive: true });
      window.addEventListener('resize', requestExclusiveScrollUpdate, { passive: true });
    }

    requestExclusiveScrollUpdate();
  }

  function enhanceSectionHeadings() {
    var sections = [
      {
        selector: '.owner-sale-presentation__title',
        eyebrow: 'СТРАТЕГИЯ ПРЕЗЕНТАЦИИ',
        id: 'owner-rent-presentation-title'
      },
      {
        selector: '.about-company__title',
        eyebrow: 'BARNES / МОСКВА',
        id: 'owner-rent-about-title'
      },
      {
        selector: '.newsletter-cta h2',
        eyebrow: 'BARNES / АНАЛИТИКА',
        id: 'owner-rent-newsletter-title'
      }
    ];

    sections.forEach(function (config) {
      var title = document.querySelector(config.selector);
      var section = title && title.closest('section');
      var container = title && title.parentElement;

      if (!title || !container) return;

      title.id = config.id;
      if (section) section.setAttribute('aria-labelledby', config.id);

      var eyebrow = container.querySelector(':scope > .owner-rent-section-eyebrow');
      if (!eyebrow) {
        eyebrow = document.createElement('p');
        eyebrow.className = 'owner-rent-section-eyebrow';
        eyebrow.textContent = config.eyebrow;
        container.insertBefore(eyebrow, title);
      }
    });

    var contactTitle = document.querySelector('.catalog-contact__title');
    var contactSection = contactTitle && contactTitle.closest('section');
    var contactEyebrow = document.querySelector(
      '.catalog-contact .owner-rent-section-eyebrow'
    );

    if (contactEyebrow) contactEyebrow.remove();
    if (contactTitle) {
      contactTitle.id = 'owner-rent-contact-title';
      if (contactSection) contactSection.setAttribute('aria-labelledby', contactTitle.id);
    }

    document.querySelectorAll(
      '.owner-sale-services__eyebrow, .owner-sale-exclusive__eyebrow'
    ).forEach(function (eyebrow) {
      eyebrow.classList.add('owner-rent-section-eyebrow');
    });
  }

  function enhanceTypeCardActions() {
    document.querySelectorAll('.owner-sale-types__action').forEach(function (action) {
      if (action.querySelector('.owner-sale-types__action-icon')) return;

      var icon = document.createElement('span');
      icon.className = 'owner-sale-types__action-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = '<svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg>';
      action.appendChild(icon);
    });
  }

  function enhanceTypesHeading() {
    var section = document.querySelector('.owner-sale-types');
    var inner = section && section.querySelector('.owner-sale-types__inner');

    if (!section || !inner) return;

    var header = inner.querySelector(':scope > .owner-sale-types__header');
    if (!header) {
      header = document.createElement('header');
      header.className = 'owner-sale-types__header';
      header.innerHTML = [
        '<p class="owner-sale-types__eyebrow owner-rent-section-eyebrow">НАПРАВЛЕНИЯ BARNES</p>',
        '<h2 class="owner-sale-types__section-title" id="owner-rent-types-title">НЕДВИЖИМОСТЬ ДЛЯ ПРОДАЖИ</h2>'
      ].join('');
      inner.insertBefore(header, inner.firstChild);
    }

    section.setAttribute('aria-labelledby', 'owner-rent-types-title');
    section.removeAttribute('aria-label');
  }

  function scheduleServicesEnhancement() {
    window.clearTimeout(enhancementTimer);
    enhancementTimer = window.setTimeout(function () {
      reorderBrandSections();
      replaceConsultationSection();
      reorderConsultationAndTypes();
      enhancePresentationCards();
      enhanceHeroHeaderContacts();
      enhanceHeroHeader();
      enhanceHeroSection();
      enhanceStickyHeader();
      enhanceServicesSection();
      enhanceExclusiveSection();
      enhanceSectionHeadings();
      enhanceTypesHeading();
      enhanceTypeCardActions();
      setupExclusiveScrollAnimation();
    }, 600);
  }

  function syncMenuState() {
    trigger = document.querySelector('.site-header__icon-btn');
    var menu = document.querySelector('.site-menu');

    if (!trigger) return;

    trigger.setAttribute('aria-controls', menuId);
    trigger.setAttribute('aria-expanded', menu ? 'true' : 'false');
    trigger.setAttribute('aria-label', menu ? 'Закрыть меню' : 'Открыть меню');

    if (menu) {
      menu.id = menuId;
      menu.setAttribute('aria-label', 'Основное меню');
    }
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('.site-header__icon-btn')) {
      syncMenuState();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    window.setTimeout(function () {
      syncMenuState();
      if (!document.querySelector('.site-menu') && trigger) trigger.focus();
    }, 0);
  });

  new MutationObserver(function () {
    syncMenuState();
    scheduleServicesEnhancement();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncMenuState();
      scheduleServicesEnhancement();
    }, { once: true });
  } else {
    syncMenuState();
    scheduleServicesEnhancement();
  }
})();
