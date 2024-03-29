import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import CountryList from "@/components/CountryList/CountryList";
import ChartPage from "@/components/ChartPage/ChartPage";
import VueRouter from "vue-router";
import VueAnalytics from 'vue-analytics';
import VMdDateRangePicker from "v-md-date-range-picker";

Vue.use(VMdDateRangePicker);

import {
    faAt,
    faPercentage,
    faBrush,
    faCalendarAlt,
    faChartLine,
    faCode,
    faSearch,
    faThumbtack,
    faShare,
    faRunning,
    faProcedures,
    faSkullCrossbones,
    faLink,
    faExclamationTriangle,
    faArrowCircleUp,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faAt,
    faPercentage,
    faBrush,
    faCalendarAlt,
    faChartLine,
    faCode,
    faSearch,
    faThumbtack,
    faShare,
    faRunning,
    faProcedures,
    faSkullCrossbones,
    faLink,
    faExclamationTriangle,
    faArrowCircleUp,
    faSpinner
);
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


// Configuration VueAnalytics
Vue.use(VueAnalytics, {
    id: 'UA-12370199-5',
    router
});


new Vue({
    render: h => h(App),
    router,
}).$mount('#app');

