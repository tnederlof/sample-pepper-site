// —————— PEPPER JSON LOADING —————— //

var section = document.querySelector('section');

// Load pepper data from the Google Sheet using the API
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get
var sheetID = '1J3zrxSyc0P4SaKkh4JYk97QyX11dSy1On5qOcAqGFmw'
var apiKey = 'AIzaSyD1jv8AcABffc5uc4BvV1fq73oBudtkvF8';
`string text`
var requestURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}?includeGridData=true&key=${apiKey}`;

var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
  var data = request.response;
  showPeppers(data.sheets);
  accordion();
}




// For each tab in the Google Sheet, create an array of the peppers
function showPeppers(data){

  data.forEach((v, i) => {
    // Use the title of each Tab as the key (category) name
    var key = v.properties.title;
    var data = v.data[0].rowData;
    
    // Pull out the formattedValue field from each cell
    var allValues = data.map((d) => {
      return d.values.map((v) => v.formattedValue);
    });

    // 1st array contains column names
    var names = allValues[0];
    // All but the first array contain pepper entry rows
    var rowData = allValues.slice(1);

    // For each pepper entry, create an object containing column names
    // as keys and the pepper data as values
    var list = rowData.map((d) => {
      return names.reduce((accumulator, element, index) => {
        return {...accumulator, [element]: d[index]};
      }, {});
    });
    
    // Create group divs and headers
    var group = document.createElement('div');
    group.className = "group";
    group.setAttribute('id', 'Group-' + key);

    var groupName = document.createElement('h4');
    groupName.className = "groupName";
    groupName.textContent = key;
    group.appendChild(groupName);

    // Cycle through each array

    for (var i = 0; i < list.length; i++) { 

      // Create divs and assign classes/attributes

      var set = document.createElement('div');
      set.className = "set";
      var content = document.createElement('div');
      content.className = "content";
      var pepperNameLink = document.createElement('a');
      pepperNameLink.href = "javascript:void(0);"; //Toggles collapse without scrolling to top
      var pepperName = document.createElement('div');
      pepperName.className = "pepperName";
      var plusminus = document.createElement('div');
      plusminus.className = "plusminus";
      var tagLine = document.createElement('h5');
      var pepperOrigin = document.createElement('span');
      pepperOrigin.className = "origin";
      var pepperSpecies = document.createElement('span');
      pepperSpecies.className = "species";
      var pepperDescription = document.createElement('p');
      var source = document.createElement('a');
      source.className = "source";   

      // Put array content into newly created divs   

      pepperName.textContent = list[i].Name; 
      pepperOrigin.textContent = list[i].Origin;
      pepperSpecies.textContent = list[i].Species;
      pepperDescription.textContent = list[i].Description;
      source.textContent = list[i].SourceName;
      
      var sourceURL = list[i].SourceURL;
      source.setAttribute('href', sourceURL);

      // Append all the content onto the set, then the set onto the group

      if (pepperOrigin.textContent != "") {
        tagLine.appendChild(pepperOrigin);
      }
      if (pepperSpecies.textContent != "") {
        tagLine.appendChild(pepperSpecies);
      }
      if (tagLine.textContent != "") {
        content.appendChild(tagLine);
      }
      content.appendChild(pepperDescription);
      if (source.textContent != "") {
        content.appendChild(source);
      }
      
      pepperNameLink.appendChild(pepperName);
      pepperNameLink.appendChild(plusminus); //Adds plusminus icon to link


      set.appendChild(pepperNameLink);
      set.appendChild(content);
      group.appendChild(set);

    }
    
    // Append the group onto the section

    section.appendChild(group); 


  })
}


// —————— ACCORDION —————— //

function accordion () {
  $(".set > a").on("click", function () {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".content").slideUp(200);
      $(".set > a .plusminus").removeClass("active");
    } else {
      $(".set > a .plusminus").removeClass("active");
      $(this).find(".plusminus").addClass("active");
      $(".set > a").removeClass("active");
      $(this).addClass("active");
      $(".content").slideUp(200);
      $(this).siblings(".content").slideDown(200);
    }
  });
};


// ————————————— SEARCH BAR ————————————— //

function onSearch() {

  var value = $("#search").val().toLowerCase();
  $(".set").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });

  // Scroll to top of accordion section
  $('html,body').animate({
    scrollTop: $(".accordion-container").offset().top - 58
  }, 500); // -40 from top accounts for header height

  // Close open sets
  $(".set > a").removeClass("active");
  $(".set > a").siblings(".content").slideUp(200);
  $(".set > a .plusminus").removeClass("active");

};


// ————————————— SHADOW FUN ————————————— //

$(window).scroll(function() {
  $(".groupName").each(function(i,e) {
    var tp = $(e).offset().top - $(document).scrollTop();
    if (tp == 56) {
      $(e).addClass("addShadow");
    } else {
      $(e).removeClass("addShadow");
    }
  });
});








