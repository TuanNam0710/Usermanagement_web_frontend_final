import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { and } from 'vuelidate/lib/validators';

Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
    if (to.path == '/') {
        if (store.getters.isAuth) {
            next();
        } else {
            next({ path: '/login' });
        }
    }
    else if (to.path == '/login') {
        if (!store.getters.isAuth) {
            next();
        }
        else {
            next({ path: '/' });
        }
    } else if (to.path == '/users') {
        if (store.getters.isAuth) {
            next({ path: '/' });
        }
        else {
            next({ path: 'login' });
        }
    } else if (to.path == '/register') {
        if (store.getters.isAuth) {
            next({ path: '/' });
        }
        else {
            next();
        }
    } else if (to.path == '/reset-password') {
        if (store.getters.isAuth) {
            next({ path: '/' });
        }
        else {
            next();
        }
    } else {
        next();
    }
})

new Vue({
    router,
    store,
    vuetify,
    render: function (h) { return h(App) }
}).$mount('#app')
