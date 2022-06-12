const CLASS_NAME_SELECT = 'select';
const CLASS_NAME_ACTIVE = 'select_show';
const CLASS_NAME_SELECTED = 'select__option_selected';
const SELECTOR_ACTIVE = '.select_show';
const SELECTOR_DATA = '[data-select]';
const SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
const SELECTOR_OPTION_SELECTED = '.select__option_selected';

class CustomSelect {
  constructor(target, params) {
    this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
    this._params = params || {};
    if (this._params['options']) {
      this._elRoot.classList.add(CLASS_NAME_SELECT);
      this._elRoot.innerHTML = CustomSelect.template(this._params);
    }
    this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
    this._elRoot.addEventListener('click', this._onClick.bind(this));
  }
  _onClick(e) {
    const target = e.target;
    const type = target.closest(SELECTOR_DATA).dataset.select;
    switch (type) {
      case 'toggle':
        this.toggle();
        break;
      case 'option':
        this._changeValue(target);
        break;
    }
  }
  _update(option) {
    option = option.closest('.select__option');
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    option.classList.add(CLASS_NAME_SELECTED);
    this._elToggle.textContent = option.textContent;
    this._elToggle.value = option.dataset['value'];
    this._elToggle.dataset.index = option.dataset['index'];
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, option) : null;
    return option.dataset['value'];
  }
  _reset() {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    this._elToggle.textContent = 'Выберите из списка';
    this._elToggle.value = '';
    this._elToggle.dataset.index = -1;
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, null) : null;
    return '';
  }
  _changeValue(option) {
    if (option.classList.contains(CLASS_NAME_SELECTED)) {
      return;
    }
    this._update(option);
    this.hide();
  }
  show() {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
    this._elRoot.classList.add(CLASS_NAME_ACTIVE);
  }
  hide() {
    this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
  }
  toggle() {
    if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
      this.hide();
    } else {
      this.show();
    }
  }
  dispose() {
    this._elRoot.removeEventListener('click', this._onClick);
  }
  get value() {
    return this._elToggle.value;
  }
  set value(value) {
    let isExists = false;
    this._elRoot.querySelectorAll('.select__option').forEach((option) => {
      if (option.dataset['value'] === value) {
        isExists = true;
        return this._update(option);
      }
    });
    if (!isExists) {
      return this._reset();
    }
  }
  get selectedIndex() {
    return this._elToggle.dataset['index'];
  }
  set selectedIndex(index) {
    const option = this._elRoot.querySelector(`.select__option[data-index="${index}"]`);
    if (option) {
      return this._update(option);
    }
    return this._reset();
  }
}

CustomSelect.template = params => {
  const name = params['name'];
  const options = params['options'];
  const targetValue = params['targetValue'];
  let items = [];
  let selectedIndex = -1;
  let selectedValue = '';
  let selectedContent = 'Выберите из списка';
  options.forEach((option, index) => {
    let selectedClass = '';
    if (option[0] === targetValue) {
      selectedClass = ' select__option_selected';
      selectedIndex = index;
      selectedValue = option[0];
      selectedContent = option[1];
    }
    items.push(`<li class="select__option${selectedClass}" data-select="option" data-value="${option[0]}" data-index="${index}">${option[1]}</li>`);
  });
  return `<button type="button" class="select__toggle" name="${name}" value="${selectedValue}" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</button>
  <div class="select__dropdown">
    <ul class="select__options">${items.join('')}</ul>
  </div>`;
};


document.addEventListener('click', (e) => {
  if (!e.target.closest('.select')) {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
  }
});

// Скрипт выбора авто оформления заказа и размера колес
const select1 = new CustomSelect('#select-1', {
  defaultValue: 'D10-13',
  data: ['D10-13', 'D14', 'D15', 'D16', 'D17', 'D18-20', 'D21-23'],
});
const select2 = new CustomSelect('#select-2', {
  defaultValue: 'Ford',
  data: ['Volkswagen', 'Ford', 'Toyota', 'Nissan'],
});

