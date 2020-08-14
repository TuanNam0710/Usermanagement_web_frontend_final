<template>
    <v-app>
        <v-app-bar app clipped-left style="color:white" color="blue lighten-1" dense>
            <v-toolbar-title class="mr-12 align-center">
                <span class="title">USER MANAGEMENT PAGE</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn dark @click="logout" text>Logout</v-btn>
        </v-app-bar>
        <v-main>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card>
                            <v-card-title>
                                <v-text-field
                                    v-model="search"
                                    label="Search"
                                    single-line
                                    hide-details
                                ></v-text-field>
                                <v-icon>mdi-magnify</v-icon>
                            </v-card-title>
                        </v-card>
                        <v-data-table
                            :headers="headers"
                            :search="search"
                            :items="users"
                            sort-by="id"
                            class="elevation-1"
                        >
                            <template v-slot:top>
                                <v-toolbar flat color="white">
                                    <v-toolbar-title>Users Table</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        @click="showCreateDialog"
                                        small
                                        class="mx-2"
                                        fab
                                        dark
                                        color="indigo"
                                    >
                                        <v-icon dark>mdi-plus</v-icon>
                                    </v-btn>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-icon @click="showEditDialog(item)" small class="mr-2">mdi-pencil</v-icon>
                                <v-icon @click="deleteUser(item.id)" small class="mr-2">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <span class="headline">{{ form_title }}</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text @keyup.enter="createUser">
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
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                    <v-btn v-if="!editing" color="blue darken-1" @click="createUser" text>Create</v-btn>
                    <v-btn v-else color="blue darken-1" @click="updateUser" text>Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar :color="status" top v-model="snackbar">
            {{ msg }}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, sameAs } from "vuelidate/lib/validators";
import { index, store, update, destroy } from "@/api/user_management";
import { logout, getInfo } from "@/api/user";
import { removeToken, removeCookie } from "../utils/auth";
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
            form_title: "",
            search: "",
            dialog: false,
            editing: false,
            snackbar: false,
            msg: "",
            status: "",
            form: {},
            headers: [
                {
                    text: "ID",
                    value: "id",
                },
                {
                    text: "Name",
                    value: "first_name",
                    align: "center",
                    sortable: false,
                },
                { text: "Username", value: "username", align: "center" },
                { text: "E-mail", value: "email", align: "center" },
                {
                    text: "Created at",
                    value: "created_at",
                    align: "center",
                },
                {
                    text: "Actions",
                    value: "actions",
                    align: "center",
                },
            ],
            users: [],
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
        async getUsers() {
            let { data } = await index();
            this.users = data;
            for (var i = 0; i < data.length; i++) {
                this.users[i].first_name =
                    data[i].first_name + " " + data[i].last_name;
            }
        },
        showCreateDialog() {
            this.editing = false;
            this.form_title = "Create new user";
            this.form = {
                first_name: "",
                last_name: "",
                email: "",
                username: "",
                password: "",
            };
            this.dialog = true;
        },
        showEditDialog(item) {
            this.editing = true;
            this.form_title = "Update user information";
            this.form = {
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
                username: item.username,
                password: "",
            };
            this.dialog = true;
        },
        async createUser() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            try {
                await store(this.form);
                this.dialog = false;
                this.getUsers();
                this.showMessage("Created user successfully!", "success");
            } catch (error) {
                this.showMessage(
                    "Something went wrong, please try again!",
                    "error"
                );
            }
        },
        async updateUser() {
            try {
                await update(this.form.id, this.form);
                this.dialog = false;
                this.getUsers();
                this.showMessage("Updated user successfully!", "success");
            } catch (error) {
                this.showMessage(
                    "Something went wrong, please try again!",
                    "error"
                );
            }
        },
        async deleteUser(id) {
            let data = getInfo();
            if (this.$store.state.id == id) {
                this.showMessage("Cannot delete yourself!", "error");
            } else {
                try {
                    await destroy(id);
                    this.getUsers();
                    this.showMessage("Deleted user successfully!", "success");
                } catch (error) {
                    this.showMessage(
                        "Something went wrong, please try again!",
                        "error"
                    );
                }
            }
        },
        async logout() {
            await logout();
            this.$store.commit("SET_TOKEN", null);
            removeToken();
            removeCookie();
            this.$router.push("/login");
        },
        showMessage(msg, status) {
            this.msg = msg;
            this.status = status;
            this.snackbar = true;
        },
    },
    created() {
        this.getUsers();
    },
};
</script>