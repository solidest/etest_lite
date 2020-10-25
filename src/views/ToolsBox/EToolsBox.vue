<template>
  <v-container>
    <v-data-iterator :items="items" hide-default-footer no-data-text="还没有任何安装工具" disable-pagination>
      <template v-slot:header>
      </template>
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
            <v-card>
              <v-card-title class="subheading font-weight-bold blue--text" style="cursor: pointer"
                @click.stop="open_tool(item)">
                {{item.text}}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 80px">
                <span>{{item.memo}}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
  import cfg from './config';

  export default {

    data: () => {
      return {
        items: cfg.tools_list,
      }
    },
    methods: {
      open_tool(item) {
        console.log(item);
      }
    }
  }
</script>