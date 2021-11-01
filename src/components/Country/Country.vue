<template>
    <div class="Country">
        <div class="countryItemLabel">
            <div style="position: absolute; right: 30px; top:10px" class="h5 d-lg-block d-md-block d-sm-none d-none">{{countryNameStr}}</div>
            <div style="position: absolute; right: 30px; top:5px"
                 class="d-lg-none d-md-none d-sm-block d-block">{{countryNameStr}}</div>
            <div class="text-left mt-4">
                <img :src="flagUrl"/>
            </div>
        </div>
    </div>
</template>

<script>
    import flagJson from "../../../countryNameToCode";
    export default {
        name: 'Country',
        props: {
            data: Array,
            countryName: String
        },
        computed: {
            flagUrl: function () {
                 return "https://flagcdn.com/48x36/"+flagJson[this.countryName].toLowerCase()+".png"
            }
        },
        data() {
            return {
                countryNameStr: this.countryName,
            }
        }
    };
</script>
