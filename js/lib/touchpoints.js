/*
  This JS is included directly from the touchpoints app.  Included here to
  avoid writing unsafe content security policy allowances just for touchpoints.
  Minor changes were made to the original source to avoid inline styles.

  Removed loadCss() function and moved the CSS content to sass/_touchpoints.scss
*/

// Form components are namespaced under 'fba' = 'Feedback Analytics'
'use strict';

function FBAform(d, N) {
  return {
    formId: "15ca967f",
    formComponent: function () {
      return document.querySelector("[data-touchpoints-form-id='" + this.formId + "']")
    },
    formElement: function () {
      return this.formComponent().querySelector("form");
    },
    activatedButton: null, // tracks a reference to the button that was clicked to open the modal
    isFormSubmitted: false, // defaults to false

    // enable Javascript experience
    javscriptIsEnabled: function () {
      var javascriptDisabledMessage = document.getElementsByClassName("javascript-disabled-message")[0];
      var touchpointForm = document.getElementsByClassName("touchpoint-form")[0];
      if (javascriptDisabledMessage) {
        javascriptDisabledMessage.classList.add("hide");
      }
      if (touchpointForm) {
        touchpointForm.classList.remove("hide");
      }
    },
    init: function (options) {
      this.javscriptIsEnabled();
      this.options = options;
      this.loadHtml();
      this.bindEventListeners();
      this.dialogOpen = false; // initially false
      this.successState = false; // initially false
      this.pagination();
      this.formSpecificScript();
      document.dispatchEvent(new Event('onTouchpointsFormLoaded'));
      return this;
    },
    formSpecificScript: function () {
    },
    bindEventListeners: function () {
      var self = this;
      d.addEventListener('keyup', function (event) {
        var x = event.keyCode;
        if (x == 27 && self.dialogOpen == true) {
          self.closeDialog();
        }
      });
      d.addEventListener('click', function (event) {
        self.handleClick(event);
      });

      const textareas = this.formComponent().querySelectorAll(".usa-textarea");
      textareas.forEach(function (textarea) {
        if (textarea.getAttribute("maxlength") != '0' && textarea.getAttribute("maxlength") != '10000') {
          textarea.addEventListener("keyup", self.textCounter);
        }
      });

      const textFields = this.formComponent().querySelectorAll(".usa-input[type='text']");
      textFields.forEach(function (textField) {
        if (textField.getAttribute("maxlength") != '0' && textField.getAttribute("maxlength") != '10000') {
          textField.addEventListener("keyup", self.textCounter);
        }
      });

    },
    loadHtml: function () {

      this.dialogEl = document.createElement('div');
      this.dialogEl.setAttribute("hidden", true);
      this.dialogEl.setAttribute('class', 'fba-modal');

      this.dialogEl.innerHTML = "<div id=\"fba-modal-dialog\"\n  class=\"fba-modal-dialog\"\n  role=\"dialog\"\n  aria-label=\"Feedback modal dialog\"\n  aria-modal=\"true\">\n  <div class=\"touchpoints-form-wrapper open-ended\"\n  id=\"touchpoints-form-15ca967f\"\n  data-touchpoints-form-id=\"15ca967f\" tabindex=\"-1\">\n  <div class=\"wrapper\">\n    <h2 class=\"word-break fba-modal-title\">\n  <div class=\"margin-bottom-2 text-center\">\n      <img alt=\"General Services Administration logo\" class=\"form-header-logo-square\" src=\"https://cg-1b082c1b-3db7-477f-9ca5-bd51a786b41e.s3-us-gov-west-1.amazonaws.com/uploads/form/logo/3746/logo_square_analytics-fav.jpg\" />\n  <\/div>\n  Feedback for analytics.usa.gov\n<\/h2>\n\n\n      <a class=\"fba-modal-close\"\n        type=\"button\"\n        href=\"#\"\n        aria-label=\"Close this window\">×<\/a>\n\n    <p class=\"fba-instructions\">\n      Please let us know how we can improve this site and product.\n    <\/p>\n    <p class=\"required-questions-notice\">\n      <small>\n        A red asterisk (<abbr title=\"required\" class=\"usa-hint--required\">*<\/abbr>) indicates a required field.\n      <\/small>\n    <\/p>\n    <div class=\"fba-alert usa-alert usa-alert--success\" role=\"status\" hidden>\n  <div class=\"usa-alert__body\">\n    <h3 class=\"usa-alert__heading\">\n      Success\n    <\/h3>\n    <div class=\"usa-alert__text\">\n      Thank you for your feedback!\n    <\/div>\n  <\/div>\n<\/div>\n<div class=\"fba-alert-error usa-alert usa-alert--error\" role=\"alert\" hidden>\n  <div class=\"usa-alert__body\">\n    <h3 class=\"usa-alert__heading\">\n      Error\n    <\/h3>\n    <p class=\"usa-alert__text\">\n      alert message\n    <\/p>\n  <\/div>\n<\/div>\n\n    \n<form\n  action=\"https://touchpoints.app.cloud.gov/touchpoints/15ca967f/submissions.json\"\n  class=\"usa-form usa-form--large margin-bottom-2\"\n  method=\"POST\">\n  <div class=\"touchpoints-form-body\">\n        <input type=\"hidden\" name=\"fba_location_code\" id=\"fba_location_code\" autocomplete=\"off\" />\n    <input type=\"text\"\n      name=\"fba_directive\"\n      id=\"fba_directive\"\n      title=\"fba_directive\"\n      aria-hidden=\"true\"\n      tabindex=\"-1\"\n      autocomplete=\"off\">\n      <div class=\"section visible\">\n\n\n\n        <div class=\"questions\">\n\n          <div class=\"question white-bg\">\n              \n<div role=\"group\">\n  <label class=\"usa-label\" for=\"answer_01\">\n  Name\n<\/label>\n\n  <input type=\"text\" name=\"answer_01\" id=\"answer_01\" class=\"usa-input\" maxlength=\"10000\" />\n\n<\/div>\n\n          <\/div>\n\n          <div class=\"question white-bg\">\n              \n<div role=\"group\">\n  <label class=\"usa-label\" for=\"answer_02\">\n  Email\n<\/label>\n\n  <input type=\"text\" name=\"answer_02\" id=\"answer_02\" class=\"usa-input\" maxlength=\"10000\" />\n\n<\/div>\n\n          <\/div>\n\n          <div class=\"question white-bg\">\n              <div role=\"group\">\n  <label class=\"usa-label\" for=\"answer_03\">\n  Response body\n  <abbr title=\"required\" class=\"usa-hint--required\">*<\/abbr>\n<\/label>\n\n  <textarea name=\"answer_03\" id=\"answer_03\" class=\"usa-textarea\" required=\"required\" maxlength=\"2500\">\n<\/textarea>\n  <span class=\"counter-msg usa-hint usa-character-count__message\" aria-live=\"polite\">\n    2500 characters allowed\n  <\/span>\n<\/div>\n\n          <\/div>\n        <\/div>\n\n          <button type=\"submit\" class=\"usa-button submit_form_button\">Submit<\/button>\n      <\/div>\n  <\/div>\n<\/form>\n\n  <\/div>\n  \n    <div class=\"touchpoints-form-disclaimer\">\n  <hr id=\"touchpoints-hr\">\n  <div class=\"grid-container\">\n    <div class=\"grid-row\">\n      <div class=\"grid-col-12\">\n        <small class=\"fba-dialog-privacy\">\n          <a href=\"https://www.gsa.gov/reference/gsa-privacy-program/privacy-act-statement-for-design-research\" target=\"_blank\" rel=\"noopener\">Privacy Act Statement for Design Research<\/a>\n        <\/small>\n      <\/div>\n    <\/div>\n  <\/div>\n<\/div>\n\n<div class=\"usa-banner\">\n  <footer class=\"usa-banner__header touchpoints-footer-banner\">\n    <div class=\"usa-banner__inner\">\n      <div class=\"grid-col-auto\">\n        <img\n            aria-hidden=\"true\"\n            class=\"usa-banner__header-flag\"\n            src=\"https://touchpoints.app.cloud.gov/img/us_flag_small.png\"\n            alt=\"U.S. flag\"\n          />\n      <\/div>\n      <div class=\"grid-col-fill tablet:grid-col-auto\" aria-hidden=\"true\">\n        <p class=\"usa-banner__header-text\">\n          An official form of the United States government.\n          Provided by\n          <a href=\"https://touchpoints.digital.gov\" target=\"_blank\" rel=\"noopener\" class=\"usa-link--external\">Touchpoints<\/a>\n          <br>\n\n        <\/p>\n      <\/div>\n    <\/div>\n  <\/footer>\n<\/div>\n\n\n<\/div>\n<\/div>\n";
      d.body.appendChild(this.dialogEl);

      d.querySelector('.fba-modal-close').addEventListener('click', this.handleDialogClose.bind(this), false);
      var otherElements = d.querySelectorAll(".usa-input.other-option");
      for (var i = 0; i < otherElements.length; i++) {
        otherElements[i].addEventListener('keyup', this.handleOtherOption.bind(this), false);
      }
      var phoneElements = d.querySelectorAll("input[type='tel']");
      for (var i = 0; i < phoneElements.length; i++) {
        phoneElements[i].addEventListener('keyup', this.handlePhoneInput.bind(this), false);
      }
      if (d.getElementById(this.options.elementSelector) != null) {
        d.getElementById(this.options.elementSelector).addEventListener('click', this.handleButtonClick.bind(this), false);
      }

      var formElement = this.formElement();
      // returns 1 or more submit buttons within the Touchpoints form
      var submitButtons = formElement.querySelectorAll("[type='submit']");
      var that = this;

      var yesNoForm = formElement.querySelector('.touchpoints-yes-no-buttons');

      if (yesNoForm) { // only for yes/no questions
        Array.prototype.forEach.call(submitButtons, function (submitButton) {
          submitButton.addEventListener('click', that.handleYesNoSubmitClick.bind(that), false);
        })
      } else { // for all other types of forms/questions
        if (submitButtons) {
          Array.prototype.forEach.call(submitButtons, function (submitButton) {
            submitButton.addEventListener('click', that.handleSubmitClick.bind(that), false);
          })
        }
      }
    },
    resetErrors: function () {
      var formComponent = this.formComponent();
      var alertElement = formComponent.querySelector(".fba-alert");
      var alertElementHeading = formComponent.getElementsByClassName("usa-alert__heading")[0];
      var alertElementBody = formComponent.getElementsByClassName("usa-alert__text")[0];
      var alertErrorElement = formComponent.querySelector(".fba-alert-error");
      var alertErrorElementBody = alertErrorElement.getElementsByClassName("usa-alert__text")[0];
      alertElement.setAttribute("hidden", true);
      alertElementHeading.innerHTML = "";
      alertElementBody.innerHTML = "";
      alertErrorElement.setAttribute("hidden", true);
      alertErrorElementBody.innerHTML = "";
    },
    handleClick: function (e) {
      if (this.dialogOpen && !e.target.closest('#' + this.options.elementSelector) && !e.target.closest('.fba-modal-dialog')) {
        this.closeDialog();
      }
    },
    handleButtonClick: function (e) {
      e.preventDefault();
      this.activatedButton = e.target;
      this.loadDialog();
    },
    handleDialogClose: function (e) {
      e.preventDefault();
      this.closeDialog();
    },
    handleOtherOption: function (e) {
      var selectorId = "#" + e.srcElement.getAttribute("data-option-id");
      var other_val = e.target.value.replace(/,/g, '');
      if (other_val == '') other_val = 'other';
      var option = this.formElement().querySelector(selectorId);
      option.value = other_val;
    },
    handlePhoneInput: function (e) {
      var number = e.srcElement.value.replace(/[^\d]/g, '');
      if (number.length == 7) {
        number = number.replace(/(\d{3})(\d{4})/, "$1-$2");
      } else if (number.length == 10) {
        number = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      }
      e.srcElement.value = number;
    },
    handleEmailInput: function (e) {
      var EmailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var email = e.srcElement.value.trim();
      if (email.length == 0) {
        return;
      }
      result = EmailRegex.test(email);
      if (!result) {
        showWarning($(this), "Please enter a valid email address");
      } else {
        showValid($(this));
      }
      e.srcElement.value = number;
    },
    handleSubmitClick: function (e) {
      e.preventDefault();
      this.resetErrors();
      var formElement = this.formElement();
      var self = this;
      if (self.validateForm(formElement)) {
        // disable submit button and show sending feedback message
        var submitButton = formElement.querySelector("[type='submit']");
        submitButton.disabled = true;
        submitButton.classList.add("aria-disabled");
        self.sendFeedback();
      }
    },
    handleYesNoSubmitClick: function (e) {
      e.preventDefault();

      var input = this.formComponent().querySelector('.fba-touchpoints-page-form');
      input.value = e.target.value;
      this.resetErrors();
      var self = this;
      var formElement = this.formElement();
      if (self.validateForm(formElement)) {
        var submitButtons = formElement.querySelectorAll("[type='submit']");
        Array.prototype.forEach.call(submitButtons, function (submitButton) {
          submitButton.disabled = true;
        })
        self.sendFeedback();
      }
    },
    validateForm: function (form) {
      this.hideValidationError(form);
      var valid = this.checkRequired(form) && this.checkEmail(form) && this.checkPhone(form) && this.checkDate(form);
      return valid;
    },
    checkRequired: function (form) {
      var requiredItems = form.querySelectorAll('[required]');
      var questions = {};
      // Build a dictionary of questions which require an answer
      Array.prototype.forEach.call(requiredItems, function (item) { questions[item.name] = item });

      Array.prototype.forEach.call(requiredItems, function (item) {
        switch (item.type) {
          case 'radio':
            if (item.checked) delete (questions[item.name]);
            break;
          case 'checkbox':
            if (item.checked) delete (questions[item.name]);
            break;
          case 'select-one':
            if (item.selectedIndex > 0) delete (questions[item.name]);
            break;
          default:
            if (item.value.length > 0) delete (questions[item.name]);
        }
      });
      for (var key in questions) {
        this.showValidationError(questions[key], 'A response is required: ');
        return false;
      }
      return true;
    },
    checkDate: function (form) {
      var dateItems = form.querySelectorAll('.date-select');
      var questions = {};
      // Build a dictionary of questions which require an answer
      Array.prototype.forEach.call(dateItems, function (item) { questions[item.name] = item });
      Array.prototype.forEach.call(dateItems, function (item) {
        if (item.value.length == 0) {
          delete (questions[item.name]);
        } else {
          var isValidDate = Date.parse(item.value);
          if (!isNaN(isValidDate)) delete (questions[item.name]);
        }
      });
      for (var key in questions) {
        this.showValidationError(questions[key], 'Please enter a valid value: ');
        return false;
      }
      return true;
    },
    checkEmail: function (form) {
      var emailItems = form.querySelectorAll('input[type="email"]');
      var questions = {};
      // Build a dictionary of questions which require an answer
      Array.prototype.forEach.call(emailItems, function (item) { questions[item.name] = item });
      Array.prototype.forEach.call(emailItems, function (item) {
        if (item.value.length == 0) {
          delete (questions[item.name]);
        } else {
          var EmailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (EmailRegex.test(item.value)) delete (questions[item.name]);
        }
      });
      for (var key in questions) {
        this.showValidationError(questions[key], 'Please enter a valid value: ');
        return false;
      }
      return true;
    },
    checkPhone: function (form) {
      var phoneItems = form.querySelectorAll('input[type="tel"]');
      var questions = {};
      // Build a dictionary of questions which require an answer
      Array.prototype.forEach.call(phoneItems, function (item) { questions[item.name] = item });
      Array.prototype.forEach.call(phoneItems, function (item) {
        if (item.value.length == 0) {
          delete (questions[item.name]);
        } else {
          var PhoneRegex = /^[0-9]{10}$/;
          if (PhoneRegex.test(item.value)) delete (questions[item.name]);
        }
      });
      for (var key in questions) {
        this.showValidationError(questions[key], 'Please enter a valid value: ');
        return false;
      }
      return true;
    },
    showValidationError: function (question, error) {
      var questionDiv = question.closest(".question");
      var label = questionDiv.querySelector(".usa-label") || questionDiv.querySelector(".usa-legend");
      var questionNum = label.innerText;

      // show page with validation error
      var errorPage = question.closest(".section");
      if (!errorPage.classList.contains("visible")) {
        var visiblePage = this.formComponent().getElementsByClassName("section visible")[0];
        visiblePage.classList.remove("visible");
        errorPage.classList.add("visible");
      }

      questionDiv.setAttribute('class', 'usa-form-group usa-form-group--error');
      var span = document.createElement('span');
      span.setAttribute('id', 'input-error-message');
      span.setAttribute('role', 'alert');
      span.setAttribute('class', 'usa-error-message');
      span.innerText = error + questionNum;
      label.parentNode.insertBefore(span, label.nextSibling);
      var input = document.createElement('input');
      input.setAttribute('hidden', 'true');
      input.setAttribute('id', 'input-error');
      input.setAttribute('type', 'text');
      input.setAttribute('name', 'input-error');
      input.setAttribute('aria-describedby', 'input-error-message');
      questionDiv.appendChild(input);
      questionDiv.scrollIntoView();
      questionDiv.focus();

      // enable submit button ( so user can fix error and resubmit )
      var submitButton = document.querySelector("[type='submit']");
      submitButton.disabled = false;
      submitButton.classList.remove("aria-disabled");
    },
    hideValidationError: function (form) {
      var elem = form.querySelector('.usa-form-group--error');
      if (elem == null) return;
      elem.setAttribute('class', 'question');
      var elem = form.querySelector('#input-error-message');
      if (elem != null) elem.parentNode.removeChild(elem);
      elem = form.querySelector('#input-error');
      if (elem != null) elem.parentNode.removeChild(elem);
    },
    textCounter: function (event) {
      const field = event.target;
      const maxLimit = event.target.getAttribute("maxlength");

      var countfield = field.parentNode.querySelector(".counter-msg");
      if (field.value.length > maxLimit) {
        field.value = field.value.substring(0, maxLimit);
        countfield.innerText = '0 characters left';
        return false;
      } else {
        countfield.innerText = "" + (maxLimit - field.value.length) + " characters left";
      }
    },
    loadButton: function () {
      // Add the fixed, floating tab button
      this.buttonEl = document.createElement('a');
      this.buttonEl.setAttribute('id', 'fba-button');
      this.buttonEl.setAttribute('data-id', '15ca967f');
      this.buttonEl.setAttribute('class', 'fixed-tab-button usa-button');
      this.buttonEl.setAttribute('href', '#');
      this.buttonEl.setAttribute('aria-haspopup', 'dialog');
      this.buttonEl.setAttribute('aria-controls', 'dialog');
      this.buttonEl.addEventListener('click', this.handleButtonClick.bind(this), false);
      this.buttonEl.innerHTML = this.options.modalButtonText;
      d.body.appendChild(this.buttonEl);

      this.loadFeebackSkipLink();
    },
    loadFeebackSkipLink: function () {
      this.skipLink = document.createElement('a');
      this.skipLink.setAttribute('class', 'usa-skipnav touchpoints-skipnav');
      this.skipLink.setAttribute('href', '#fba-button');
      this.skipLink.addEventListener('click', function () {
        document.querySelector("#fba-button").focus();
      });
      this.skipLink.innerHTML = 'Skip to feedback';

      var existingSkipLinks = document.querySelector('.usa-skipnav');
      if (existingSkipLinks) {
        existingSkipLinks.insertAdjacentElement('afterend', this.skipLink);
      } else {
        d.body.prepend(this.skipLink);
      }
    },
    // Used when in a modal
    loadDialog: function () {
      document.dispatchEvent(new Event('onTouchpointsModalOpen'));
      d.querySelector('.fba-modal').removeAttribute("hidden");
      d.getElementById("touchpoints-form-15ca967f").focus();
      this.dialogOpen = true;
    },
    closeDialog: function () {
      document.dispatchEvent(new Event('onTouchpointsModalClose'));
      d.querySelector('.fba-modal').setAttribute("hidden", true);
      this.resetFormDisplay();
      this.activatedButton.focus();
      this.dialogOpen = false;
    },
    sendFeedback: function () {
      document.dispatchEvent(new Event('onTouchpointsFormSubmission'));
      var form = this.formElement();
      this.ajaxPost(form, this.formSuccess);
    },
    successHeadingText: function () {
      return "Success";
    },
    successText: function () {
      return "Thank you for your feedback!";
    },
    showFormSuccess: function (e) {
      var formComponent = this.formComponent();
      var formElement = this.formElement();
      var alertElement = formComponent.querySelector(".fba-alert");
      var alertElementHeading = formComponent.querySelector(".usa-alert__heading");
      var alertElementBody = formComponent.querySelector(".usa-alert__text");

      // Display success Message
      alertElementHeading.innerHTML += this.successHeadingText();
      alertElementBody.innerHTML = this.successText();
      alertElement.removeAttribute("hidden");

      // Hide Form Elements
      if (formElement) {
        // And clear the Form's Fields
        formElement.reset();
        if (formElement.querySelector('.touchpoints-form-body')) {
          var formBody = formElement.querySelector('.touchpoints-form-body');
          if (formBody) {
            formBody.setAttribute("hidden", true);
          }
        }
        if (formComponent.querySelector('.touchpoints-form-disclaimer')) {
          var formDisclaimer = formComponent.querySelector('.touchpoints-form-disclaimer');
          if (formDisclaimer) {
            formDisclaimer.setAttribute("hidden", true);
          }
        }

      }
    },
    resetFormDisplay: function () {
      if (this.successState === false) {
        return false;
      }

      // Hide and Reset Flash Message
      this.resetErrors();

      // Re-enable Submit Button
      var formElement = this.formElement();
      var submitButton = formElement.querySelector("[type='submit']");
      submitButton.disabled = false;

      // Show Form Elements
      if (formElement) {
        if (formElement.querySelector('.touchpoints-form-body')) {
          var formBody = formElement.querySelector('.touchpoints-form-body')
          if (formBody) {
            formBody.removeAttribute("hidden");
          }
        }
      }
    },
    formSuccess: function (e) {
      // Clear the alert box
      var formComponent = this.formComponent();
      var alertElement = formComponent.querySelector(".fba-alert");
      var alertElementBody = formComponent.getElementsByClassName("usa-alert__text")[0];
      var alertErrorElement = formComponent.querySelector(".fba-alert-error");
      var alertErrorElementBody = alertErrorElement.getElementsByClassName("usa-alert__text")[0];
      alertElementBody.innerHTML = "";
      alertErrorElementBody.innerHTML = "";

      var formElement = this.formElement();
      var submitButton = formElement.querySelector("[type='submit']");

      if (e.target.readyState === 4) {
        if (e.target.status === 201) { // SUCCESS!
          this.successState = true;
          document.dispatchEvent(new Event('onTouchpointsFormSubmissionSuccess'));
          this.isFormSubmitted = true;
          if (submitButton) {
            submitButton.disabled = true;
          }
          this.showFormSuccess();
        } else if (e.target.status === 422) { // FORM ERRORS
          this.successState = false;
          document.dispatchEvent(new Event('onTouchpointsFormSubmissionError'));
          if (submitButton) {
            submitButton.disabled = false;
          }

          var jsonResponse = JSON.parse(e.target.response);
          var errors = jsonResponse.messages;

          for (var err in errors) {
            if (errors.hasOwnProperty(err)) {
              alertErrorElementBody.innerHTML += err;
              alertErrorElementBody.innerHTML += " ";
              alertErrorElementBody.innerHTML += errors[err];
              alertErrorElementBody.innerHTML += "<br />";
            }
          }

          alertErrorElement.removeAttribute("hidden");
        } else { // OTHER SERVER ERROR
          alertErrorElement.removeAttribute("hidden");
          alertErrorElementBody.innerHTML += "Server error. We're sorry, but this submission was not successful. The Product Team has been notified.";
        }
      }
    },
    ajaxPost: function (form, callback) {
      var url = form.action;
      var xhr = new XMLHttpRequest();

      // for each form question
      var params = {
        answer_01:
          form.querySelector("#answer_01") && form.querySelector("#answer_01").value,
        answer_02:
          form.querySelector("#answer_02") && form.querySelector("#answer_02").value,
        answer_03:
          form.querySelector("#answer_03") && form.querySelector("#answer_03").value,
      }

      // Combine Referrer and Pathname with Form-specific params
      params["referer"] = d.referrer;
      params["hostname"] = window.location.hostname;
      params["page"] = window.location.pathname;
      params["location_code"] = form.querySelector("#fba_location_code") ? form.querySelector("#fba_location_code").value : null;
      params["fba_directive"] = form.querySelector("#fba_directive") ? form.querySelector("#fba_directive").value : null;
      params["language"] = "en";

      // Submit Feedback with a POST
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8;");
      xhr.onload = callback.bind(this);
      xhr.send(JSON.stringify({
        "submission": params,
      }));
    },
    currentPageNumber: 1, // start at 1
    showInstructions: function () {
      const instructions = this.formComponent().getElementsByClassName("fba-instructions")[0];

      if (instructions) {
        if (this.currentPageNumber == 1) {
          instructions.removeAttribute("hidden");
        } else {
          instructions.setAttribute("hidden", true);
        }
      }

      const requiredQuestionsNotice = this.formComponent().getElementsByClassName("required-questions-notice")[0];
      if (requiredQuestionsNotice) {
        if (this.currentPageNumber == 1) {
          requiredQuestionsNotice.removeAttribute("hidden");
        } else {
          requiredQuestionsNotice.setAttribute("hidden", true);
        }
      }
    },
    pagination: function () {
      var previousButtons = document.getElementsByClassName("previous-section");
      var nextButtons = document.getElementsByClassName("next-section");

      var self = this;
      for (var i = 0; i < previousButtons.length; i++) {
        previousButtons[i].addEventListener('click', function (e) {
          e.preventDefault();
          var currentPage = e.target.closest(".section");
          if (!this.validateForm(currentPage)) return false;
          currentPage.classList.remove("visible");
          this.currentPageNumber--;
          this.showInstructions();

          const previousPageEvent = new Event('onTouchpointsFormPreviousPage');
          previousPageEvent.page = this.currentPageNumber;
          document.dispatchEvent(previousPageEvent);

          currentPage.previousElementSibling.classList.add("visible");

          // if in a modal, scroll to the top of the modal on previous button click
          if (document.getElementsByClassName("fba-modal")[0]) {
            document.getElementsByClassName("fba-modal")[0].scrollTo(0, 0);
          } else {
            window.scrollTo(0, 0);
          }
        }.bind(self));
      }
      for (var i = 0; i < nextButtons.length; i++) {
        nextButtons[i].addEventListener('click', function (e) {
          e.preventDefault();
          var currentPage = e.target.closest(".section");
          if (!this.validateForm(currentPage)) return false;
          currentPage.classList.remove("visible");
          this.currentPageNumber++;
          this.showInstructions();

          const nextPageEvent = new Event('onTouchpointsFormNextPage');
          nextPageEvent.page = this.currentPageNumber;
          document.dispatchEvent(nextPageEvent);

          currentPage.nextElementSibling.classList.add("visible");
          window.scrollTo(0, 0);

          // if in a modal, scroll to the top of the modal on next button click
          if (document.getElementsByClassName("fba-modal")[0]) {
            document.getElementsByClassName("fba-modal")[0].scrollTo(0, 0);
          } else {
            window.scrollTo(0, 0);
          }
        }.bind(self))
      }
    }
  };
};

// Form Settings
var formOptions = {
  'modalButtonText': "How can we improve this site?",
  'formId': "15ca967f",
  'elementSelector': "contact-btn",

};

// Create unique Touchpoints form object
const touchpointForm15ca967f = new FBAform(document, window).init(formOptions);
