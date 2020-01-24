

// User Details
function getUserDetails(){
    $.ajax({
        type: "GET",
        url: "https://api.github.com/users/supreetsingh247",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            $.extend( USER_DETAILS, result );
            setSideNavValues();
        }
    });
}

function setSideNavValues(){
    var appendStr = "#user_";
    $.each(USER_DETAILS, function(key,value){
        var _ele = $(appendStr+key);
        if(key=="avatar_url") _ele.attr({'src':value});
        else _ele.text(value);
    });
}

// Repos
function getRepos(){
    $.ajax({
        type: "GET",
        url: "https://api.github.com/users/supreetsingh247/repos",
        contentType: "application/json; charset=utf-8",
        success: function(result){
            $.extend( REPO_DETAILS, result );
            setRepos(REPO_DETAILS);
            $('#repo_badge').text(REPO_DETAILS.length);
        }
    });
}

function setRepos(repoArray) {
    var repoContent = $("#repo_content").html('');
    if(repoArray.length == 0){
        repoContent.html('No Repositories')
    }
    $.each(repoArray, function(key,value){
        var divEle = $('<div>').addClass('repo-item');
        divEle.append('<h3><a href="'+value.html_url+'" target="_blank">'+value.name+'</a></h3>');
        divEle.append('<p class="desc">'+value.description+'</p>');
        divEle.append(function(){
            return $('<div>').addClass('details')
                    .append('<span class="circle"></span><span class="lang">'+value.language+'</span>')
                    .append('<span class="time">'+time_ago(new Date(value.updated_at))+'</span>')
        });
        repoContent.append(divEle);
    });    
    
}

// Time Ago
function time_ago(time) {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;
  
    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
}


// Tabs Init
function tabsInit(){
    $('#tabs li a:not([target="reposTab"])').addClass('inactive');
    $('.tab-container').hide();
    $('.tab-container#reposTab').show();

    

    $('#tabs li a').click(function(){
        var t = $(this).attr('target');
        if($(this).hasClass('inactive')){
            $('#tabs li a').addClass('inactive');
            $(this).removeClass('inactive');
            $('.tab-container').hide();
            $('#'+ t).fadeIn('slow');
        }
    });
}

// Search 
function searchByName(searchVal){
    EXPECTED_ARRAY = [];
    $.each(REPO_DETAILS, function(key,value){
        if(value.name.includes(searchVal)){
            EXPECTED_ARRAY.push(value);
        } 
    });
    setRepos(EXPECTED_ARRAY);
}
function searchByNameInit(){
    var inputEle = $("#search_by_name");
    inputEle.on('keyup', function(){
        searchByName(this.value);
    });
}

function filterInit(){
    var selectEle = $("#filter_by_lang");
    selectEle.on('change', function(){
        var searchValue = this.value;
        EXPECTED_ARRAY = [];
        $.each(REPO_DETAILS, function(key,value){
            if(value.language == searchValue){
                EXPECTED_ARRAY.push(value);
            }
            if(searchValue == 'All') EXPECTED_ARRAY = REPO_DETAILS;
        });
        setRepos(EXPECTED_ARRAY);
    });
}

$(document).ready(function(){
    tabsInit();
    getUserDetails();
    getRepos();
    searchByNameInit();
    filterInit();
});