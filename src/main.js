import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import CountryList from "@/components/CountryList/CountryList";
import VueRouter from "vue-router";
import {
    faAt,
    faBrush,
    faChartLine, faCode, faExclamationTriangle, faLink,
    faProcedures,
    faRunning,
    faSearch,
    faShare, faSkullCrossbones,
    faThumbtack
} from "@fortawesome/free-solid-svg-icons";
import ChartPage from "@/components/ChartPage/ChartPage";

library.add(faChartLine, faBrush, faSearch, faThumbtack, faShare, faRunning, faProcedures, faSkullCrossbones, faLink, faAt, faCode, faExclamationTriangle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

const routes = [
    {path: '/', component: CountryList},
    {path: '/chart/:countryStr', name: 'chart', component: ChartPage}
];

const router = new VueRouter({
    routes // short for `routes: routes`
});

Vue.use(VueRouter);

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');

