var carouselIndex = 0;
var isAnimating = false;

(function () {

  $('#quiz-results-section').hide();

  var carouselTransition, carouselContent, carouselLength, firstClone, firstItem, isAnimating, itemWidth, lastClone, lastItem;
  carouselTransition = 400;
  carouselContent = $('.carousel__content');
  carouselMax = 0;
  carouselLength = carouselContent.children().length;
  isAnimating = false;
  itemWidth = 100 / carouselLength;
  firstItem = $(carouselContent.children()[0]);
  lastItem = $(carouselContent.children()[carouselLength - 1]);
  firstClone = null;
  lastClone = null;
  carouselContent.css('width', carouselLength * 100 + '%');
  carouselContent.transition({ x: carouselIndex * -itemWidth + '%' }, 0);
  $.each(carouselContent.children(), function () {
      return $(this).css('width', itemWidth + '%');
  });
  $('.nav--buttons--left').on('click', function (event) {
      event.preventDefault();
      if (isAnimating || carouselIndex === 0) {
          return;
      }
      isAnimating = true;
      carouselIndex--;
      update_progress_bar(carouselIndex);
      return carouselContent.transition({ x: carouselIndex * -itemWidth + '%' }, carouselTransition, 'ease', function () {
          return isAnimating = false;
      });
  });
  $('.nav--buttons--right').on('click', function (event) {
      event.preventDefault();
      if (isAnimating || carouselIndex === carouselLength - 1) {
          return;
      }
      isAnimating = true;
      carouselIndex++;
      update_progress_bar(carouselIndex);
      if ( carouselIndex > carouselMax ) {
        carouselMax = carouselIndex;
      }
      return carouselContent.transition({ x: carouselIndex * -itemWidth + '%' }, carouselTransition, 'ease', function () {
          return isAnimating = false;
      });
  });
}.call(this));

function calc_results() {
  var count;
  $(".questions").each(function(){
    if(this.is(":checked")) {
      count++;
    }
  });
}

var results = [
  [3,4,4,2],
  [2,4,3,2],
  [4,4,4,1],
  [4,4,3,1],
  [4,4,4,4],
  [3,3,0],
  [2,3,3,0],
  [3,4,4,3],
  [2,4,4,1],
  [4,4,2,4]
]

async function calc_results(button_elem) {
  var count = 0;
  var checked = 0;
  var size = $("input[name=size]:checked").val();
  $(":checked").each(function() {
    checked++;
  });

  var radios = jQuery("input[type='radio']");
  radios = radios.filter(":checked");

  var array = [];
  for(var i=0; i<radios.length; i++) {
    array.push(radios[i].getAttribute("id"));
  }

  var score = 0;
  var message = "";

  if(array.length == 10) {
    for(var i=0; i<array.length; i++) {
      var temp = array[i].substring(1);
      if(temp.length == 3) {
        score += results[9][parseInt(temp[2])-1];
      } else {
        score += results[parseInt(temp[0])-1][parseInt(temp[1])-1];
      }
    }

    if(score >= 30) {
      message = `You are an excellent fit for Brainworks! Write to us at workwithus@brainworks.world and we’ll let you know the next steps.`;
    } else if(score >= 21) {
      message = `You can be a good fit for Brainworks. Write to us at workwithus@brainworks.world and we’ll let you know the next steps.`;
    } else {
      message = "We think Brainworks might not be the best choice for you. We wish you all the best! ";
    }
  } else {
    message = "Please answer all the questions."
    
    var a = [];
    for(var i=0; i<array.length; i++) {
      var temp = array[i].substring(1);
      if(temp.length == 3) {
        a.push(9);
      } else {
        a.push(parseInt(temp[0])-1);
      }
    }

    var pos = 0;
    for(var i=0; i<=9; i++) {
      if(i!=a[i]) {
        pos = i+1;
        break;
      }
    }
    var count = 11-pos;
    count = parseInt(count);

    var carouselContent = $('.carousel__content');
    var carouselLength = carouselContent.children().length;
    var isAnimating = false;
    var itemWidth = 100 / carouselLength;

    if (isAnimating || carouselIndex === 0) {
        return;
    }
    isAnimating = true;
    carouselIndex-=count;
    var time = (count)*300;
    console.log(time);
    update_progress_bar(carouselIndex);
    return carouselContent.transition({ x: carouselIndex * -itemWidth + '%' }, time, 'ease', function () {
        return isAnimating = false;
    });
  }

  $('#quiz-results-message-section').text(message);
  $('#quiz-results-section').slideDown();
  $('#quiz-results-message-section').slideDown();
  $('#close-button').slideDown();
}

$('#quiz-close-button').click(function() {
  $('#quiz-results-section').slideUp();
  $('#quiz-results-message-section').slideUp();
  $('#close-button').slideUp();
});

function update_progress_bar(index) {
  var checked = index;
  if ( checked === 0) {
    $(".progress-bar-insider").css("width", "10%");
  }
  else {
    checked = checked;
    $(".progress-bar-insider").css("width", ((checked/10)*100 + 10) + "%");
  }
}

$(".carousel--item input[type=radio]").click(function(){
  $("#auto-con-calc").slideUp();
  $('.nav--buttons--right').trigger('click');
});
