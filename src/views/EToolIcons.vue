<template>
    <v-container>
        <v-row>
            <v-col v-for="item in icons" :key="item.name" cols="3">
                <v-icon>{{'mdi-' + item.name}}</v-icon>
                <span> {{item.name}} </span>
            </v-col>
        </v-row>
        <v-pagination style="position: absolute; bottom: 8px; left: 0px;" class="pt-4" v-model="page" :length="page_count"></v-pagination>
    </v-container>
</template>

<script>
    const per_count = 72;
    import Icons from '../helper/icons'
    export default {
        mounted: function () {
            this.page = 1;
            this.page_count = Math.floor(Icons.length/per_count);
        },
        computed: {
            icons: function() {
                let size = Icons.length;
                let begin = (this.page-1)*per_count;
                let end = this.page*per_count-1;
                let res = [];
                for(let i=begin; i<=end && i<size; i++) {
                    res.push(Icons[i]);
                }
                return res;
            }
        },
        data: () => {
            return {
                page: 1,
                page_count: 0
            }
        }
    }
</script>