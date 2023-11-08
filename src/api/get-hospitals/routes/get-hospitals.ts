export default {
    routes: [
      {
        method: "GET",
        path: "/get-hospitals",
        handler: "get-hospitals.getHospitals",
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };