import axios from "axios";

export default class registerationForm {
    constructor() {
        this._csrf = document.querySelector('[name="_csrf"]').value
        this.form = document.querySelector("#registration-form")
        this.allFields = document.querySelectorAll("#registration-form .form-control")
        this.insertValidationElements()
        this.username = document.querySelectorAll("#username-register")
        this.username[0].previousValue = ""
        this.email = document.querySelector("#email-register")
        this.email.previousValue = ""
        this.password = document.querySelector("#password-register")
        this.password.previousValue = ""
        this.username[0].isUnique = false
        this.email.isUnique = false
        this.events()
    }

    // events
    events() {
        this.form.addEventListener("submit", e => {
            e.preventDefault()
            this.formSubmitHandler()
        })
        this.username[0].addEventListener("keyup", () => {
            this.isDifferent(this.username[0], this.usernameHandler)
        })
        this.email.addEventListener("keyup", () => {
            this.isDifferent(this.email, this.emailHandler)
        })
        this.password.addEventListener("keyup", () => {
            this.isDifferent(this.password, this.passwordHandler)
        })
        this.username[0].addEventListener("blur", () => {
            this.isDifferent(this.username[0], this.usernameHandler)
        })
        this.email.addEventListener("blur", () => {
            this.isDifferent(this.email, this.emailHandler)
        })
        this.password.addEventListener("blur", () => {
            this.isDifferent(this.password, this.passwordHandler)
        })
    }

    // methods
    formSubmitHandler() {
        this.usernameAfterDelay()
        this.usernameImmediately()
        this.emailAfterDelay()
        this.passwordImmediately()
        this.passwordAfterDelay()
        if (
            !this.password.errors
            && this.email.isUnique
            && !this.email.errors
            && this.username[0].isUnique
            && !this.username[0].errors
        ) {
            this.form.submit()
        }
    }

    isDifferent(el, handler) {
        if (el.previousValue != el.value) {
            handler.call(this)
        }
        el.previousValue = el.value
    }

    usernameHandler() {
        this.username[0].errors = false
        this.usernameImmediately()
        clearTimeout(this.username[0].timer)
        this.username[0].timer = setTimeout(() => this.usernameAfterDelay(), 800)
    }

    passwordHandler() {
        this.password.errors = false
        this.passwordImmediately()
        clearTimeout(this.password.timer)
        this.password.timer = setTimeout(() => this.passwordAfterDelay(), 800)
    }

    emailHandler() {
        this.email.errors = false
        clearTimeout(this.email.timer)
        this.email.timer = setTimeout(() => this.emailAfterDelay(), 800)
    }

    passwordImmediately() {
        if (this.password.value.length > 50) {
            this.showValidationError(this.password, "Password cannot exceed 50 characters.")
        }
        if (!this.password.errors) {
            this.hideValidationError(this.password)
        }
    }

    passwordAfterDelay() {
        if (this.password.value.length < 12) {
            this.showValidationError(this.password, "Password must be at least 12 characters.")
        }
    }

    usernameImmediately() {
        if (this.username[0].value != "" && !/^([a-zA-Z0-9]+)$/.test(this.username[0].value)) {
            this.showValidationError(this.username[0], "Username can only contain letters and numbers.")
        }
        if (this.username[0].value.length > 30) {
            this.showValidationError(this.username[0], "Username cannot exceed 30 characters.")

        }
        if (!this.username[0].errors) {
            this.hideValidationError(this.username[0])
        }
    }

    hideValidationError(el) {
        el.nextElementSibling.classList.remove("liveValidateMessage--visible")
    }

    showValidationError(el, message) {
        el.nextElementSibling.innerHTML = message
        el.nextElementSibling.classList.add("liveValidateMessage--visible")
        el.errors = true

    }

    emailAfterDelay() {
        if (!/^\S+@\S+$/.test(this.email.value)) {
            this.showValidationError(this.email, "You must provide a valid email address.")
        }
        if (!this.email.errors) {
            axios.post('/doesEmailExist', {_csrf: this._csrf, email: this.email.value}).then((response) => {
                if (response.data) {
                    this.email.isUnique = false
                    this.showValidationError(this.email, "That email is already being used.")
                } else {
                    this.email.isUnique = true
                    this.hideValidationError(this.email)
                }
            }).catch(() => {
                console.log("Please try again later.")
            })


        }
    }

    usernameAfterDelay() {
        if (this.username[0].value.length < 3) {
            this.showValidationError(this.username[0], "Username must be at least 3 characters.")
        }
        if (!this.username[0].errors) {
            axios.post('/doesUsernameExist', {_csrf: this._csrf, username: this.username[0].value}).then((response) => {
                if (response.data) {
                    this.showValidationError(this.username[0], "That username is already taken.")
                    this.username[0].isUnique = false

                } else {
                    this.username[0].isUnique = true
                }
            }).catch(() => {
                console.log("Please try again later.")

            })
        }

    }

    insertValidationElements() {
        this.allFields.forEach(function (el) {
            el.insertAdjacentHTML("afterend", '<div class="alert alert-danger small liveValidateMessage"></div>')
        })
    }
}