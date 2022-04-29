import { storesService } from "../services";
import { logInConsole } from "../utils/utils";

export const createStore = async (request, response, next) => {
    const requestBody: any = request.swagger.params.body.value;
    logInConsole(requestBody);

    try {
        let data = {
            ...requestBody,
        }

        data = JSON.parse(JSON.stringify(data));
        console.info(data);
       const newStore = await storesService.createStore(data);
        logInConsole(newStore);

        return response.status(200).send({ success: true, data: newStore });
    } catch (err) {
        console.error(`error in createStore ->`, err);
        next(err);
    }
}