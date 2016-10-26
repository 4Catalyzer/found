export default function getRoutes(routeConfig, { routeIndices }) {
  if (!routeIndices) {
    return null;
  }

  let lastRouteConfig = routeConfig;

  return routeIndices.map((routeIndex) => {
    const route = lastRouteConfig[routeIndex];
    lastRouteConfig = route.children;
    return route;
  });
}
