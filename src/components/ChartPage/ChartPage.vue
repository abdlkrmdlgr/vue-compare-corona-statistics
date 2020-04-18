<template>
    <div class="ChartPage">
        <div class="row text-center p-1">
            <div class="col-lg-3 col-md-3 col-sm-2 col-2">
                <p class="text-left">
                    <router-link to="/">
                <span class="btn btn-warning">
                    <font-awesome-icon icon="share" rotation="180" flip="horizontal"/>
                    <span class="d-lg-block d-md-block d-sm-none d-none">Back to Country List</span>
                </span>
                    </router-link>
                </p>
            </div>
            <div class="col-lg-9 col-md-9 col-sm-10 col-10">
                <h3 class="d-lg-block d-md-block d-sm-none d-none">Selected Countries Comparable Line Chart</h3>
                <h5 class="d-lg-none d-md-none d-sm-block d-block">Selected Countries Comparable Line Chart</h5>
            </div>
        </div>
        <span class="badge badge-info mr-1 p-2" v-for="country in selectedCountry"
              :key="country">#{{country}}</span>

        <hr class="m-2"/>
        <LineChart/>
    </div>
</template>

<script>
    import LineChart from "@/components/LineChart/LineChart";

    export default {
        components: {LineChart},
        props: {},
        data: function () {
            return {
                selectedCountry: []
            };
        },
        created() {
            this.selectedCountry = this.$route.params.countryStr.split("-");
        }
    };
</script>
