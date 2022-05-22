import { permissionService } from "../services";

export const checkRouteAccess = async (request, response, next) => {
    try {
      console.info('Received request to checkRouteAccess.');
      console.info({role: request.user});
      const result = await permissionService.getPermissionByQuery({
        roleId: request.user.roleId._id,
        path: request.swagger.params.path.value,
      });
      console.info('Executed service');
  
      if (result) {
        return response.status(200).send({ success: true });
      } else {
        throw { success: false };
      }
    } catch (error) {
      console.error(`Error in checkRouteAccess: ${error}`);
      next(error);
    }
  };