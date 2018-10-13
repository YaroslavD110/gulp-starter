$(function() {
  // Select styling
  let $select = $(".select");
  $select.css("display", "none");
  $select.each(function() {
    createSelect($(this), "../img/forsale-icon.png");
  });

  // Mobile menu toggle script
  $(".top-nav__toggle-btn").on("click", function() {
    $(this).toggleClass("toggled-btn");
    $(".top-nav__wrap").toggleClass("show-nav");
  });

  // Function for opening dropdown
  $("*[data-drd-btn]").on("click", function() {
    let id = $(this).data("drd-btn");
    if (id) {
      $(`div[data-drd-id=${id}]`).toggleClass("open-drd");
      $(`*[data-drd-id]:not([data-drd-id=${id}])`).removeClass("open-drd");
    }
  });
});

// Function for creating adition select
function createSelect($select, icon = null) {
  let $options = $select.find("option");
  let placeholder = icon
    ? `<img src="${icon}" />` + $($options[0]).text() + dropDownIcon
    : $($options[0]).text() + dropDownIcon;
  let $wrapper = $(document.createElement("div"));

  $wrapper.addClass("nice-select");

  let optionsHtml = "";
  for (let i = 0; i < $options.length; i++) {
    let $option = $($options[i]);

    if (!$option.attr("hidden")) {
      optionsHtml += `
        <li data-value="${$option.val()}">${$option.text()}</li>
      `;
    }
  }

  $wrapper.html(`
    <span class="nice-select__selected">${placeholder}</span>
    <ul class="nice-select__list">${optionsHtml}</ul>
  `);

  $select.parent().append($wrapper);

  $wrapper.find("li").on("click", function() {
    let value = $(this).data("value");
    $options.removeAttr("selected");
    $wrapper
      .find(".nice-select__selected")
      .html(
        icon
          ? `<img src="${icon}" />` + $(this).text() + dropDownIcon
          : $(this).text() + dropDownIcon
      )
      .parent()
      .find(".nice-select__list")
      .slideToggle(200);
    $select.find(`option[value=${value}]`).attr("selected", "selected");
  });

  $wrapper.find(".nice-select__selected").on("click", function() {
    $(this)
      .parent()
      .find(".nice-select__list")
      .slideToggle(200);
  });
}

/*************************************************************************/
const dropDownIcon = `
<svg class="nice-select__dropdown-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"S viewBox="0 0 255 255" style="enable-background:new 0 0 255 255;" xml:space="preserve">
<g>
	<g id="arrow-drop-down">
		<polygon points="0,63.75 127.5,191.25 255,63.75 		"/>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>`;
