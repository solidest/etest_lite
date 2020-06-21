<template>
  <v-app>
    <e-sys-bar />
    <v-navigation-drawer permanent width="120">
      <v-row class="fill-height" no-gutters>
        <v-navigation-drawer mini-variant mini-variant-width="56" permanent>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/women/75.jpg"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-divider></v-divider>

          <!-- <v-list dense nav> -->

            <!-- <v-list-item v-for="item in items" :key="item.title">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list> -->
        </v-navigation-drawer>

        <!-- <v-list class="grow">
          <v-list-item v-for="link in links" :key="link" link>
            <v-list-item-title v-text="link"></v-list-item-title>
          </v-list-item>
        </v-list> -->
      </v-row>
    </v-navigation-drawer>
    <v-content>
    </v-content>
  </v-app>
</template>
<style>
  ::-webkit-scrollbar {
    display: none;
  }
</style>
<script>
  import ESysBar from './components/ESysBar'

  export default {
    name: 'App',

    components: {
      'e-sys-bar': ESysBar,
    },

    data: () => ({
      //
    }),
  };
</script>