// Скрипт выбора таблицы для показа кнопками радио
document.querySelectorAll('[name=cost-switch]').forEach(s => {
  s.addEventListener('change', function() {
    document.querySelectorAll('.cost-table').forEach(d => d.classList.add('deactive'));
    document.getElementById(this.value).classList.remove('deactive');
  });
});

// Изменение текста плейсхолдера поиска в шапке
$('.header-search input').attr('placeholder', 'ПОИСК ПО КАТАЛОГУ');

// Инициализация меню бургер
$(document).ready(function() {
  $('.menu-burger__header').click(function(){
    $('.menu-burger__header').toggleClass('open-menu');
    $('.header__nav').toggleClass('open-menu');
  });
});

//переключатель таблиц
    $(document).ready(function() {
  $(".switch-button").click(function() {
    if ($('#passenger-car').prop("checked")) {
      $('.radio-1').css("display", "none");
      $('.radio-2').css("display", "block");
      $('#passenger-car').attr('checked', false);
      $('#truck-car').prop('checked', true);
      $('#truck-car-switch').removeClass( "deactive" );
    $('#passenger-car-switch').addClass( "deactive" );
    return;
    } 
    if ($('#truck-car').prop("checked")) {
      $('.radio-1').css("display", "block");
      $('.radio-2').css("display", "none");
      $('#truck-car').prop('checked', false);
    $('#passenger-car').prop('checked', true);
    $('#truck-car-switch').addClass( "deactive" );
    $('#passenger-car-switch').removeClass( "deactive" );
    return;
    } 
  });
});

    // Переключатель размера колес мобильная версия
  if ( $(window).width() > 575 ) {
  // $("#passenger-car-switch .D10-13").css("display", "table-cell");
  //    $("#passenger-car-switch .D14").css("display", "table-cell");
  //    $("#passenger-car-switch .D15").css("display", "table-cell");
  //    $("#passenger-car-switch .D16").css("display", "table-cell");
  //    $("#passenger-car-switch .D17").css("display", "table-cell");
  //    $("#passenger-car-switch .D18-20").css("display", "table-cell");
  //    $("#passenger-car-switch .D21-23").css("display", "table-cell");
  //    $("#truck-car-switch .D10-13").css("display", "table-cell");
  //    $("#truck-car-switch .D14").css("display", "table-cell");
  //    $("#truck-car-switch .D15").css("display", "table-cell");
  //    $("#truck-car-switch .D16").css("display", "table-cell");
  //    $("#truck-car-switch .D17").css("display", "table-cell");
  //    $("#truck-car-switch .D18-20").css("display", "table-cell");
  //    $("#truck-car-switch .D21-23").css("display", "table-cell");
  }
  if ( $(window).width() < 575 ) {
  // $("#passenger-car-switch .D10-13").css("display", "table-cell");
  //    $("#passenger-car-switch .D14").css("display", "none");
  //    $("#passenger-car-switch .D15").css("display", "none");
  //    $("#passenger-car-switch .D16").css("display", "none");
  //    $("#passenger-car-switch .D17").css("display", "none");
  //    $("#passenger-car-switch .D18-20").css("display", "none");
  //    $("#passenger-car-switch .D21-23").css("display", "none");
  //    $("#truck-car-switch .D10-13").css("display", "table-cell");
  //    $("#truck-car-switch .D14").css("display", "none");
  //    $("#truck-car-switch .D15").css("display", "none");
  //    $("#truck-car-switch .D16").css("display", "none");
  //    $("#truck-car-switch .D17").css("display", "none");
  //    $("#truck-car-switch .D18-20").css("display", "none");
  //    $("#truck-car-switch .D21-23").css("display", "none");
  $('.cost .select__options').click(function(){
  setTimeout(function() { 
  if($("#select-1 .select__toggle").attr("value") == "D10-13" && $("#passenger-car-switch").not('.deactive')){
    $("#passenger-car-switch .D10-13").css("display", "table-cell");
    $("#passenger-car-switch .D14").css("display", "none");
    $("#passenger-car-switch .D15").css("display", "none");
    $("#passenger-car-switch .D16").css("display", "none");
    $("#passenger-car-switch .D17").css("display", "none");
    $("#passenger-car-switch .D18-20").css("display", "none");
    $("#passenger-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D14" && $("#passenger-car-switch").not('.deactive')){
    $("#passenger-car-switch .D10-13").css("display", "none");
    $("#passenger-car-switch .D14").css("display", "table-cell");
    $("#passenger-car-switch .D15").css("display", "none");
    $("#passenger-car-switch .D16").css("display", "none");
    $("#passenger-car-switch .D17").css("display", "none");
    $("#passenger-car-switch .D18-20").css("display", "none");
    $("#passenger-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D15" && $("#passenger-car-switch").not('.deactive')){
    $("#passenger-car-switch .D10-13").css("display", "none");
    $("#passenger-car-switch .D14").css("display", "none");
    $("#passenger-car-switch .D15").css("display", "table-cell");
    $("#passenger-car-switch .D16").css("display", "none");
    $("#passenger-car-switch .D17").css("display", "none");
    $("#passenger-car-switch .D18-20").css("display", "none");
    $("#passenger-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D16" && $("#passenger-car-switch").not('.deactive')){
    $("#passenger-car-switch .D10-13").css("display", "none");
    $("#passenger-car-switch .D14").css("display", "none");
    $("#passenger-car-switch .D15").css("display", "none");
    $("#passenger-car-switch .D16").css("display", "table-cell");
    $("#passenger-car-switch .D17").css("display", "none");
    $("#passenger-car-switch .D18-20").css("display", "none");
    $("#passenger-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("-value") == "D17" && $("#passenger-car-switch").not('.deactive')){
    $("#passenger-car-switch .D10-13").css("display", "none");
    $("#passenger-car-switch .D14").css("display", "none");
    $("#passenger-car-switch .D15").css("display", "none");
    $("#passenger-car-switch .D16").css("display", "none");
    $("#passenger-car-switch .D17").css("display", "table-cell");
    $("#passenger-car-switch .D18-20").css("display", "none");
    $("#passenger-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D18-20" && $("#passenger-car-switch").not('.deactive')){
    $("#passenger-car-switch .D10-13").css("display", "none");
    $("#passenger-car-switch .D14").css("display", "none");
    $("#passenger-car-switch .D15").css("display", "none");
    $("#passenger-car-switch .D16").css("display", "none");
    $("#passenger-car-switch .D17").css("display", "none");
    $("#passenger-car-switch .D18-20").css("display", "table-cell");
    $("#passenger-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D21-23" && $("#passenger-car-switch").not('.deactive')){
    $("#passenger-car-switch .D10-13").css("display", "none");
    $("#passenger-car-switch .D14").css("display", "none");
    $("#passenger-car-switch .D15").css("display", "none");
    $("#passenger-car-switch .D16").css("display", "none");
    $("#passenger-car-switch .D17").css("display", "none");
    $("#passenger-car-switch .D18-20").css("display", "none");
    $("#passenger-car-switch .D21-23").css("display", "table-cell");
  }
  }, 100);
  });
  $('.cost .select__options').click(function(){
  setTimeout(function() { 
  if($("#select-1 .select__toggle").attr("value") == "D10-13" && $("#truck-car-switch").not('.deactive')){
    $("#truck-car-switch .D10-13").css("display", "table-cell");
    $("#truck-car-switch .D14").css("display", "none");
    $("#truck-car-switch .D15").css("display", "none");
    $("#truck-car-switch .D16").css("display", "none");
    $("#truck-car-switch .D17").css("display", "none");
    $("#truck-car-switch .D18-20").css("display", "none");
    $("#truck-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D14" && $("#truck-car-switch").not('.deactive')){
    $("#truck-car-switch .D10-13").css("display", "none");
    $("#truck-car-switch .D14").css("display", "table-cell");
    $("#truck-car-switch .D15").css("display", "none");
    $("#truck-car-switch .D16").css("display", "none");
    $("#truck-car-switch .D17").css("display", "none");
    $("#truck-car-switch .D18-20").css("display", "none");
    $("#truck-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D15" && $("#truck-car-switch").not('.deactive')){
    $("#truck-car-switch .D10-13").css("display", "none");
    $("#truck-car-switch .D14").css("display", "none");
    $("#truck-car-switch .D15").css("display", "table-cell");
    $("#truck-car-switch .D16").css("display", "none");
    $("#truck-car-switch .D17").css("display", "none");
    $("#truck-car-switch .D18-20").css("display", "none");
    $("#truck-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D16" && $("#truck-car-switch").not('.deactive')){
    $("#truck-car-switch .D10-13").css("display", "none");
    $("#truck-car-switch .D14").css("display", "none");
    $("#truck-car-switch .D15").css("display", "none");
    $("#truck-car-switch .D16").css("display", "table-cell");
    $("#truck-car-switch .D17").css("display", "none");
    $("#truck-car-switch .D18-20").css("display", "none");
    $("#truck-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("-value") == "D17" && $("#truck-car-switch").not('.deactive')){
    $("#truck-car-switch .D10-13").css("display", "none");
    $("#truck-car-switch .D14").css("display", "none");
    $("#truck-car-switch .D15").css("display", "none");
    $("#truck-car-switch .D16").css("display", "none");
    $("#truck-car-switch .D17").css("display", "table-cell");
    $("#truck-car-switch .D18-20").css("display", "none");
    $("#truck-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D18-20" && $("#truck-car-switch").not('.deactive')){
    $("#truck-car-switch .D10-13").css("display", "none");
    $("#truck-car-switch .D14").css("display", "none");
    $("#truck-car-switch .D15").css("display", "none");
    $("#truck-car-switch .D16").css("display", "none");
    $("#truck-car-switch .D17").css("display", "none");
    $("#truck-car-switch .D18-20").css("display", "table-cell");
    $("#truck-car-switch .D21-23").css("display", "none");
  }
  if($("#select-1 .select__toggle").attr("value") == "D21-23" && $("#truck-car-switch").not('.deactive')){
    $("#truck-car-switch .D10-13").css("display", "none");
    $("#truck-car-switch .D14").css("display", "none");
    $("#truck-car-switch .D15").css("display", "none");
    $("#truck-car-switch .D16").css("display", "none");
    $("#truck-car-switch .D17").css("display", "none");
    $("#truck-car-switch .D18-20").css("display", "none");
    $("#truck-car-switch .D21-23").css("display", "table-cell");
  }
  }, 100);
  });
  }

  // Popup
  $(document).ready(function() {
    $('a.myLinkModal').click( function(event){
      event.preventDefault();
      $('#myOverlay').fadeIn(297, function(){
        $('#myModal') 
        .css('display', 'flex')
        .animate({opacity: 1}, 198);
      });
    });

    $('#myModal__close, #myOverlay').click( function(){
      $('#myModal').animate({opacity: 0}, 198,
        function(){
          $(this).css('display', 'none');
          $('#myOverlay').fadeOut(297);
      });
    });
  });


  // Переключатель карт
    $(document).ready(function() {
    $('.adress').click(function(e) {
      e.preventDefault();
      $('.adress').removeClass('active');
      $('.map-frame iframe').removeClass('active-map');
      $(this).addClass('active');
      $('.' + $(this).attr('data-value')).addClass('active-map');
    });
});
