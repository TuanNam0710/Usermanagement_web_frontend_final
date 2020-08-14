<template>
    <v-app>
        <v-row align="center" class="mb-16" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Reset password form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                label="Enter the OTP sent to your E-mail"
                                name="otp"
                                prepend-icon="mdi-lock"
                                v-model="form.otp"
                                type="text"
                                :error-messages="otpErrors"
                                @input="$v.form.otp.$touch()"
                                @blur="$v.form.otp.$touch()"
                            ></v-text-field>
                            <v-text-field
                                label="Enter new password"
                                name="password"
                                prepend-icon="mdi-lock"
                                v-model="form.password"
                                type="password"
                                :error-messages="passwordErrors"
                                @input="$v.form.password.$touch()"
                                @blur="$v.form.password.$touch()"
                            ></v-text-field>
                            <v-text-field
                                label="Retype new password"
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
                        <v-btn :loading="loading" @click="validateOTP" color="primary">Submit OTP</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-snackbar top v-model="snackbar" color="error">
            {{ snackbar_title }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, sameAs } from "vuelidate/lib/validators";
import { checkOTP, resetPassword } from "../api/user";
export default {
    mixins: [validationMixin],
    validations: {
        form: {
            otp: { required },
            password: { required },
            password_confirmation: { sameAsPassword: sameAs("password") },
        },
    },
    data() {
        return {
            form: {
                otp: "",
                password: "",
                password_confirmation: "",
            },
            loading: false,
            snackbar: false,
            snackbar_title: "",
        };
    },
    computed: {
        otpErrors() {
            const errors = [];
            if (!this.$v.form.otp.$dirty) return errors;
            !this.$v.form.otp.required && errors.push("OTP is required");
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
        async validateOTP() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            this.loading = true;
            try {
                this.loading = true;
                let data = {
                    token: this.form.otp,
                };
                let user = await checkOTP(data);
                let data_user = {
                    id: user.id,
                    password: this.form.password,
                };
                await resetPassword(data_user);
                this.snackbar_title = "Success!";
                this.loading = false;
                this.$router.push("/login");
            } catch (error) {
                this.loading = false;
                this.snackbar_title = "Invalid OTP!";
                this.snackbar = true;
            }
        },
    },
};
</script>