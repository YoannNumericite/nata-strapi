export default {
  routes: [
    {
      method: "GET",
      path: "/app-content",
      handler: "app-content.getContent",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
