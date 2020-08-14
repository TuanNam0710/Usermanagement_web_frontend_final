<template>
    <v-app>
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-spacer></v-spacer>
                                <v-toolbar-title justify="center">LOGIN TO YOUR ACCOUNT</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text @keyup.enter="login">
                                <v-form>
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
                                        label="Password"
                                        prepend-icon="mdi-lock"
                                        type="password"
                                        v-model="form.password"
                                        :error-messages="passwordErrors"
                                        @input="$v.form.password.$touch()"
                                        @blur="$v.form.password.$touch()"
                                    ></v-text-field>
                                    <v-row>
                                        <v-checkbox
                                            v-model="form.Rememberme"
                                            class="ml-7"
                                            label="Remember me"
                                        ></v-checkbox>
                                        <v-spacer></v-spacer>
                                        <v-col>
                                            <v-btn
                                                @click="forgotPassword"
                                                text
                                            >Forgot your password?</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" @click="login" :loading="loading">Login</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                            <v-card-actions>
                                <v-spacer></v-spacer>Don't have an account?
                                <v-btn color="primary" to="/register" text>Register</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-snackbar top v-model="snackbar" color="error">
            Wrong username or password!
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { login, getInfo } from "../api/user";
import { setToken } from "../utils/auth";
export default {
    mixins: [validationMixin],
    validations: {
        form: {
            email: { required, email },
            password: { required },
        },
    },
    data() {
        return {
            form: {
                email: "",
                password: "",
                Rememberme: false,
            },
            snackbar: false,
            loading: false,
        };
    },
    computed: {
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
    },
    methods: {
        async login() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            try {
                this.loading = true;
                if (!this.form.Rememberme) {
                    let data = await login(this.form);
                    let access_token = data.access_token;
                    this.$store.commit("SET_TOKEN", access_token);
                    setToken(access_token);
                } else {
                    let data = await login(this.form);
                    let access_token = data.access_token;
                    this.$store.commit("SET_TOKEN", access_token);
                    await setToken(access_token, this.form.Rememberme);
                }
                const { id } = await getInfo();
                this.$store.commit("SET_ID", id);
                this.$router.push("/");
            } catch (error) {
                this.snackbar = true;
                this.loading = false;
            } finally {
                this.loading = false;
            }
        },
        forgotPassword() {
            this.$router.push("/i-forgot");
        },
    },
};
</script>