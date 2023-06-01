/**
 * A set of functions called "actions" for `app-content`
 */

export default {
  getContent: async (ctx, next) => {
    const data: any = {};

    const allApiServices = Object.keys(await strapi.services).filter(
      (service) =>
        service.startsWith("api::") &&
        service !== "api::app-content.app-content"
    );

    const saveData = async (serviceKey, service) => {
      data[serviceKey] = await strapi
        .service(service)
        .find({ ...ctx.query, pagination: { pageSize: 50 } });
    };

    await Promise.all(
      allApiServices.map((service) => {
        const serviceKey = service.replace("api::", "").split(".")[0];
        return saveData(serviceKey, service);
      })
    );

    return { data };
  },
};
