<template>
    <v-app id="inspire">
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-toolbar-title>Forgot password</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-form @keypress.enter="sendEmail">
                                    <v-text-field
                                        label="Enter your E-mail"
                                        name="email"
                                        prepend-icon="mdi-email"
                                        v-model="form.email"
                                        type="email"
                                        :error-messages="emailErrors"
                                        @input="$v.form.email.$touch()"
                                        @blur="$v.form.email.$touch()"
                                    ></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn to="/login" color="primary">Login instead</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                    :loading="loading"
                                    @click="sendEmail"
                                    color="primary"
                                >Send E-mail</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-snackbar top v-model="snackbar" color="error">
            User with this E-mail does not exist!
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { forgot } from "../api/user";
export default {
    mixins: [validationMixin],
    validations: {
        form: {
            email: { required, email },
        },
    },
    data() {
        return {
            form: {
                email: "",
            },
            loading: false,
            snackbar: false,
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
    },
    methods: {
        async sendEmail() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            let data = {
                email: this.form.email,
            };
            try {
                this.loading = true;
                await forgot(data);
                this.loading = false;
                this.$router.push("/reset-password");
            } catch (error) {
                this.loading = false;
                this.snackbar = true;
            }
        },
    },
};
</script>