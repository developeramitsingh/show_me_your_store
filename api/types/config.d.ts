declare interface IConfig {
    jwt: {
        jwtSecret: string;
        jwtSessionTimeout: string;
    },
    imageKit: {
        url: string;
    },
    algorithms: any;
}