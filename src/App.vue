<template>
    <router-view></router-view>
</template>

<script>
import Login from "./views/Login";
import Register from "./views/Register";
import Home from "./views/Home";
import Forgot from "./components/Forgot";
export default {
    components: {
        Login,
        Register,
        Home,
        Forgot,
    },

    data: () => ({}),
};
</script>
