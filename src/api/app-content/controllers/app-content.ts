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
      const populating =
        serviceKey === "question"
          ? { responses: true }
          : serviceKey === "response"
          ? { question: true }
          : serviceKey === "month"
          ? { meetings: true, symptoms: true }
          : serviceKey === "meeting"
          ? { month: true }
          : {};

      data[serviceKey] = await strapi.service(service).find({
        ...ctx.query,
        pagination: { pageSize: 50 },
        populate: { ...populating },
      });
    };

    await Promise.all(
      allApiServices.map((service) => {
        const serviceKey = service.replace("api::", "").split(".")[0];
        return saveData(serviceKey, service);
      })
    );

    return data;
  },
};
