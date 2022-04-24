export const hello = (request, response) => {
    response.status(200).send("welcome to hello");
}