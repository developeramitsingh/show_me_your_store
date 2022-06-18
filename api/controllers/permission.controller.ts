import { permissionService } from "../services";

export const checkRouteAccess = async (request, response, next) => {
    try {
      console.info('Received request to checkRouteAccess.');
      const result = await permissionService.getPermissionByQuery({
        roleId: request.user.roleId._id,
        path: request.swagger.params.path.value,
      });
  
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