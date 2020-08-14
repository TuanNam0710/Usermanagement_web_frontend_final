<template>
    <v-app>
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-spacer></v-spacer>
                                <v-toolbar-title>REGISTER A NEW ACCOUNT</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text @keyup.enter="register">
                                <v-form>
                                    <v-text-field
                                        label="First name"
                                        prepend-icon="mdi-account"
                                        type="text"
                                        v-model="form.first_name"
                                        :error-messages="first_nameErrors"
                                        @input="$v.form.first_name.$touch()"
                                        @blur="$v.form.first_name.$touch()"
                                    ></v-text-field>
                                    <v-text-field
                                        label="Last name"
                                        prepend-icon="mdi-account"
                                        type="text"
                                        v-model="form.last_name"
                                        :error-messages="last_nameErrors"
                                        @input="$v.form.last_name.$touch()"
                                        @blur="$v.form.last_name.$touch()"
                                    ></v-text-field>
                                    <v-text-field
                                        label="Email"
                                        prepend-icon="mdi-email"
                                        type="email"
                                        v-model="form.email"
                                        :error-messages="emailErrors"
                                        @input="$v.form.email.$touch()"
                                        @blur="$v.form.email.$touch()"
                                    ></v-text-field>
                                    <v-text-field
                                        label="Username"
                                        prepend-icon="mdi-account"
                                        type="text"
                                        v-model="form.username"
                                        :error-messages="usernameErrors"
                                        @input="$v.form.username.$touch()"
                                        @blur="$v.form.username.$touch()"
                                    ></v-text-field>
                                    <v-text-field
                                        label="Password"
                                        prepend-icon="mdi-lock"
                                        type="password"
                                        v-model="form.password"
                                        :error-messages="passwordErrors"
                                        @input="$v.form.password.$touch()"
                                        @blur="$v.form.password.$touch()"
                                    ></v-text-field>
                                    <v-text-field
                                        label="Retype password"
                                        prepend-icon="mdi-lock"
                                        type="password"
                                        v-model="form.password_confirmation"
                                        :error-messages="password_confirmationErrors"
                                        @input="$v.form.password_confirmation.$touch()"
                                        @blur="$v.form.password_confirmation.$touch()"
                                    ></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="register" :loading="loading" class="ml-4">Register</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" to="/login" text>Login instead?</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-snackbar top v-model="snackbar" color="error">
            Username or E-mail has already been used!
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, sameAs } from "vuelidate/lib/validators";
import { register } from "../api/user";
export default {
    mixins: [validationMixin],
    validations: {
        form: {
            first_name: { required },
            last_name: { required },
            email: { required, email },
            username: { required },
            password: { required },
            password_confirmation: { sameAsPassword: sameAs("password") },
        },
    },
    data() {
        return {
            form: {
                first_name: "",
                last_name: "",
                username: null,
                email: "",
                password: "",
                password_confirmation: "",
            },
            snackbar: false,
            loading: false,
        };
    },
    computed: {
        first_nameErrors() {
            const errors = [];
            if (!this.$v.form.first_name.$dirty) return errors;
            !this.$v.form.first_name.required &&
                errors.push("First name is required");
            return errors;
        },
        last_nameErrors() {
            const errors = [];
            if (!this.$v.form.last_name.$dirty) return errors;
            !this.$v.form.last_name.required &&
                errors.push("Last name is required");
            return errors;
        },
        usernameErrors() {
            const errors = [];
            if (!this.$v.form.username.$dirty) return errors;
            !this.$v.form.username.required &&
                errors.push("Username is required");
            return errors;
        },
        emailErrors() {
            const errors = [];
            if (!this.$v.form.email.$dirty) return errors;
            !this.$v.form.email.email && errors.push("Must be valid e-mail");
            !this.$v.form.email.required && errors.push("E-mail is required");
            return errors;
        },
        passwordErrors() {
            const errors = [];
            if (!this.$v.form.password.$dirty) return errors;
            !this.$v.form.password.required &&
                errors.push("Password is required");
            return errors;
        },
        password_confirmationErrors() {
            const errors = [];
            if (!this.$v.form.password_confirmation.$dirty) return errors;
            !this.$v.form.password_confirmation.sameAsPassword &&
                errors.push("Password do not match");
            return errors;
        },
    },
    methods: {
        async register() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            try {
                this.loading = true;
                let data = await register(this.form);
                this.$router.push("/login");
            } catch (error) {
                this.snackbar = true;
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>