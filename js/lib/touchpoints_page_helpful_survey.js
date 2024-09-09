/*
  This JS is included directly from the touchpoints app.  Included here to
  avoid writing unsafe content security policy allowances just for touchpoints.
  Minor changes were made to the original source to avoid inline styles.

  Removed loadCss() function and moved the CSS content to sass/_touchpoints.scss
*/

// Form components are namespaced under 'fba' = 'Feedback Analytics'
// Updated: July 2024
'use strict';

function FBAform(d, N) {
  return {
    formComponent: function () {
      return d.querySelector("[data-touchpoints-form-id='" + this.options.formId + "']")
    },
    formElement: function () {
      return this.formComponent().querySelector("form");
    },
    activatedButton: null, // tracks a reference to the button that was clicked to open the modal
    isFormSubmitted: false, // defaults to false
    // enable Javascript experience
    javascriptIsEnabled: function () {
      var javascriptDisabledMessage = d.getElementsByClassName("javascript-disabled-message")[0];
      var touchpointForm = d.getElementsByClassName("touchpoint-form")[0];
      if (javascriptDisabledMessage) {
        javascriptDisabledMessage.classList.add("hide");
      }
      if (touchpointForm) {
        touchpointForm.classList.remove("hide");
      }
    },
    init: function (options) {
      this.javascriptIsEnabled();
      this.options = options;
      this._loadHtml();
      if (!this.options.suppressUI && (this.options.deliveryMethod && this.options.deliveryMethod === 'modal')) {
        this.loadButton();
      }
      this._bindEventListeners();
      this.dialogOpen = false; // initially false
      this.successState = false; // initially false
      this._pagination();
      if (this.options.formSpecificScript) {
        this.options.formSpecificScript();
      }
      d.dispatchEvent(new CustomEvent('onTouchpointsFormLoaded', {
        detail: {
          formComponent: this
        }
      }));
      return this;
    },
    _bindEventListeners: function () {
      var self = this;
      d.addEventListener('keyup', function (event) {
        var x = event.keyCode;
        if (x == 27 && self.dialogOpen == true) {
          self.closeDialog();
        }
      });
      d.addEventListener('click', function (event) {
        self.openModalDialog(event);
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
    _loadHtml: function () {
      if ((this.options.deliveryMethod && this.options.deliveryMethod === 'inline') && this.options.suppressSubmitButton) {
        if (this.options.elementSelector) {
          if (d.getElementById(this.options.elementSelector) != null) {
            d.getElementById(this.options.elementSelector).innerHTML = this.options.htmlFormBodyNoModal();
          }
        }
      } else if (this.options.deliveryMethod && this.options.deliveryMethod === 'inline') {
        if (this.options.elementSelector) {
          if (d.getElementById(this.options.elementSelector) != null) {
            d.getElementById(this.options.elementSelector).innerHTML = this.options.htmlFormBody();
          }
        }
      }
      if (this.options.deliveryMethod && (this.options.deliveryMethod === 'modal' || this.options.deliveryMethod === 'custom-button-modal')) {
        this.dialogEl = d.createElement('div');
        this.dialogEl.setAttribute("hidden", true);
        this.dialogEl.setAttribute("aria-hidden", true);
        this.dialogEl.setAttribute('class', 'fba-modal');
        this.dialogEl.setAttribute('data-touchpoints-form-id', this.options.formId);

        this.dialogEl.innerHTML = this.options.htmlFormBody();
        d.body.appendChild(this.dialogEl);

        this.formComponent().querySelector('.fba-modal-close').addEventListener('click', this.handleDialogClose.bind(this), false);
      }
      var otherElements = this.formElement().querySelectorAll(".usa-input.other-option");
      for (var i = 0; i < otherElements.length; i++) {
        otherElements[i].addEventListener('keyup', this.handleOtherOption.bind(this), false);
      }
      var phoneElements = this.formElement().querySelectorAll("input[type='tel']");
      for (var i = 0; i < phoneElements.length; i++) {
        phoneElements[i].addEventListener('keyup', this.handlePhoneInput.bind(this), false);
      }
      if (this.options.deliveryMethod && this.options.deliveryMethod === 'custom-button-modal') {
        if (this.options.elementSelector) {
          if (d.getElementById(this.options.elementSelector) != null) {
            d.getElementById(this.options.elementSelector).addEventListener('click', this.handleButtonClick.bind(this), false);
          }
        }
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
    openModalDialog: function (e) {
      if (this.options.deliveryMethod && this.options.deliveryMethod === 'modal') {
        if (this.dialogOpen && !e.target.closest('#fba-button') && !e.target.closest('.fba-modal-dialog')) {
          this.closeDialog();
        }
      } else if (this.options.deliveryMethod && this.options.deliveryMethod === 'custom-button-modal') {
        if (this.dialogOpen && !e.target.closest('#' + this.options.elementSelector) && !e.target.closest('.fba-modal-dialog')) {
          this.closeDialog();
        }
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
          const PhoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
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
      if (!errorPage.classList.contains("fba-visible")) {
        var visiblePage = this.formComponent().getElementsByClassName("section fba-visible")[0];
        visiblePage.classList.remove("fba-visible");
        errorPage.classList.add("fba-visible");
      }

      questionDiv.setAttribute('class', 'usa-form-group usa-form-group--error');
      var span = d.createElement('span');
      span.setAttribute('id', 'input-error-message');
      span.setAttribute('role', 'alert');
      span.setAttribute('class', 'usa-error-message');
      span.innerText = error + questionNum;
      label.parentNode.insertBefore(span, label.nextSibling);
      var input = d.createElement('input');
      input.setAttribute('hidden', 'true');
      input.setAttribute('id', 'input-error');
      input.setAttribute('type', 'text');
      input.setAttribute('name', 'input-error');
      input.setAttribute('aria-describedby', 'input-error-message');
      questionDiv.appendChild(input);
      questionDiv.scrollIntoView();
      questionDiv.focus();

      // enable submit button ( so user can fix error and resubmit )
      var submitButton = this.formComponent().querySelector("[type='submit']");
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
      // Add a landmark for button
      this.landmarkElement = d.createElement('aside');
      this.landmarkElement.setAttribute('aria-label', 'Feedback button');
      this.landmarkElement.setAttribute('role', 'complementary');

      // Add the fixed, floating tab button
      this.buttonEl = d.createElement('a');
      this.buttonEl.setAttribute('id', 'fba-button');
      this.buttonEl.setAttribute('data-id', this.options.formId);
      this.buttonEl.setAttribute('class', 'fba-button fixed-tab-button usa-button');
      this.buttonEl.setAttribute('name', 'fba-button');
      this.buttonEl.setAttribute('href', 'javascript:void(0)');
      this.buttonEl.setAttribute('aria-haspopup', 'dialog');
      this.buttonEl.setAttribute('aria-controls', 'dialog');
      this.buttonEl.addEventListener('click', this.handleButtonClick.bind(this), false);
      this.buttonEl.innerHTML = this.options.modalButtonText;
      this.landmarkElement.appendChild(this.buttonEl);
      d.body.appendChild(this.landmarkElement);

      this.loadFeebackSkipLink();
    },
    loadFeebackSkipLink: function () {
      this.skipLink = d.createElement('a');
      this.skipLink.setAttribute('class', 'usa-skipnav touchpoints-skipnav');
      this.skipLink.setAttribute('href', '#fba-button');
      this.skipLink.addEventListener('click', function () {
        d.querySelector("#fba-button").focus();
      });
      this.skipLink.innerHTML = 'Skip to feedback';

      var existingSkipLinks = d.querySelector('.usa-skipnav');
      if (existingSkipLinks) {
        existingSkipLinks.insertAdjacentElement('afterend', this.skipLink);
      } else {
        d.body.prepend(this.skipLink);
      }
    },
    // Used when in a modal
    loadDialog: function () {
      d.dispatchEvent(new Event('onTouchpointsModalOpen'));
      this.formComponent().removeAttribute("hidden");
      this.formComponent().setAttribute('aria-hidden', false);
      this.formComponent().focus()
      this.dialogOpen = true;
    },
    closeDialog: function () {
      d.dispatchEvent(new Event('onTouchpointsModalClose'));
      this.formComponent().setAttribute("hidden", true);
      this.formComponent().setAttribute('aria-hidden', true);
      this.activatedButton?.focus?.();
      this.dialogOpen = false;
    },
    sendFeedback: function () {
      d.dispatchEvent(new Event('onTouchpointsFormSubmission'));
      var form = this.formElement();
      this.ajaxPost(form, this.formSuccess);
    },
    successHeadingText: function () {
      return this.options.successTextHeading;
    },
    successText: function () {
      return this.options.successText;
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
      this.formComponent().scrollIntoView();

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
          d.dispatchEvent(new Event('onTouchpointsFormSubmissionSuccess'));
          this.isFormSubmitted = true;
          if (submitButton) {
            submitButton.disabled = true;
          }
          this.showFormSuccess();
        } else if (e.target.status === 422) { // FORM ERRORS
          this.successState = false;
          d.dispatchEvent(new Event('onTouchpointsFormSubmissionError'));
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
      var params = this.options.questionParams(form);

      // Combine Referrer and Pathname with Form-specific params
      params["referer"] = d.referrer;
      params["hostname"] = N.location.hostname;
      params["page"] = N.location.pathname;
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
    _pagination: function () {
      var previousButtons = this.formComponent().getElementsByClassName("previous-section");
      var nextButtons = this.formComponent().getElementsByClassName("next-section");

      var self = this;
      for (var i = 0; i < previousButtons.length; i++) {
        previousButtons[i].addEventListener('click', function (e) {
          e.preventDefault();
          var currentPage = e.target.closest(".section");
          if (!this.validateForm(currentPage)) return false;
          currentPage.classList.remove("fba-visible");
          this.currentPageNumber--;
          this.showInstructions();
          currentPage.previousElementSibling.classList.add("fba-visible");

          const previousPageEvent = new CustomEvent('onTouchpointsFormPreviousPage', {
            detail: {
              formComponent: this
            }
          });
          d.dispatchEvent(previousPageEvent);

          // if in a modal, scroll to the top of the modal on previous button click
          if (this.formComponent().getElementsByClassName("fba-modal")[0]) {
            this.formComponent().scrollTo(0, 0);
          } else {
            N.scrollTo(0, 0);
          }
        }.bind(self));
      }
      for (var i = 0; i < nextButtons.length; i++) {
        nextButtons[i].addEventListener('click', function (e) {
          e.preventDefault();
          var currentPage = e.target.closest(".section");
          if (!this.validateForm(currentPage)) return false;
          currentPage.classList.remove("fba-visible");
          this.currentPageNumber++;
          this.showInstructions();
          currentPage.nextElementSibling.classList.add("fba-visible");

          const nextPageEvent = new CustomEvent('onTouchpointsFormNextPage', {
            detail: {
              formComponent: this
            }
          });
          d.dispatchEvent(nextPageEvent);

          // if in a modal, scroll to the top of the modal on next button click
          if (this.formComponent().getElementsByClassName("fba-modal")[0]) {
            this.formComponent().scrollTo(0, 0);
          } else {
            N.scrollTo(0, 0);
          }
        }.bind(self))
      }
    }
  };
};

// Specify the options for your form
const touchpointFormOptions9ae710d3 = {
  'formId': "9ae710d3",
  'modalButtonText': "Help improve this site",
  'elementSelector': "touchpoints-yes-no-form",
  'formSpecificScript': function () {
  },
  'deliveryMethod': "inline",
  'successTextHeading': "Success",
  'successText': "Thank you. Your feedback has been received.",
  'questionParams': function (form) {
    return {
      answer_01: form.querySelector("input[name=question_49328_answer_01]") && form.querySelector("input[name=question_49328_answer_01]").value,
    }
  },
  'suppressUI': false,
  'suppressSubmitButton': true,
  'htmlFormBody': function () {
    return null;
  },
  'htmlFormBodyNoModal': function () {
    return "<div\n  class=\"touchpoints-form-wrapper \"\n  id=\"touchpoints-form-9ae710d3\"\n  data-touchpoints-form-id=\"9ae710d3\"\n>\n  <div class=\"wrapper\">\n    <header>\n  <h1\n    class=\"word-break fba-modal-title\"\n    id=\"fba-form-title-9ae710d3\">\n    <span class=\"usa-sr-only\">\n      Feedback form\n    <\/span>\n  <\/h1>\n<\/header>\n    <div class=\"fba-alert usa-alert usa-alert--success\" role=\"status\" hidden>\n  <div class=\"usa-alert__body\">\n    <h2 class=\"usa-alert__heading\">\n      Success\n    <\/h2>\n    <div class=\"usa-alert__text\">\n      Thank you. Your feedback has been received.\n    <\/div>\n  <\/div>\n<\/div>\n<div class=\"fba-alert-error usa-alert usa-alert--error\" role=\"alert\" hidden>\n  <div class=\"usa-alert__body\">\n    <h2 class=\"usa-alert__heading\">\n      Error\n    <\/h2>\n    <p class=\"usa-alert__text\">\n      alert message\n    <\/p>\n  <\/div>\n<\/div>\n\n    \n<form\n  action=\"https://touchpoints.app.cloud.gov/touchpoints/9ae710d3/submissions.json\"\n  class=\"usa-form usa-form--large margin-bottom-2\"\n  method=\"POST\">\n  <div class=\"touchpoints-form-body\">\n        <input type=\"hidden\" name=\"fba_location_code\" id=\"fba_location_code\" tabindex=\"-1\" autocomplete=\"off\" />\n    <input\n      type=\"text\"\n      name=\"fba_directive\"\n      id=\"fba_directive\"\n      class=\"display-none\"\n      title=\"fba_directive\"\n      aria-hidden=\"true\"\n      tabindex=\"-1\"\n      autocomplete=\"off\">\n      <div class=\"section fba-visible\">\n\n\n\n        <div class=\"questions\">\n\n          <div class=\"question white-bg\"\n            id=\"question_49328\">\n              <div class=\"touchpoints-yes-no-buttons\">\n  <label for=\"question_49328_answer_01\">\n    Is this page helpful?\n  <\/label>\n  <p class=\"submit-button\" id=\"question_49328_answer_01\">\n    <input type=\"hidden\" class=\"fba-touchpoints-page-form\" name=\"question_49328_answer_01\" value=\"\">\n    <input type=\"submit\" class=\"usa-button usa-button-group__item\" value=\"yes\">\n    <input type=\"submit\" class=\"usa-button usa-button-group__item\" value=\"no\">\n  <\/p>\n<\/div>\n\n          <\/div>\n        <\/div>\n\n      <\/div>\n  <\/div>\n<\/form>\n\n  <\/div>\n  \n<\/div>\n";
  }
}

// Create an instance of a Touchpoints form object
const touchpointForm9ae710d3 = new FBAform(document, window).init(touchpointFormOptions9ae710d3);

// Include USWDS JS if required
