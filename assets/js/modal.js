function toggleModalClasses(event) {
    var modalId = event.currentTarget.dataset.modalId;
    var modal = $(modalId);
    modal.toggleClass('is-active');
    $('html').toggleClass('is-clipped');
  };


$( document ).ready(function() {
  $('.action-open-modal').click(toggleModalClasses);
  $('.action-close-modal').click(toggleModalClasses);
});
