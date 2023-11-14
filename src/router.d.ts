import { _RouteLocationBase, RouteLocation, Router } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router;
    $route: _RouteLocationBase & RouteLocation;
  }
}
